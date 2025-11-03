import { TypeormDatabase } from '@subsquid/typeorm-store';
import { processor } from './processor';
import { NFT, Listing, Sale, Trait } from './model';
import * as nftAbi from './abi/hypurrNFT';
import * as marketplaceAbi from './abi/marketplace';

processor.run(new TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
  const nfts: Map<string, NFT> = new Map();
  const listings: Map<string, Listing> = new Map();
  const sales: Sale[] = [];

  for (let block of ctx.blocks) {
    for (let log of block.logs) {
      
      // Handle NFT Transfer events
      if (log.address === '0x9125e2d6827a00b0f8330d6ef7bef07730bac685') {
        const { from, to, tokenId } = nftAbi.events.Transfer.decode(log);
        
        let nft = nfts.get(tokenId.toString());
        if (!nft) {
          nft = new NFT({
            id: tokenId.toString(),
            tokenId: Number(tokenId),
            owner: to.toLowerCase(),
            createdAt: new Date(block.header.timestamp),
            updatedAt: new Date(block.header.timestamp),
          });
        } else {
          nft.owner = to.toLowerCase();
          nft.updatedAt = new Date(block.header.timestamp);
        }
        
        nfts.set(tokenId.toString(), nft);
      }

      // Handle Marketplace Listed events
      if (log.address === '0xfaae9954495ce59702556cf56eedc3d79da12b93' && 
          log.topics[0] === marketplaceAbi.events.Listed.topic) {
        const { tokenId, seller, price } = marketplaceAbi.events.Listed.decode(log);
        
        const listing = new Listing({
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
        const sale = new Sale({
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