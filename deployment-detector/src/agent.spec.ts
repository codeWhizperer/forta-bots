import { Finding, HandleTransaction, TransactionEvent, FindingSeverity, FindingType } from "forta-agent";
import { provideHandleTransaction } from "./agent";
import { FORTA_AGENT_EVENT, FORTA_AGENT_REGISTRY } from "./utils";
import { TestTransactionEvent } from "forta-agent-tools/lib/test";
import { createAddress } from "forta-agent-tools";

export type inputType = {
  proxyAddress: string;
  deployerAddress: string;
  createEventAgent: string;
};

const otherDeployerAddress = createAddress("0x01");
const mockOtherFortaContract: string = createAddress("0x02");
const mockDeployerAddress: string = createAddress("0x03");
const mockFortaAgentRegistry: string = createAddress("0x04");

export const mockBotParams: inputType = {
  proxyAddress: mockFortaAgentRegistry,
  deployerAddress: mockDeployerAddress,
  createEventAgent: FORTA_AGENT_EVENT,
};

const createMockArg = (agentId: number, owner: string, metaData: string, chainId: number[]) => {
  return {
    agentId: agentId,
    owner: owner,
    metaData: metaData,
    chainIds: chainId,
  };
};

const mockarg = createMockArg(1, createAddress("0x05"), "QmPkydGrmSK2roUJeNzsdC3e7Yetr7zb7UNdmiXyRUM6ij", [137]);

const mockarg2 = createMockArg(2, createAddress("0x06"), "QmPkydGrmSK2roUJeNzsdC3e7Yetr7zb7UNdmiXyRUM6if", [137]);

describe("Nethermind deployer address bot test suite", () => {
  let handleTransaction: HandleTransaction;

  beforeAll(() => {
    handleTransaction = provideHandleTransaction(mockBotParams);
  });

  it("ignores empty transactions", async () => {
    const txEvent: TransactionEvent = new TestTransactionEvent();
    const findings: Finding[] = await handleTransaction(txEvent);
    expect(findings).toStrictEqual([]);
  });

  it("ignores valid transactions (create bot) from a different address", async () => {
    const txEvent: TransactionEvent = new TestTransactionEvent()
      .setFrom(otherDeployerAddress)
      .setTo(mockFortaAgentRegistry)
      .addEventLog(FORTA_AGENT_EVENT, mockOtherFortaContract, [
        mockarg.agentId,
        mockarg.owner,
        mockarg.metaData,
        mockarg.chainIds,
      ]);
    const findings: Finding[] = await handleTransaction(txEvent);
    expect(findings).toStrictEqual([]);
  });

  it("ignores transactions when correct deployer address calls a non-Forta contract that emits the same event", async () => {
    const txEvent: TransactionEvent = new TestTransactionEvent()
      .setFrom(mockDeployerAddress)
      .setTo(mockOtherFortaContract)
      .addEventLog(FORTA_AGENT_EVENT, mockOtherFortaContract, [
        mockarg.agentId,
        mockarg.owner,
        mockarg.metaData,
        mockarg.chainIds,
      ]);
    const findings: Finding[] = await handleTransaction(txEvent);
    expect(findings).toStrictEqual([]);
  });

  it("creates an alert when a bot is deployed or updated from the correct deployer address and the correct contract", async () => {
    const txEvent: TransactionEvent = new TestTransactionEvent()
      .setFrom(mockDeployerAddress)
      .setTo(mockFortaAgentRegistry)
      .addEventLog(FORTA_AGENT_EVENT, mockFortaAgentRegistry, [
        mockarg.agentId,
        mockarg.owner,
        mockarg.metaData,
        mockarg.chainIds,
      ]);
    const findings = await handleTransaction(txEvent);

    expect(findings).toStrictEqual([
      Finding.fromObject({
        name: "Nethermind Forta-Bot-Deployer Detector",
        description: `monitors bot deployments from the Nethermind deployer address`,
        alertId: "NETH-BOT-DEPLOYER",
        severity: FindingSeverity.Info,
        type: FindingType.Info,
        protocol: "Forta",
        metadata: {
          agentId: mockarg.agentId.toString(),
          by: mockarg.owner,
          chainIds: mockarg.chainIds.toString(),
        },
      }),
    ]);
  });

  it("creates an alert  when multiple bots is deployed or updated from the correct deployer address and the correct contract", async () => {
    const txEvent: TransactionEvent = new TestTransactionEvent()
      .setFrom(mockDeployerAddress)
      .setTo(mockFortaAgentRegistry)
      .addEventLog(FORTA_AGENT_EVENT, mockFortaAgentRegistry, [
        mockarg.agentId,
        mockarg.owner,
        mockarg.metaData,
        mockarg.chainIds,
      ])
      .addEventLog(FORTA_AGENT_EVENT, mockFortaAgentRegistry, [
        mockarg2.agentId,
        mockarg2.owner,
        mockarg2.metaData,
        mockarg2.chainIds,
      ]);

    const findings = await handleTransaction(txEvent);
    expect(findings).toStrictEqual([
      Finding.fromObject({
        name: "Nethermind Forta-Bot-Deployer Detector",
        description: `monitors bot deployments from the Nethermind deployer address`,
        alertId: "NETH-BOT-DEPLOYER",
        severity: FindingSeverity.Info,
        type: FindingType.Info,
        protocol: "Forta",
        metadata: {
          agentId: mockarg.agentId.toString(),
          by: mockarg.owner,
          chainIds: mockarg.chainIds.toString(),
        },
      }),
      Finding.fromObject({
        name: "Nethermind Forta-Bot-Deployer Detector",
        description: "monitors bot deployments from the Nethermind deployer address",
        alertId: "NETH-BOT-DEPLOYER",
        severity: FindingSeverity.Info,
        type: FindingType.Info,
        protocol: "Forta",
        metadata: {
          agentId: mockarg2.agentId.toString(),
          by: mockarg2.owner,
          chainIds: mockarg2.chainIds.toString(),
        },
      }),
    ]);
  });
});
