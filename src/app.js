import * as w3cli from './w3cli.js'
import express from 'express'
import process from 'node:process'
import { getTokenExpirationEpoch } from './utils.js'

const rest = express()

const initContext = (host, port, can, expiration) => {
  const isReady = w3cli.checkIsAccountReady()

  return {
    host: host,
    port: port,
    can: can,
    expiration: expiration,
    isReady: () => {
      return isReady
    }
  }
}

export default function (host, port, can, expiration) {
  const context = initContext(host, port, can, expiration)
  if (!context.isReady()) {
    console.error(`Error: Could not find Agent key`)
    return
  }

  rest.get('/token', async (req, res) => {
    try {
      const epochExp = getTokenExpirationEpoch(context.expiration)
      const token = await w3cli.generateTokens({
        can: context.can,
        expiration: epochExp,
        json: true
      })

      res.status(200).send({
        success: true,
        secret: token.xAuthSecret,
        auth: token.authorization
      })
    } catch (err) {
      console.error('Error:' + err)
      res.status(200).send({ success: false })
    }
  })

  const server = rest.listen(context.port, context.host, function () {
    console.log(
      'Express App running at http://' + context.host + ':' + context.port
    )
  })

  process.on('SIGTERM', () => {
    console.log('Terminate received')
    server.close(() => {
      console.log('Process terminated')
    })
  })
}
