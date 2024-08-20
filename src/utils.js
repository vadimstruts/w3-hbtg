const expirationInterval = 30 * 60 * 1000

export function getTokenExpirationEpoch (expiration) {
  if (expiration < 0) {
    let currentTime = Date.now()
    return Math.floor((currentTime + expirationInterval) / 1000)
  }

  return expiration
}
