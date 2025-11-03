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
const typeorm_store_1 = require("@subsquid/typeorm-store");
const processor_1 = require("./processor");
const model_1 = require("./model");
const nftAbi = __importStar(require("./abi/hypurrNFT"));
const marketplaceAbi = __importStar(require("./abi/marketplace"));
processor_1.processor.run(new typeorm_store_1.TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
    const nfts = new Map();
    const listings = new Map();
    const sales = [];
    for (let block of ctx.blocks) {
        for (let log of block.logs) {
            // Handle NFT Transfer events
            if (log.address === '0x9125e2d6827a00b0f8330d6ef7bef07730bac685') {
                const { from, to, tokenId } = nftAbi.events.Transfer.decode(log);
                let nft = nfts.get(tokenId.toString());
                if (!nft) {
                    nft = new model_1.NFT({
                        id: tokenId.toString(),
                        tokenId: Number(tokenId),
                        owner: to.toLowerCase(),
                        createdAt: new Date(block.header.timestamp),
                        updatedAt: new Date(block.header.timestamp),
                    });
                }
                else {
                    nft.owner = to.toLowerCase();
                    nft.updatedAt = new Date(block.header.timestamp);
                }
                nfts.set(tokenId.toString(), nft);
            }
            // Handle Marketplace Listed events
            if (log.address === '0xfaae9954495ce59702556cf56eedc3d79da12b93' &&
                log.topics[0] === marketplaceAbi.events.Listed.topic) {
                const { tokenId, seller, price } = marketplaceAbi.events.Listed.decode(log);
                const listing = new model_1.Listing({
                    id: `${tokenId}-${log.transactionHash}`,
                    seller: seller.toLowerCase(),
                    price: price,
                    active: true,
                    listedAt: new Date(block.header.timestamp),
                });
                listings.set(tokenId.toString(), listing);
            }
            // Handle Marketplace Sold events
            if (log.address === '0xfaae9954495ce59702556cf56eedc3d79da12b93' &&
                log.topics[0] === marketplaceAbi.events.Sold.topic) {
                const { tokenId, seller, buyer, price } = marketplaceAbi.events.Sold.decode(log);
                // Mark listing as inactive
                const listing = listings.get(tokenId.toString());
                if (listing) {
                    listing.active = false;
                    listing.soldAt = new Date(block.header.timestamp);
                }
                // Create sale record
                const sale = new model_1.Sale({
                    id: log.id,
                    tokenId: Number(tokenId),
                    seller: seller.toLowerCase(),
                    buyer: buyer.toLowerCase(),
                    price: price,
                    timestamp: new Date(block.header.timestamp),
                });
                sales.push(sale);
            }
            // Handle Unlisted events
            if (log.address === '0xfaae9954495ce59702556cf56eedc3d79da12b93' &&
                log.topics[0] === marketplaceAbi.events.Unlisted.topic) {
                const { tokenId } = marketplaceAbi.events.Unlisted.decode(log);
                const listing = listings.get(tokenId.toString());
                if (listing) {
                    listing.active = false;
                }
            }
        }
    }
    // Save to database
    await ctx.store.upsert([...nfts.values()]);
    await ctx.store.upsert([...listings.values()]);
    await ctx.store.insert(sales);
});
//# sourceMappingURL=main.js.map