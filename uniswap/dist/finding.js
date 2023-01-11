"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFinding = void 0;
var forta_agent_1 = require("forta-agent");
var createFinding = function (poolVal, newAddress) {
    return forta_agent_1.Finding.fromObject({
        name: "UniswapV3 Swap Event Emission",
        description: "UniswapV3 Swap event detected for pool contract: ".concat(newAddress),
        alertId: "UNISWAP-SWAP-1",
        severity: forta_agent_1.FindingSeverity.Info,
        type: forta_agent_1.FindingType.Info,
        protocol: "Uniswap",
        metadata: {
            pool: newAddress,
            token0: poolVal.token0,
            token1: poolVal.token1,
            fee: poolVal.fee.toString(),
        },
    });
};
exports.createFinding = createFinding;
