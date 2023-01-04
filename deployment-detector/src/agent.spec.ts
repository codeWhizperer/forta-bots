import { FindingType, FindingSeverity, Finding, HandleTransaction, TransactionEvent, ethers } from "forta-agent";
import { provideTransactionHandler } from "./agent";
import { botsParams, createFinding, FORTA_CREATE_AGENT, inputType, NETHERMIND_DEPLOYER } from "./utils";
import { TestTransactionEvent } from "forta-agent-tools/lib/test";
import { createAddress } from "forta-agent-tools";

const randomAddress = createAddress("0x00");

const createMockArg = (agentId: number, owner: string, metaData: string, chainId: number[]) => {
  return {
    agentId: agentId,
    owner: owner,
    metaData: metaData,
    chainIds: chainId,
  };
};

const mockarg = createMockArg(1, createAddress("0x01"), "QmPkydGrmSK2roUJeNzsdC3e7Yetr7zb7UNdmiXyRUM6ij", [1, 137]);
const mockarg2 = createMockArg(1, createAddress("0x01"), "QmPkydGrmSK2roUJeNzsdC3e7Yetr7zb7UNdmiXyRUM6ij", [1, 80001]);

describe("New bot deployment", () => {
  let handleTransaction: HandleTransaction;

  beforeAll(() => {
    handleTransaction = provideTransactionHandler(botsParams);
  });

  // Test-Case-One

  it("ignore empty transactions", async () => {
    const txEvent: TransactionEvent = new TestTransactionEvent();
    const findings: Finding[] = await handleTransaction(txEvent);
    expect(findings).toStrictEqual([]);
  });

  // Test-Case-Two

  it("ignores valid transactions (create bot) from a different address", async () => {
    const txEvent: TransactionEvent = new TestTransactionEvent()
      .setFrom(randomAddress)
      .setTo(botsParams.proxyAddress)
      .addTraces({
        function: FORTA_CREATE_AGENT,
        to: botsParams.proxyAddress,
        arguments: [mockarg.agentId, mockarg.owner, mockarg.metaData, mockarg.chainIds],
      });
    const findings: Finding[] = await handleTransaction(txEvent);
    expect(findings).toStrictEqual([]);
  });

  // Test-Case-Three

  it("returns alerts", async () => {
    const txEvent: TransactionEvent = new TestTransactionEvent()
      .setFrom(NETHERMIND_DEPLOYER)
      .setTo(botsParams.proxyAddress)
      .addTraces({
        function: FORTA_CREATE_AGENT,
        to: botsParams.proxyAddress,
        arguments: [mockarg.agentId, mockarg.owner, mockarg.metaData, mockarg.chainIds],
      });
    const findings: Finding[] = await handleTransaction(txEvent);
    const mockFinding = [createFinding(mockarg.agentId, mockarg.metaData, mockarg.owner, mockarg.chainIds)];
    expect(findings).toStrictEqual(mockFinding);
  });
});
