import { Finding, FindingSeverity, FindingType } from "forta-agent";
export const NETHERMIND_DEPLOYER: string = "0x88dC3a2284FA62e0027d6D6B1fCfDd2141a143b8";
export const FORTA_PROXY_ADDRESS: string = "0x61447385B019187daa48e91c55c02AF1F1f3F863";
export const FORTA_CREATE_AGENT: string =
  "function createAgent(uint256 agentId,address owner,string metadata,uint256[] chainIds)";
export type inputType = {
  proxyAddress: string;
  deployerAddress: string;
  createEventAgent: string;
};

export const botsParams: inputType = {
  proxyAddress: FORTA_PROXY_ADDRESS,
  deployerAddress: NETHERMIND_DEPLOYER,
  createEventAgent: FORTA_CREATE_AGENT,
};

export const createFinding = (agentId: number, metadata: string, owner: string, chainIds: number[]) => {
  return Finding.fromObject({
    name: "Nethermind Forta-Bot-Deployer Detector",
    description: `Forta-Bots Dectector:${agentId}`,
    alertId: "NFD-1",
    severity: FindingSeverity.Info,
    type: FindingType.Info,
    protocol: "Nethermind",
    metadata: {
      agentId: agentId.toString(),
      metaData: metadata,
      owner: owner,
      chainIds: chainIds.toString(),
    },
  });
};
