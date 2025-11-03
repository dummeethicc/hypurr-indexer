import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { DataSource } from 'typeorm';
import { readFileSync } from 'fs';
import { join } from 'path';
import cors from 'cors';

// Import your models
import { NFT } from './model/nft.model.js';
import { Listing } from './model/listing.model.js';
import { Sale } from './model/sale.model.js';
import { Trait } from './model/trait.model.js';

const PORT = process.env.PORT || 4000;

// Read schema
const typeDefs = readFileSync(join(process.cwd(), 'schema.graphql'), 'utf-8');

// GraphQL resolvers
const resolvers = {
  Query: {
    nfts: async (_, { limit = 100, offset = 0, where, orderBy }) => {
      const repo = AppDataSource.getRepository(NFT);
      let query = repo.createQueryBuilder('nft');
      
      // Add where conditions
      if (where) {
        if (where.tokenId) {
          query = query.where('nft.tokenId = :tokenId', { tokenId: where.tokenId.eq });
        }
        if (where.owner) {
          query = query.andWhere('nft.owner = :owner', { owner: where.owner.eq });
        }
      }
      
      // Add ordering
      if (orderBy === 'tokenId_ASC') {
        query = query.orderBy('nft.tokenId', 'ASC');
      } else if (orderBy === 'tokenId_DESC') {
        query = query.orderBy('nft.tokenId', 'DESC');
      }
      
      return query.skip(offset).take(limit).getMany();
    },
    
    sales: async (_, { limit = 100, offset = 0, where, orderBy }) => {
      const repo = AppDataSource.getRepository(Sale);
      let query = repo.createQueryBuilder('sale');
      
      if (where?.tokenId) {
        query = query.where('sale.tokenId = :tokenId', { tokenId: where.tokenId.eq });
      }
      
      if (orderBy === 'timestamp_DESC') {
        query = query.orderBy('sale.timestamp', 'DESC');
      }
      
      return query.skip(offset).take(limit).getMany();
    },
    
    listings: async (_, { limit = 100, offset = 0, where }) => {
      const repo = AppDataSource.getRepository(Listing);
      let query = repo.createQueryBuilder('listing');
      
      if (where?.active) {
        query = query.where('listing.active = :active', { active: where.active.eq });
      }
      
      return query.skip(offset).take(limit).getMany();
    },
  },
  
  NFT: {
    listing: async (parent) => {
      const repo = AppDataSource.getRepository(Listing);
      return repo.findOne({ where: { nft: { id: parent.id } } });
    },
    attributes: async (parent) => {
      const repo = AppDataSource.getRepository(Trait);
      return repo.find({ where: { nft: { id: parent.id } } });
    },
  },
};

// Database connection
const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [NFT, Listing, Sale, Trait],
  synchronize: false,
  logging: false,
});

async function startServer() {
  try {
    // Connect to database
    await AppDataSource.initialize();
    console.log('✅ Database connected');
    
    // Create Express app
    const app = express();
    
    // Create Apollo Server
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      introspection: true,
      playground: true,
    });
    
    await server.start();
    console.log('✅ Apollo Server started');
    
    // Apply middleware
    app.use(cors());
    app.use(express.json());
    app.use('/graphql', expressMiddleware(server));
    
    // Health check
    app.get('/health', (req, res) => {
      res.json({ status: 'ok', database: AppDataSource.isInitialized });
    });
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    });
    
  } catch (error) {
    console.error('❌ Server failed to start:', error);
    process.exit(1);
  }
}

startServer();