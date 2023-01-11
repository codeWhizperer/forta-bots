import { Wallet, providers } from "ethers";
import { AppendToFile } from '../../utils/append.to.file';
import AgentRegistry from "../../contracts/agent.registry";
export declare type PushToRegistry = (manifestReference: string, fromWallet: Wallet) => Promise<void>;
export default function providePushToRegistry(appendToFile: AppendToFile, agentRegistry: AgentRegistry, agentId: string, chainIds: number[], ethersAgentRegistryProvider: providers.JsonRpcProvider): PushToRegistry;
