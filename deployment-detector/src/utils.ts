import { Finding, FindingSeverity, FindingType } from "forta-agent";

export const NETHERMIND_DEPLOYER: string = "0x88dC3a2284FA62e0027d6D6B1fCfDd2141a143b8";
export const FORTA_AGENT_REGISTRY: string = "0x61447385B019187daa48e91c55c02AF1F1f3F863";
export const FORTA_AGENT_EVENT =
  "event AgentUpdated(uint256 indexed agentId, address indexed by, string metadata, uint256[] chainIds)";

export type inputType = {
  proxyAddress: string;
  deployerAddress: string;
  createEventAgent: string;
};

export const botsParams: inputType = {
  proxyAddress: FORTA_AGENT_REGISTRY,
  deployerAddress: NETHERMIND_DEPLOYER,
  createEventAgent: FORTA_AGENT_EVENT,
};

export const createFinding = (agentId: number, owner: string, chainIds: number[]) => {
  return Finding.fromObject({
    name: "Nethermind Forta-Bot-Deployer Detector",
    description: "monitors bot deployments from the Nethermind deployer address",
    alertId: "NETH-BOT-DEPLOYER",
    severity: FindingSeverity.Info,
    type: FindingType.Info,
    protocol: "Forta",
    metadata: {
      agentId: agentId.toString(),
      by: owner,
      chainIds: chainIds.toString(),
    },
  });
};
