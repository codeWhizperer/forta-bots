import { providers } from "ethers";
import { GetAgentHandlers } from "../../utils/get.agent.handlers";
import { GetSubscriptionAlerts } from "../../utils/get.subscription.alerts";
import { RunHandlersOnAlert } from "../../utils/run.handlers.on.alert";
import { RunHandlersOnBlock } from "../../utils/run.handlers.on.block";
export declare type RunLive = (shouldContinuePolling?: Function) => Promise<void>;
export declare function provideRunLive(getAgentHandlers: GetAgentHandlers, getSubscriptionAlerts: GetSubscriptionAlerts, ethersProvider: providers.JsonRpcProvider, runHandlersOnBlock: RunHandlersOnBlock, runHandlersOnAlert: RunHandlersOnAlert, sleep: (durationMs: number) => Promise<void>): RunLive;
