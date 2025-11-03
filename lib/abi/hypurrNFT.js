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
exports.Contract = exports.functions = exports.events = void 0;
const p = __importStar(require("@subsquid/evm-codec"));
const evm_abi_1 = require("@subsquid/evm-abi");
exports.events = {
    Transfer: (0, evm_abi_1.event)("0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", "Transfer(address,address,uint256)", { "from": (0, evm_abi_1.indexed)(p.address), "to": (0, evm_abi_1.indexed)(p.address), "tokenId": (0, evm_abi_1.indexed)(p.uint256) }),
};
exports.functions = {
    ownerOf: (0, evm_abi_1.viewFun)("0x6352211e", "ownerOf(uint256)", { "tokenId": p.uint256 }, p.address),
    tokenURI: (0, evm_abi_1.viewFun)("0xc87b56dd", "tokenURI(uint256)", { "tokenId": p.uint256 }, p.string),
};
class Contract extends evm_abi_1.ContractBase {
    ownerOf(tokenId) {
        return this.eth_call(exports.functions.ownerOf, { tokenId });
    }
    tokenURI(tokenId) {
        return this.eth_call(exports.functions.tokenURI, { tokenId });
    }
}
exports.Contract = Contract;
//# sourceMappingURL=hypurrNFT.js.map