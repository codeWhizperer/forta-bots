"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POOL_INIT_CODE_HASH = exports.MINT_EVENT = exports.SWAP_EVENT = exports.IUNISWAPV3FACTORY = exports.UNISWAPV3FACTORY_ADDRESS = exports.IUNISWAPV3POOL = void 0;
exports.IUNISWAPV3POOL = [
    "function token0() public view returns (address)",
    "function token1() public view returns (address)",
    "function fee() public view returns (uint24)",
];
exports.UNISWAPV3FACTORY_ADDRESS = "0x1F98431c8aD98523631AE4a59f267346ea31F984";
exports.IUNISWAPV3FACTORY = [
    "function getPool( address tokenA, address tokenB, uint24 fee ) external view returns (address pool)",
];
exports.SWAP_EVENT = [
    "event Swap(address indexed sender, address indexed recipient, int256 amount0, int256 amount1, uint160 sqrtPriceX96, uint128 liquidity, int24 tick)",
];
exports.MINT_EVENT = ["event Mint(address indexed from, uint256 value)"];
exports.POOL_INIT_CODE_HASH = "0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54";
