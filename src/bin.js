#!/usr/bin/env node

import sade from 'sade'
import * as app from './app.js'
import process from 'node:process'
import {
  Account,
  createKey,
  getPlan,
  listSpaces,
  addSpace,
  spaceInfo,
  whoami,
  useSpace
} from '@web3-storage/w3cli/index.js'

const cli = sade('hbtg')

cli
  .command('login <email>')
  .example('login user@example.com')
  .describe(
    'Authenticate this agent with your email address to gain access to all capabilities that have been delegated to it.'
  )
  .action(Account.login)

cli
  .command('plan get [email]')
  .example('plan get user@example.com')
  .describe('Displays plan given account is on')
  .action(getPlan)

cli
  .command('whoami')
  .describe('Print information about the current agent.')
  .action(whoami)

cli
  .command('key create')
  .describe(
    'Generate and print a new ed25519 key pair. Does not change your current signing key.'
  )
  .option('--json', 'output as json')
  .action(createKey)

cli
  .command('space ls')
  .describe('List spaces known to the agent')
  .action(listSpaces)
cli
  .command('space use <did>')
  .describe('Set the current space in use by the agent')
  .action(useSpace)
cli
  .command('space info')
  .describe('Show information about a space. Defaults to the current space.')
  .option('-s, --space', 'The space to print information about.')
  .option('--json', 'Format as newline delimited JSON')
  .action(spaceInfo)
cli
  .command('space add <proof>')
  .describe(
    'Import a space from a proof: a CAR encoded UCAN delegating capabilities to this agent. proof is a filesystem path, or a base64 encoded cid string.'
  )
  .action(addSpace)

cli
  .command('service')
  .option('-h, --host', 'Host', '127.0.0.1')
  .option('-p, --port', 'Port to listen', '8090')
  .option('-c, --can', 'One or more abilities to delegate.', [
    'store/add',
    'upload/add',
    'upload/list'
  ])
  .option(
    '-e, --expiration',
    'Unix timestamp (in seconds), Interval, when the delegation will not be longer valid. Zero indicates no expiration.',
    -1
  )
  .action(opts => {
    app.default(opts.host, opts.port, opts.can, opts.expiration)
  })

cli.parse(process.argv)
