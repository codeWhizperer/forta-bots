import { Finding, HandleTransaction, TransactionEvent } from "forta-agent";
import { provideHandleTransaction } from "./agent";
import {
  createFindingTest,
  FORTA_CREATE_AGENT,
  FORTA_PROXY_ADDRESS,
  FORTA_UPDATE_AGENT,
  mockBotParams,
  mockDeployerAddress,
  mockFortaContract,
  mockOtherFortaContract,
  UPDATE_AGENT_EVENT,
} from "./utils";
import { TestTransactionEvent } from "forta-agent-tools/lib/test";
import { createAddress } from "forta-agent-tools";

const otherDeployerAddress = createAddress("0x00");

const createMockArg = (agentId: number, owner: string, metaData: string, chainId: number[]) => {
  return {
    agentId: agentId,
    owner: owner,
    metaData: metaData,
    chainIds: chainId,
  };
};

const mockarg = createMockArg(1, createAddress("0x01"), "QmPkydGrmSK2roUJeNzsdC3e7Yetr7zb7UNdmiXyRUM6ij", [1, 137]);
const mockarg2 = createMockArg(3, createAddress("0x02"), "QmYjgPjv3AKEhQvvnMJJaw9abJ4TxPMdKHF7pZqPwhzG76", [1, 10, 56]);

describe("Nethermind deployer address bot test suite", () => {
  let handleTransaction: HandleTransaction;

  beforeAll(() => {
    handleTransaction = provideHandleTransaction(mockBotParams);
  });

  it("ignore empty transactions", async () => {
    const txEvent: TransactionEvent = new TestTransactionEvent();
    const findings: Finding[] = await handleTransaction(txEvent);
    expect(findings).toStrictEqual([]);
  });

  it("ignores valid transactions (create bot) from a different address", async () => {
    const txEvent: TransactionEvent = new TestTransactionEvent()
      .setFrom(otherDeployerAddress)
      .setTo(mockDeployerAddress)
      .addTraces({
        function: FORTA_CREATE_AGENT,
        to: "0xB50d3960a49120D0A6B543E7295cAE6C78d07967",
        arguments: [mockarg.agentId, mockarg.owner, mockarg.metaData, mockarg.chainIds],
      });
    const findings: Finding[] = await handleTransaction(txEvent);
    expect(findings).toStrictEqual([]);
  });

  it("ignore transactions when correct deployer address calls a non-Forta contract that emits the same event", async () => {
    const txEvent: TransactionEvent = new TestTransactionEvent()
      .setFrom(mockDeployerAddress)
      .setTo(mockFortaContract)
      .addTraces({
        function: FORTA_CREATE_AGENT,
        to: mockOtherFortaContract,
        arguments: [mockarg.agentId, mockarg.owner, mockarg.metaData, mockarg.chainIds],
      });
    const findings: Finding[] = await handleTransaction(txEvent);
    expect(findings).toStrictEqual([]);
  });

  it("creates an alert when a bot is deployed from the correct deployer address and the correct contract", async () => {
    const txEvent: TransactionEvent = new TestTransactionEvent()
      .setFrom(mockDeployerAddress)
      .setTo(mockFortaContract)
      .addTraces({
        function: FORTA_CREATE_AGENT,
        to: mockFortaContract,
        arguments: [mockarg.agentId, mockarg.owner, mockarg.metaData, mockarg.chainIds],
      });
    const findings: Finding[] = await handleTransaction(txEvent);
    const mockFinding = [createFindingTest(mockarg.agentId, mockarg.owner, mockarg.chainIds)];
    expect(findings).toStrictEqual(mockFinding);
  });

  it("ignore an alert when a bot is updated from the correct deployer address and the correct contract", async () => {
    const txEvent: TransactionEvent = new TestTransactionEvent()
      .setFrom(mockDeployerAddress)
      .setTo(mockFortaContract)
      .addTraces({
        function: FORTA_UPDATE_AGENT,
        to: mockFortaContract,
        arguments: [mockarg2.agentId, mockarg2.owner, mockarg2.chainIds],
      });
    const findings: Finding[] = await handleTransaction(txEvent);
    expect(findings).toStrictEqual([]);
  });
});
