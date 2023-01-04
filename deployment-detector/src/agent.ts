import { Finding, HandleTransaction, TransactionEvent, FindingSeverity, FindingType } from "forta-agent";
import { botsParams, inputType } from "./utils";

export function provideTransactionHandler(botsParams: inputType): HandleTransaction {
  return async (txEvent: TransactionEvent): Promise<Finding[]> => {
    const findings: Finding[] = [];
    if (txEvent.from != botsParams.deployerAddress.toLocaleLowerCase()) return findings;
    if (txEvent.to != botsParams.proxyAddress.toLocaleLowerCase()) return findings;

    const filteredCreateAgentLog = txEvent.filterFunction(botsParams.createEventAgent, botsParams.proxyAddress);

    filteredCreateAgentLog.forEach((createAgentLog) => {
      const { agentId, metadata, owner, chainIds } = createAgentLog.args;

      findings.push(
        Finding.fromObject({
          name: "Nethermind Forta-Bot-Deployer Detector",
          description: `Forta-Bots Dectector:${agentId}`,
          alertId: "NFD-1",
          severity: FindingSeverity.Info,
          type: FindingType.Info,
          protocol: "Nethermind",
          metadata: {
            agentId: agentId.toString(),
            metaData: metadata,
            owner,
            chainIds: chainIds.toString(),
          },
        })
      );
    });
    return findings;
  };
}

export default {
  handleTransaction: provideTransactionHandler(botsParams),
};
