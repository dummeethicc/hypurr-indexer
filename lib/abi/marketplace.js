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
exports.Contract = exports.events = void 0;
const p = __importStar(require("@subsquid/evm-codec"));
const evm_abi_1 = require("@subsquid/evm-abi");
exports.events = {
    Listed: (0, evm_abi_1.event)("0x50955776c5778c3b7d968d86d8c51fb6b29a7a74c20866b533268e209fc08343", "Listed(uint256,address,uint256)", { "tokenId": (0, evm_abi_1.indexed)(p.uint256), "seller": (0, evm_abi_1.indexed)(p.address), "price": p.uint256 }),
    Unlisted: (0, evm_abi_1.event)("0x398bd90ce129393b9155d48dccffb325e671f45c4250de457462a019268ff1f0", "Unlisted(uint256,address)", { "tokenId": (0, evm_abi_1.indexed)(p.uint256), "seller": (0, evm_abi_1.indexed)(p.address) }),
    Sold: (0, evm_abi_1.event)("0xa70b1a854695e7921b122988e216d3a6cd10ed799017c67b1ff231967e6bf56d", "Sold(uint256,address,address,uint256,uint256)", { "tokenId": (0, evm_abi_1.indexed)(p.uint256), "seller": (0, evm_abi_1.indexed)(p.address), "buyer": (0, evm_abi_1.indexed)(p.address), "price": p.uint256, "fee": p.uint256 }),
};
class Contract extends evm_abi_1.ContractBase {
}
exports.Contract = Contract;
//# sourceMappingURL=marketplace.js.map