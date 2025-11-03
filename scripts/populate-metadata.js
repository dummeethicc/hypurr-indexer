import { ethers } from 'ethers';
import pg from 'pg';

// Configuration
const RPC_URL = 'https://rpc.hyperliquid.xyz/evm';
const NFT_ADDRESS = '0x9125E2d6827a00B0F8330D6ef7BEF07730Bac685';
const MARKETPLACE_ADDRESS = '0xFAAE9954495CE59702556cf56eedc3D79DA12b93';

// Database connection - get this from your squid
const DB_URL = process.env.DB_URL || 'postgresql://postgres:postgres@localhost:23798/squid';

const IPFS_GATEWAYS = [
  'https://ipfs.io/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/',
  'https://dweb.link/ipfs/',
];

// ABIs
const NFT_ABI = [
  'function ownerOf(uint256) view returns (address)',
  'function tokenURI(uint256) view returns (string)',
  'function totalSupply() view returns (uint256)'
];

const MARKETPLACE_ABI = [
  'function listings(uint256) view returns (address seller, uint256 price, bool active)'
];

// Fetch with retries
async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, { timeout: 10000 });
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.log(`Retry ${i + 1}/${retries} for ${url}`);
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
  throw new Error(`Failed to fetch ${url}`);
}

// Convert IPFS URI to HTTP
function ipfsToHttp(uri, gatewayIndex = 0) {
  if (!uri) return '';
  const hash = uri.replace('ipfs://', '');
  return `${IPFS_GATEWAYS[gatewayIndex]}${hash}`;
}

async function populateMetadata() {
  console.log('🚀 Starting NFT metadata population...');
  
  // Connect to blockchain
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const nftContract = new ethers.Contract(NFT_ADDRESS, NFT_ABI, provider);
  const marketplaceContract = new ethers.Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, provider);
  
  // Connect to database
  const client = new pg.Client({
    connectionString: DB_URL,
  });
  
  try {
    await client.connect();
    console.log('✅ Connected to database');
    
    // Get total supply
    const totalSupply = Number(await nftContract.totalSupply());
    console.log(`📊 Total supply: ${totalSupply} NFTs`);
    
    let successCount = 0;
    let errorCount = 0;
    
    // Process NFTs in batches
    for (let tokenId = 0; tokenId < totalSupply; tokenId++) {
      try {
        // Get owner
        const owner = await nftContract.ownerOf(tokenId);
        
        // Get listing info
        const listing = await marketplaceContract.listings(tokenId);
        
        // Get metadata URI
        const uri = await nftContract.tokenURI(tokenId);
        
        // Fetch metadata from IPFS
        let metadata = null;
        let metadataStr = null;
        
        for (let gatewayIndex = 0; gatewayIndex < IPFS_GATEWAYS.length; gatewayIndex++) {
          try {
            const ipfsUrl = ipfsToHttp(uri, gatewayIndex);
            metadata = await fetchWithRetry(ipfsUrl);
            metadataStr = JSON.stringify(metadata);
            break;
          } catch (e) {
            if (gatewayIndex === IPFS_GATEWAYS.length - 1) {
              console.log(`⚠️  Failed to fetch metadata for #${tokenId}`);
              metadata = {
                name: `hAIpurr #${tokenId}`,
                description: '',
                image: null,
                attributes: []
              };
              metadataStr = JSON.stringify(metadata);
            }
          }
        }
        
        // Insert NFT into database
        await client.query(`
          INSERT INTO nft (id, token_id, owner, name, image, metadata, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
          ON CONFLICT (id) DO UPDATE 
          SET owner = $3, name = $4, image = $5, metadata = $6, updated_at = NOW()
        `, [
          tokenId.toString(),
          tokenId,
          owner.toLowerCase(),
          metadata.name || `hAIpurr #${tokenId}`,
          metadata.image ? ipfsToHttp(metadata.image) : null,
          metadataStr
        ]);
        
        // Insert listing if active
        if (listing.active) {
          await client.query(`
            INSERT INTO listing (id, nft_id, seller, price, active, listed_at)
            VALUES ($1, $2, $3, $4, $5, NOW())
            ON CONFLICT (id) DO UPDATE 
            SET seller = $3, price = $4, active = $5
          `, [
            `${tokenId}-listing`,
            tokenId.toString(),
            listing.seller.toLowerCase(),
            listing.price.toString(),
            listing.active
          ]);
        }
        
        // Insert traits
        if (metadata.attributes && Array.isArray(metadata.attributes)) {
          for (const attr of metadata.attributes) {
            await client.query(`
              INSERT INTO trait (id, nft_id, trait_type, value)
              VALUES ($1, $2, $3, $4)
              ON CONFLICT (id) DO NOTHING
            `, [
              `${tokenId}-${attr.trait_type}-${attr.value}`,
              tokenId.toString(),
              attr.trait_type,
              attr.value
            ]);
          }
        }
        
        successCount++;
        
        // Progress update
        if ((tokenId + 1) % 50 === 0) {
          const progress = ((tokenId + 1) / totalSupply * 100).toFixed(1);
          console.log(`📦 Progress: ${tokenId + 1}/${totalSupply} (${progress}%) - ✅ ${successCount} ❌ ${errorCount}`);
        }
        
        // Rate limiting
        await new Promise(r => setTimeout(r, 100)); // 100ms delay between NFTs
        
      } catch (error) {
        errorCount++;
        console.error(`❌ Error processing NFT #${tokenId}:`, error.message);
      }
    }
    
    console.log('\n🎉 Population complete!');
    console.log(`✅ Success: ${successCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📊 Total: ${totalSupply}`);
    
  } catch (error) {
    console.error('💥 Fatal error:', error);
  } finally {
    await client.end();
    console.log('👋 Database connection closed');
  }
}

// Run the script
populateMetadata().catch(console.error);