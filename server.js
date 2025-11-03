const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { DataSource } = require('typeorm');
const { readFileSync } = require('fs');

const PORT = process.env.PORT || 4000;

// Read schema
const typeDefs = readFileSync('./schema.graphql', 'utf-8');

// GraphQL resolvers
const resolvers = {
  Query: {
    nfts: async (_, { limit = 100, offset = 0, where, orderBy }) => {
      const repo = AppDataSource.getRepository('NFT');
      let query = repo.createQueryBuilder('nft');
      
      // Add where conditions
      if (where) {
        if (where.tokenId && where.tokenId.eq) {
          query = query.where('nft.token_id = :tokenId', { tokenId: where.tokenId.eq });
        }
        if (where.owner && where.owner.eq) {
          query = query.andWhere('nft.owner = :owner', { owner: where.owner.eq.toLowerCase() });
        }
      }
      
      // Add ordering
      if (orderBy === 'tokenId_ASC') {
        query = query.orderBy('nft.token_id', 'ASC');
      } else if (orderBy === 'tokenId_DESC') {
        query = query.orderBy('nft.token_id', 'DESC');
      }
      
      const results = await query.skip(offset).take(limit).getMany();
      
      // Format results to match schema
      return results.map(nft => ({
        id: nft.id,
        tokenId: nft.token_id,
        owner: nft.owner,
        name: nft.name,
        image: nft.image,
        metadata: nft.metadata,
        createdAt: nft.created_at,
        updatedAt: nft.updated_at,
      }));
    },
    
    sales: async (_, { limit = 100, offset = 0, where, orderBy }) => {
      const repo = AppDataSource.getRepository('Sale');
      let query = repo.createQueryBuilder('sale');
      
      if (where?.tokenId && where.tokenId.eq) {
        query = query.where('sale.token_id = :tokenId', { tokenId: where.tokenId.eq });
      }
      
      if (orderBy === 'timestamp_DESC') {
        query = query.orderBy('sale.timestamp', 'DESC');
      } else if (orderBy === 'timestamp_ASC') {
        query = query.orderBy('sale.timestamp', 'ASC');
      }
      
      const results = await query.skip(offset).take(limit).getMany();
      
      return results.map(sale => ({
        id: sale.id,
        tokenId: sale.token_id,
        seller: sale.seller,
        buyer: sale.buyer,
        price: sale.price,
        timestamp: sale.timestamp,
      }));
    },
    
    listings: async (_, { limit = 100, offset = 0, where }) => {
      const repo = AppDataSource.getRepository('Listing');
      let query = repo.createQueryBuilder('listing');
      
      if (where?.active && typeof where.active.eq === 'boolean') {
        query = query.where('listing.active = :active', { active: where.active.eq });
      }
      
      const results = await query.skip(offset).take(limit).getMany();
      
      return results.map(listing => ({
        id: listing.id,
        seller: listing.seller,
        price: listing.price,
        active: listing.active,
        listedAt: listing.listed_at,
        soldAt: listing.sold_at,
      }));
    },
  },
  
  NFT: {
    listing: async (parent) => {
      const repo = AppDataSource.getRepository('Listing');
      const listing = await repo.createQueryBuilder('listing')
        .where('listing.nft_id = :nftId', { nftId: parent.id })
        .getOne();
      
      if (!listing) return null;
      
      return {
        id: listing.id,
        seller: listing.seller,
        price: listing.price,
        active: listing.active,
        listedAt: listing.listed_at,
        soldAt: listing.sold_at,
      };
    },
    
    attributes: async (parent) => {
      const repo = AppDataSource.getRepository('Trait');
      const traits = await repo.createQueryBuilder('trait')
        .where('trait.nft_id = :nftId', { nftId: parent.id })
        .getMany();
      
      return traits.map(trait => ({
        id: trait.id,
        traitType: trait.trait_type,
        value: trait.value,
      }));
    },
  },
};

// Database connection
const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [],
  synchronize: false,
  logging: true,
});

async function startServer() {
  try {
    // Connect to database
    console.log('🔌 Connecting to database...');
    await AppDataSource.initialize();
    console.log('✅ Database connected');
    
    // Create Apollo Server
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      introspection: true,
    });
    
    // Start server
    const { url } = await startStandaloneServer(server, {
      listen: { port: PORT },
    });
    
    console.log(`🚀 Server ready at ${url}`);
    console.log(`🎮 GraphQL Playground: ${url}graphql`);
    
  } catch (error) {
    console.error('❌ Server failed to start:', error);
    console.error('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'NOT SET');
    process.exit(1);
  }
}

startServer();
