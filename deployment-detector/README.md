# Challenge-1

## Description

This agent detects forta bots that are deployed on behalf of nethermind.

## Supported Chains

- Polygon


## Alerts

Describe each of the type of alerts fired by this agent

- FORTA-1
  - Fired when Nethermind contract at :"0x88dc3a2284fa62e0027d6d6b1fcfdd2141a143b8" deploys an agent
  - Severity is always set to "info" 
  - Type is always set to "info" 
  - Metadata fields:
     - agentId: agentId of the deployed agent
     - metadata: ipfs of the metadat of the agent
     - chainsIds: list of networks supported 

## Test Data


