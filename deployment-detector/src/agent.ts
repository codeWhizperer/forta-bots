import { Finding, HandleTransaction, TransactionEvent } from "forta-agent";
import { botsParams, createFinding, inputType } from "./utils";

export function provideHandleTransaction(botsParams: inputType): HandleTransaction {
  return async (txEvent: TransactionEvent): Promise<Finding[]> => {
    const findings: Finding[] = [];
    if (txEvent.from !== botsParams.deployerAddress.toLocaleLowerCase()) return findings;
    if (txEvent.to !== botsParams.proxyAddress.toLocaleLowerCase()) return findings;

    const filteredCreateAgentLog = txEvent.filterLog(botsParams.createEventAgent, botsParams.proxyAddress);
    filteredCreateAgentLog.forEach((createAgentLog) => {
      const { agentId, by , chainIds } = createAgentLog.args;
      let finding = createFinding(agentId, by, chainIds);
      findings.push(finding);
    });
    return findings;
  };
}

export default {
  handleTransaction: provideHandleTransaction(botsParams),
};
