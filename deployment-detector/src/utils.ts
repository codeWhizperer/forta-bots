import { Finding, FindingSeverity, FindingType } from "forta-agent";
export const NETHERMIND_DEPLOYER: string = "0x88dC3a2284FA62e0027d6D6B1fCfDd2141a143b8";
export const FORTA_PROXY_ADDRESS: string = "0x61447385B019187daa48e91c55c02AF1F1f3F863";
export const FORTA_CREATE_AGENT: string =
  "function createAgent(uint256 agentId,address owner,string metadata,uint256[] chainIds)";
export const FORTA_UPDATE_AGENT =
  "function updateAgent(uint256 agentId, string calldata metadata, uint256[] calldata chainIds)";

export const mockOtherFortaContract: string = "0xB50d3960a49120D0A6B543E7295cAE6C78d07967";
export const mockDeployerAddress: string = "0x88dC3a2284FA62e0027d6D6B1fCfDd2141a143b8";

export const mockFortaContract: string = "0x61447385B019187daa48e91c55c02AF1F1f3F863";
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

export const mockBotParams: inputType = {
  proxyAddress: FORTA_PROXY_ADDRESS,
  deployerAddress: NETHERMIND_DEPLOYER,
  createEventAgent: FORTA_CREATE_AGENT,
};

export const createFinding = (agentId: number, owner: string, chainIds: number[]) => {
  return Finding.fromObject({
    name: "Nethermind Forta-Bot-Deployer Detector",
    description: `monitors bot deployments from the Nethermind deployer address`,
    alertId: "Neth-Bot-Deployer-1",
    severity: FindingSeverity.Info,
    type: FindingType.Info,
    protocol: "Forta",
    metadata: {
      agentId: agentId.toString(),
      owner,
      chainIds: chainIds.toString(),
    },
  });
};

export const createFindingTest = (agentId: number, owner: string, chainIds: number[]) => {
  return Finding.fromObject({
    name: "Nethermind Forta-Bot-Deployer Detector",
    description: `monitors bot deployments from the Nethermind deployer address`,
    alertId: "Neth-Bot-Deployer-1",
    severity: FindingSeverity.Info,
    type: FindingType.Info,
    protocol: "Forta",
    metadata: {
      agentId: agentId.toString(),
      owner,
      chainIds: chainIds.toString(),
    },
  });
};

export const UPDATE_AGENT_EVENT = [
  "event AgentUpdated(uint256 indexed agentId, address indexed by, string metadata, uint256[] chainIds)",
];
