const {
  SCOPE,
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
  APP_HOST
} = require('nconf').get('app')
const queryString = require('query-string')
const crypto = require('crypto')
const httpReq = require('server/services/http-client')
const logger = require('server/services/logger')
const path = require('path')
const { Store } = require('server/models')

module.exports = {
  async init (ctx, next) {
    const { shop } = ctx.request.query

    let redirectURL = buildRedirectURL(ctx)
    logger.debug('redirectURL: ' + redirectURL)
    // ctx.redirect(redirectURL)
    await ctx.render(path.resolve(__dirname, 'init-shopify'), { redirectURL: redirectURL, storeIdentifier: shop.replace('.myshopify.com', '') })
  },

  async authCallback (ctx, next) {
    const { code, hmac, shop } = ctx.request.query
    logger.debug({ code, hmac, shop, session: ctx.session })

    if (await isAccessTokenValid(ctx)) {
      return next()
    }

    await validateHMAC(ctx)

    if (!shop) ctx.throw(400, 'Expected a shop query parameter')

    let { access_token } = await getAccessToken(ctx)

    ctx.request.accessToken = access_token
    await setSession(ctx)
    await saveAccessToken(ctx)

    await next()
  },

  async isRecurringChargeEnabled (ctx, next) {
    logger.debug({ message: 'inside isRecurringChargeEnabled' })

    /*
    * get Store information
    * if status = accepted, inforce in UI to redirect to notifiers
    * else
    * if charge object is not present, create a charge record, update store with the charge record
    * send confirmation_url to UI for redirection
    * Handle charge decline/accept
    */


    let store = await Store.findOne({ storeIdentifier: ctx.session.storeIdentifier }).exec()

    if (store && store.appCharge && store.appCharge.status === 'accepted') {
      ctx.body = { status: true }
    } else {
      ctx.body = await createRecurringCharge(ctx, store)
    }
  },

  async handleChargeAcceptDecline (ctx, next) {
    logger.debug({ message: 'inside handleChargeAcceptDecline', query: ctx.request.query })

    /*
    * get charge-id from url query
    * get charge record from shopify url
    * if status = accepted, update store info && redirect to index file ctx.redirect(`/?storeIdentifier=${storeIdentifier}`)
    * else redirect shopify apps location
    */

    let chargeId = ctx.request.query.charge_id
    let chargeRecord = await getChargeRecordFromShopify(ctx, chargeId)

    logger.debug({ chargeRecord })

    if (chargeRecord.status === 'accepted') {
      let store = await Store.findOne({ storeIdentifier: ctx.session.storeIdentifier }).exec()
      store.appCharge.status = 'accepted'
      await Store.findByIdAndUpdate(store._id, store, { new: true }).exec()

      if (!chargeRecord.activated_on) await activateChargeRecord(ctx, chargeRecord)

      ctx.redirect(`/?storeIdentifier=${ctx.session.storeIdentifier}`)
    } else {
      ctx.redirect(`https://${ctx.session.storeIdentifier}.myshopify.com/admin/apps`)
    }
  }
}

/*-------------------------Private methods--------------------------*/

const buildRedirectURL = (ctx) => {
  const { shop } = ctx.request.query

  if (!shop) ctx.throw(400, 'Expected a shop query parameter')

  const redirectTo = `https://${shop}/admin/oauth/authorize`

  const redirectParams = {
    scope: SCOPE,
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI
  }

  logger.debug('redirectParams: ' + JSON.stringify(redirectParams))
  let toReturn = `${redirectTo}?${queryString.stringify(redirectParams)}`
  return toReturn
}

const activateChargeRecord = async (ctx, chargeRecord) => {
  logger.debug({ message: `Inside activateChargeRecord`, chargeRecord})

  const storeIdentifier = ctx.session.storeIdentifier
  const reqConfig = {
    url: `https://${storeIdentifier}.myshopify.com/admin/recurring_application_charges/${chargeRecord.id}/activate.json`,
    headers: {
      'X-Shopify-Access-Token': ctx.session.accessToken
    },
    data: chargeRecord
  }

  await httpReq.post(reqConfig)
}

const createRecurringCharge = async (ctx, store) => {
  logger.debug({ message: 'inside createRecurringCharge' })

  if (store && !(store.appCharge && store.appCharge.status === 'accepted')) {
    let response = await createRecurringChargeRecord(ctx)
    store.appCharge = response.recurring_application_charge
    store = await Store.findByIdAndUpdate(store._id, store, { new: true }).exec()
  }

  logger.debug({ store })

  return { confirmation_url: store.appCharge.confirmation_url, status: false }
}

const getChargeRecordFromShopify = async (ctx, chargeId) => {
  logger.debug({ message: `Inside getChargeRecordFromShopify. chargeId: ${chargeId}`})

  const storeIdentifier = ctx.session.storeIdentifier
  const reqConfig = {
    url: `https://${storeIdentifier}.myshopify.com/admin/recurring_application_charges/${chargeId}.json`,
    headers: {
      'X-Shopify-Access-Token': ctx.session.accessToken
    }
  }

  let result = await httpReq.get(reqConfig)

  return result.recurring_application_charge
}

const createRecurringChargeRecord = async (ctx) => {
  logger.debug({ message: `Creating recurring charge for shop: ${ctx.session.storeIdentifier}`})

  const testChargeStoreIdentifiers = ['satging-realtime-notifier', 'production-realtime-notifier']

  const storeIdentifier = ctx.session.storeIdentifier
  const reqConfig = {
    url: `https://${storeIdentifier}.myshopify.com/admin/recurring_application_charges.json`,
    data: {
      recurring_application_charge: {
        name: 'Basic Plan',
        price: 1.99,
        return_url: `${APP_HOST}/adaptor/charge-accept-decline`,
        trial_days: 5,
        test: testChargeStoreIdentifiers.includes(storeIdentifier)
      }
    },
    headers: {
      'X-Shopify-Access-Token': ctx.session.accessToken
    }
  }

  return await httpReq.post(reqConfig)
}

const isAccessTokenValid = async (ctx) => {
  let toReturn = false

  if (ctx.session.accessToken && ctx.session.storeIdentifier === getStoreIdentifierFromCtx(ctx)) {
    try {
      let reqData = {
        url: `https://${ctx.request.query.shop}/admin/webhooks.json`,
        headers: {
          'X-Shopify-Access-Token': ctx.session.accessToken
        }
      }

      await httpReq.get(reqData, ctx)

      toReturn = true
    } catch (e) {
      logger.debug(`Access token verification. err: ${e.message}`)
    }
  }

  logger.debug({ message: `isAccessTokenValid: ${toReturn}`})
  return toReturn
}

const getStoreIdentifierFromCtx = (ctx) => {
  return ctx.request.query.shop.replace('.myshopify.com', '')
}

const setSession = (ctx) => {
  const { accessToken } = ctx.request
  const { shop } = ctx.request.query

  ctx.session.accessToken = accessToken
  ctx.session.storeIdentifier = shop.replace('.myshopify.com', '')
}

const saveAccessToken = async (ctx) => {
  logger.debug('saving accessToken')
  const { query, accessToken } = ctx.request
  const { code, hmac, shop } = query
  const storeIdentifier = shop.replace('.myshopify.com', '')

  let storeDoc = await Store.findOne({ storeIdentifier }).exec()

  if (storeDoc) {
    storeDoc.access_token = accessToken
    let storeStatus = storeDoc.status
    storeDoc.status = 'active'

    await Promise.all([
      await storeDoc.save(),
      (async () => {
        if (storeStatus !== 'active') {
          logger.debug('Store reinstallation triggered.')
          await createNewStoreMetadata(ctx, storeDoc)
        }
      })()
    ])

  } else {
    storeDoc = {
      storeIdentifier,
      password: '',
      access_token: accessToken
    }

    storeDoc = await Store.create(storeDoc)
    await createNewStoreMetadata(ctx, storeDoc)

    logger.debug(`accessToken saved successfully. storeDoc: ${JSON.stringify(storeDoc)}` )
  }

  logger.debug({ storeDoc })
}

const createNewStoreMetadata = async (ctx, storeDoc) => {
  logger.info({ message: 'Creating new store metadata'})

  await Promise.all([
    // await createRecurringCharge(ctx),
    await createAppUninstallWebhook(ctx),
    await updateStoreInfo(ctx, storeDoc)
  ])
}

const updateStoreInfo = async (ctx, storeDoc) => {
  logger.info({ message: 'Updating store information...'})

  const { shop } = ctx.request.query

  let reqData = {
    url: `https://${shop}/admin/shop.json`,
    headers: {
      'X-Shopify-Access-Token': ctx.session.accessToken
    }
  }

  let storeInfo = await httpReq.get(reqData, ctx)
  storeDoc.storeInfo = storeInfo.shop

  await Store.findByIdAndUpdate(storeDoc._id, storeDoc).exec()
}

const createAppUninstallWebhook = async (ctx) => {
  logger.info({ message: 'Creating app uninstall webhook'})
  const { query } = ctx.request
  const { code, hmac, shop } = query
  const storeIdentifier = shop.replace('.myshopify.com', '')

  let reqData = {
    url: `https://${shop}/admin/webhooks.json`,
    data: {
      webhook: {
        topic: `app/uninstalled`,
        address: `${APP_HOST}/api/webhooks/appuninstall/${storeIdentifier}/data`,
        format: 'json'
      }
    },
    headers: {
      'X-Shopify-Access-Token': ctx.session.accessToken
    }
  }

  try {
    await httpReq.post(reqData, ctx)
  } catch (e) {
    logger.debug({message: 'Error creating app uninstall webhook', body: (e.response ? e.response.body : e.message)})
  }
}

const getAccessToken = async (ctx) => {
  logger.debug('Fetching accessToken...')
  const { query } = ctx.request
  const { code, hmac, shop } = query

  const reqConfig = {
    url: `https://${shop}/admin/oauth/access_token`,
    data: {
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET
    }
  }

  let toReturn = await httpReq.post(reqConfig)
  return toReturn
}

const validateHMAC = (ctx) => {
  logger.debug('Validating HMAC')
  const { query } = ctx.request
  const { code, hmac, shop } = query

  const map = JSON.parse(JSON.stringify(query));
  delete map['signature'];
  delete map['hmac'];

  const message = queryString.stringify(map);
  const generated_hash = crypto
    .createHmac('sha256', CLIENT_SECRET)
    .update(message)
    .digest('hex');

  if (generated_hash !== hmac) ctx.throw(400, 'HMAC validation failed')
  logger.debug('HMAC validated successfully')
}
