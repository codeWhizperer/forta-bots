import { providers } from "ethers";
export declare type GetNetworkId = () => Promise<number>;
export default function provideGetNetworkId(ethersProvider: providers.JsonRpcProvider): () => Promise<any>;
