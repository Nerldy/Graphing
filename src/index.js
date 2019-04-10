/* eslint-disable no-plusplus */
import { ApolloServer } from 'apollo-server';
import { readFileSync } from 'fs';
import db from '../db';
import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import Comment from './resolvers/Comment';
import Post from './resolvers/Post';
import User from './resolvers/User';


// define typeDefs
const typeDefs = readFileSync(`${__dirname}/schema.gql`, 'utf8');

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Mutation,
    Comment,
    Post,
    User,
  },
  context: {
    dbs: db,
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
