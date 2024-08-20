import { getClient } from '@web3-storage/w3cli/lib.js'
import { base64url } from 'multiformats/bases/base64'
import cryptoRandomString from 'crypto-random-string'


/**
 * @typedef {object} BridgeGenerateTokensOptions
 * @property {string[]|string} [can]
 * @property {number} [expiration]
 * @property {boolean} [json]
 *
 * @param {string} resource
 * @param {BridgeGenerateTokensOptions} options
 */
export const generateTokens = async ({ can = ['store/add', 'upload/add'], expiration, json }
) => {
  const client = await getClient()

  const resourceDID = client.currentSpace()
  const abilities = can ? [can].flat() : []
  if (!abilities.length) {
    console.error('Error: missing capabilities for delegation')
    return
  }

  const capabilities = /** @type {ucanto.API.Capabilities} */ (
    abilities.map(can => ({ can, with: resourceDID.did() }))
  )

  const password = cryptoRandomString({ length: 32 })

  const coupon = await client.coupon.issue({
    capabilities,
    expiration: expiration === 0 ? Infinity : expiration,
    password
  })

  const { ok: bytes, error } = await coupon.archive()
  if (!bytes) {
    console.error(error)
    return
  }
  const xAuthSecret = base64url.encode(new TextEncoder().encode(password))
  const authorization = base64url.encode(bytes)

  return {
    xAuthSecret: xAuthSecret,
    authorization: authorization
  }
}

export const checkIsAccountReady = async () => {
  const client = await getClient()
  return client && client.did().length == 0
}