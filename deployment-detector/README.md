# Nethermind Forta Bots Deployer Detector

## Description
This  monitors bot deployments from the Nethermind deployer address (0x88dC3a2284FA62e0027d6D6B1fCfDd2141a143b8)

## Supported Chains
- Polygon

## Alerts
- NETH-BOT-DEPLOYER
  - Fired when Nethermind contract at: [0x88dc3a2284fa62e0027d6d6b1fcfdd2141a143b8](https://polygonscan.com/tx/0x88dc3a2284fa62e0027d6d6b1fcfdd2141a143b8) deploys a bot
  - Severity is always set to "info" 
  - Type is always set to "info" 
  - Metadata fields:

     - `agentId`: NETH-BOT-DEPLOYER,

     - `owner`: address to have ownership privileges,

    - `chainIds`: list of networks supported 

## Test Data
The bot behaviour can be verified with the following transaction:
- Transaction hash: (https://polygonscan.com/tx/0x75e0e9fb6894b6caa1251d62b2f7c4008e5443a0c8bc94c7d1ffb3fd3c3ad8fa)
