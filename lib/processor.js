"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processor = void 0;
const evm_processor_1 = require("@subsquid/evm-processor");
const nftAbi = __importStar(require("./abi/hypurrNFT"));
const marketplaceAbi = __importStar(require("./abi/marketplace"));
exports.processor = new evm_processor_1.EvmBatchProcessor()
    .setGateway('https://v2.archive.subsquid.io/network/hyperliquid-mainnet')
    .setRpcEndpoint({
    url: 'https://rpc.hyperliquid.xyz/evm',
    rateLimit: 5
})
    .setFinalityConfirmation(10)
    .setBlockRange({ from: 18194000 })
    .addLog({
    address: ['0x9125e2d6827a00b0f8330d6ef7bef07730bac685'],
    topic0: [nftAbi.events.Transfer.topic]
})
    .addLog({
    address: ['0xfaae9954495ce59702556cf56eedc3d79da12b93'],
    topic0: [
        marketplaceAbi.events.Listed.topic,
        marketplaceAbi.events.Sold.topic,
        marketplaceAbi.events.Unlisted.topic
    ]
})
    .setFields({
    log: {
        transactionHash: true,
    },
    transaction: {
        hash: true,
    }
});
//# sourceMappingURL=processor.js.map