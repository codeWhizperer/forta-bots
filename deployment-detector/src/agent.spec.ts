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
const mockOtherFortaContract: string = "0xB50d3960a49120D0A6B543E7295cAE6C78d07967";
const mockDeployerAddress: string = "0x88dC3a2284FA62e0027d6D6B1fCfDd2141a143b8";
const mockFortaAgentRegistry: string = "0x61447385B019187daa48e91c55c02AF1F1f3F863";

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

const mockarg = createMockArg(1, createAddress("0x02"), "QmPkydGrmSK2roUJeNzsdC3e7Yetr7zb7UNdmiXyRUM6ij", [137]);

const mockarg2 = createMockArg(2, createAddress("0x03"), "QmPkydGrmSK2roUJeNzsdC3e7Yetr7zb7UNdmiXyRUM6if", [137]);

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
      .addEventLog(FORTA_AGENT_EVENT, mockFortaAgentRegistry, [
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
      .addEventLog(FORTA_AGENT_EVENT, FORTA_AGENT_REGISTRY, [
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
        alertId: "Neth-Bot-Deployer-1",
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
      .addEventLog(FORTA_AGENT_EVENT, FORTA_AGENT_REGISTRY, [
        mockarg.agentId,
        mockarg.owner,
        mockarg.metaData,
        mockarg.chainIds,
      ]);
    const txEvent2: TransactionEvent = new TestTransactionEvent()
      .setFrom(mockDeployerAddress)
      .setTo(mockFortaAgentRegistry)
      .addEventLog(FORTA_AGENT_EVENT, FORTA_AGENT_REGISTRY, [
        mockarg2.agentId,
        mockarg2.owner,
        mockarg2.metaData,
        mockarg2.chainIds,
      ]);
    const findings = await handleTransaction(txEvent);
    const findings2 = await handleTransaction(txEvent2);
    expect(findings).toStrictEqual([
      Finding.fromObject({
        name: "Nethermind Forta-Bot-Deployer Detector",
        description: `monitors bot deployments from the Nethermind deployer address`,
        alertId: "Neth-Bot-Deployer-1",
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
    expect(findings2).toStrictEqual([
      Finding.fromObject({
        name: "Nethermind Forta-Bot-Deployer Detector",
        description: "monitors bot deployments from the Nethermind deployer address",
        alertId: "Neth-Bot-Deployer-1",
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
