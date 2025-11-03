import { TypeormDatabase } from '@subsquid/typeorm-store';
import { EvmBatchProcessor } from '@subsquid/evm-processor';
import * as nftAbi from './abi/hypurrNFT';
import * as marketplaceAbi from './abi/marketplace';

export const processor = new EvmBatchProcessor()
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