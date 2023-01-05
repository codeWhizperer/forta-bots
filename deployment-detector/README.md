# Challenge-1

## Description
This  monitors bot deployments from the Nethermind deployer address (0x88dC3a2284FA62e0027d6D6B1fCfDd2141a143b8)

## Supported Chains
- Polygon

## Alerts

Describe each of the type of alerts fired by this agent

- Nethermind Forta-Bot-Deployer Detector
  - Fired when Nethermind contract at : 0x88dc3a2284fa62e0027d6d6b1fcfdd2141a143b8 deploys an agent
  - Severity is always set to "info" 
  - Type is always set to "info" 
  - Metadata fields:
     - agentId: agentId of the deployed agent
     - metadata: ipfs of the metadat of the agent
     - chainsIds: list of networks supported 

## Test Data
The bot behaviour can be verified with the following transaction:
- tx: [https://polygonscan.com/tx/0x37c290a35092738932434962849c959e6e741f5f6a294400028e5f39402e7c11]
