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
const { Stores } = require('server/models')

module.exports = {
  async init (ctx, next) {
    const { shop } = ctx.request.query

    let redirectURL = buildRedirectURL(ctx)
    logger.debug('redirectURL: ' + redirectURL)
    // ctx.redirect(redirectURL)
    await ctx.render(
      'server/router/adaptor/init-shopify',
      {
        redirectURL,
        store_identifier: shop.replace('.myshopify.com', '')
      })
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

    ctx.request.access_token = access_token
    await setSession(ctx)
    saveAccessToken(ctx)

    await next()
  },

  async getAppCharge (ctx, next) {
    logger.debug({ message: 'inside getAppCharge method' })
    let storeDoc = await Stores.findOne({ store_identifier: ctx.session.store_identifier }).exec()
    ctx.body = storeDoc.app_charge
    await next()
  },

  async createRecurringCharge (ctx, next) {
    logger.debug({ message: 'inside createRecurringCharge' })
    let storeDoc
    let shopifyRes

    await Promise.all([
      (async () => {
        storeDoc = await Stores.findOne({ store_identifier: ctx.session.store_identifier }).exec()
      })(),
      (async () => {
        shopifyRes = await createShopifyRecurringChargeRecord(ctx)
      })()
    ])

    storeDoc.app_charge = shopifyRes.recurring_application_charge
    storeDoc = await Stores.findByIdAndUpdate(storeDoc._id, storeDoc, { new: true }).exec()
    logger.debug({ storeDoc })
    ctx.body = storeDoc.app_charge
    await next()
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
      let store = await Stores.findOne({ store_identifier: ctx.session.store_identifier }).exec()
      store.app_charge.status = 'accepted'
      await Stores.findByIdAndUpdate(store._id, store, { new: true }).exec()

      if (!chargeRecord.activated_on) activateChargeRecord(ctx, chargeRecord)

      ctx.redirect(`/?storeIdentifier=${ctx.session.store_identifier}`)
    } else {
      ctx.redirect(`https://${ctx.session.store_identifier}.myshopify.com/admin/apps`)
    }
  }
}

/* -------------------------Private methods-------------------------- */

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

const isAccessTokenValid = async (ctx) => {
  let toReturn = false

  if (ctx.session.access_token && ctx.session.store_identifier === getstoreIdentifierFromCtx(ctx)) {
    try {
      let reqData = {
        url: `https://${ctx.request.query.shop}/admin/webhooks.json`,
        headers: {
          'X-Shopify-Access-Token': ctx.session.access_token
        }
      }

      await httpReq.get(reqData, ctx)

      toReturn = true
    } catch (e) {
      logger.debug(`Access token verification. err: ${e.message}`)
    }
  }

  logger.debug({ message: `isAccessTokenValid: ${toReturn}` })
  return toReturn
}

const validateHMAC = async (ctx) => {
  logger.debug('Validating HMAC')
  const { query } = ctx.request
  const { hmac } = query

  const map = JSON.parse(JSON.stringify(query))
  delete map['signature']
  delete map['hmac']

  const message = queryString.stringify(map)
  const generatedHash = crypto
    .createHmac('sha256', CLIENT_SECRET)
    .update(message)
    .digest('hex')

  if (generatedHash !== hmac) ctx.throw(400, 'HMAC validation failed')
  logger.debug('HMAC validated successfully')
}

const getAccessToken = async (ctx) => {
  logger.debug('Fetching access_token...')
  const { code, shop } = ctx.request.query

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

const setSession = async (ctx) => {
  const { access_token } = ctx.request
  const { shop } = ctx.request.query

  ctx.session.access_token = access_token
  ctx.session.store_identifier = shop.replace('.myshopify.com', '')
}

const saveAccessToken = async (ctx) => {
  logger.debug('saving access_token')
  const { query, access_token } = ctx.request
  const { shop } = query
  const store_identifier = shop.replace('.myshopify.com', '')

  let storeDoc = await Stores.findOne({ store_identifier }).exec()

  if (storeDoc) {
    storeDoc.secret_info.access_token = access_token
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
      store_identifier,
      secret_info: {
        access_token
      }
    }

    storeDoc = await Stores.create(storeDoc)
    await createNewStoreMetadata(ctx, storeDoc)

    logger.debug({ message: 'access_token saved successfully.' })
  }

  logger.debug({ storeDoc })
}

const getstoreIdentifierFromCtx = (ctx) => {
  return ctx.request.query.shop.replace('.myshopify.com', '')
}

const createNewStoreMetadata = async (ctx, storeDoc) => {
  logger.info({ message: 'Creating new store metadata' })

  await Promise.all([
    // await createRecurringCharge(ctx),
    await createAppUninstallWebhook(ctx),
    await updateStoreInfo(ctx, storeDoc)
  ])
}

const updateStoreInfo = async (ctx, storeDoc) => {
  logger.info({ message: 'Updating store information...' })

  const { shop } = ctx.request.query

  let reqData = {
    url: `https://${shop}/admin/shop.json`,
    headers: {
      'X-Shopify-Access-Token': ctx.session.access_token
    }
  }

  let storeInfo = await httpReq.get(reqData, ctx)
  storeDoc.store_info = storeInfo.shop

  await Stores.findByIdAndUpdate(storeDoc._id, storeDoc).exec()
}

const createAppUninstallWebhook = async (ctx) => {
  logger.info({ message: 'Creating app uninstall webhook' })
  const { shop } = ctx.request.query
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
      'X-Shopify-Access-Token': ctx.session.access_token
    }
  }

  try {
    await httpReq.post(reqData, ctx)
  } catch (e) {
    logger.debug({ message: 'Error creating app uninstall webhook', body: (e.response ? e.response.body : e.message) })
  }
}

const createShopifyRecurringChargeRecord = async (ctx) => {
  logger.debug({ message: `Creating recurring charge for shop: ${ctx.session.store_identifier}` })

  const testChargeStoreIdentifiers = ['staging-apps-testing']

  const storeIdentifier = ctx.session.store_identifier
  const reqConfig = {
    url: `https://${storeIdentifier}.myshopify.com/admin/recurring_application_charges.json`,
    data: {
      recurring_application_charge: {
        name: 'Basic Plan',
        price: 1.99,
        return_url: `${APP_HOST}/adaptor/charge-accept-decline`,
        trial_days: 14,
        test: testChargeStoreIdentifiers.includes(storeIdentifier)
      }
    },
    headers: {
      'X-Shopify-Access-Token': ctx.session.access_token
    }
  }

  return httpReq.post(reqConfig)
}

const getChargeRecordFromShopify = async (ctx, chargeId) => {
  logger.debug({ message: `Inside getChargeRecordFromShopify. chargeId: ${chargeId}` })

  const storeIdentifier = ctx.session.store_identifier
  const reqConfig = {
    url: `https://${storeIdentifier}.myshopify.com/admin/recurring_application_charges/${chargeId}.json`,
    headers: {
      'X-Shopify-Access-Token': ctx.session.access_token
    }
  }

  let result = await httpReq.get(reqConfig)

  return result.recurring_application_charge
}

const activateChargeRecord = async (ctx, chargeRecord) => {
  logger.debug({ message: `Inside activateChargeRecord`, chargeRecord })

  const storeIdentifier = ctx.session.store_identifier
  const reqConfig = {
    url: `https://${storeIdentifier}.myshopify.com/admin/recurring_application_charges/${chargeRecord.id}/activate.json`,
    headers: {
      'X-Shopify-Access-Token': ctx.session.access_token
    },
    data: chargeRecord
  }

  await httpReq.post(reqConfig)
}
