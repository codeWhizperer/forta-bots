import { HandleBlock, HandleTransaction, HandleAlert, Initialize } from "../../sdk";
import { GetPythonAgentHandlers } from './get.python.agent.handlers';
import { InitializeResponse } from "../../sdk/initialize.response";
declare type AgentHandlers = {
    initialize?: Initialize;
    initializeResponse?: InitializeResponse | void;
    handleTransaction?: HandleTransaction;
    handleBlock?: HandleBlock;
    handleAlert?: HandleAlert;
};
declare type GetAgentHandlersOptions = {
    shouldRunInitialize?: boolean;
};
export declare type GetAgentHandlers = (options?: GetAgentHandlersOptions) => Promise<AgentHandlers>;
export declare function provideGetAgentHandlers(agentPath: string, getPythonAgentHandlers: GetPythonAgentHandlers, dynamicImport: (path: string) => Promise<any>): GetAgentHandlers;
export {};
