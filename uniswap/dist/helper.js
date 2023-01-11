"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTwoAddress = exports.getFactoryContract = exports.getPoolValues = void 0;
var ethers_1 = require("ethers");
var lru_cache_1 = __importDefault(require("lru-cache"));
var constant_1 = require("./constant");
var cache = new lru_cache_1.default({
    max: 1000,
});
var getPoolValues = function (poolAddress, IUNISWAPV3POOL, provider, blockNumber) { return __awaiter(void 0, void 0, void 0, function () {
    var key, uniswap_pool, token0, token1, fee;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                cache = new lru_cache_1.default({
                    max: 1000,
                });
                key = poolAddress;
                if (cache.has(key))
                    return [2 /*return*/, cache.get(key)];
                uniswap_pool = new ethers_1.Contract(poolAddress, IUNISWAPV3POOL, provider);
                return [4 /*yield*/, uniswap_pool.token0({ blockTag: blockNumber })];
            case 1:
                token0 = _a.sent();
                return [4 /*yield*/, uniswap_pool.token1({ blockTag: blockNumber })];
            case 2:
                token1 = _a.sent();
                return [4 /*yield*/, uniswap_pool.fee({ blockTag: blockNumber })];
            case 3:
                fee = _a.sent();
                // Store vals in cache so we don't repeat the same calls
                cache.set(key, { token0: token0, token1: token1, fee: fee });
                return [2 /*return*/, { token0: token0, token1: token1, fee: fee }];
        }
    });
}); };
exports.getPoolValues = getPoolValues;
var getFactoryContract = function (provider) {
    return new ethers_1.Contract(constant_1.UNISWAPV3FACTORY_ADDRESS, constant_1.IUNISWAPV3FACTORY, provider);
};
exports.getFactoryContract = getFactoryContract;
var createTwoAddress = function (poolVal, factoryContract) {
    return ethers_1.ethers.utils.getCreate2Address(factoryContract.address, ethers_1.ethers.utils.keccak256(ethers_1.ethers.utils.defaultAbiCoder.encode(["address", "address", "uint24"], [poolVal.token0, poolVal.token1, poolVal.fee])), constant_1.POOL_INIT_CODE_HASH);
};
exports.createTwoAddress = createTwoAddress;
//alternative method to confirm the pool address
//less gas effecient
/*
export const getPoolAddress = async (
  poolVal: poolValues,
  factoryContract: Contract,
  blockNumber: number
): Promise<string> => {
  const poolAddress = await factoryContract.getPool(poolVal.token0, poolVal.token1, poolVal.fee, {
    blockTag: blockNumber,
  });
  return poolAddress;
};
*/ 
