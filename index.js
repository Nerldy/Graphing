/* eslint-disable no-plusplus */
import { ApolloServer, gql, ApolloError } from 'apollo-server';
import uuid from 'uuid/v4';


let comments = [];
const users = [];
let posts = [];

const typeDefs = gql`

type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
}

type Post {
    id: ID!
    title: String!
    body: String!
    author: User!
    comments: [Comment!]
}


type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    posts: [Post!]!
    comments: [Comment!]!
}


type Query {
   user(id: ID!): User!
   users(queried: String): [User!]!
   post(id: ID!): Post!
   posts(queried: String): [Post!]!
   comments(queried: String): [Comment!]!
}

type Mutation {
  createUser(data: createUserInput!): User!
  createPost(data: createPostInput!): Post!
  createComment(data: createCommentInput!): Comment!
  deleteUser(id: ID!): User!
}

input createUserInput {
  name: String!
  email: String!
  password: String!
}

input createPostInput {
  title: String!
  body: String!
  author: ID!
}

input createCommentInput {
  text: String!
  author: ID!
  post: ID!
}

`;

const resolvers = {
  Mutation: {
    createUser: (parent, args, ctx, info) => {
      // check if email already exists and throw an error
      const checkEmailDuplicate = users.some(user => args.data.email === user.email);
      if (checkEmailDuplicate) {
        throw new ApolloError('Email already exists');
      } else {
        // create user
        const newUser = {
          id: uuid(),
          ...args.data,
        };
        // add new user to user list
        users.push(newUser);
        return newUser;
      }
    },
    createPost: (parent, args, ctx, info) => {
      const checkUserExists = users.some(user => user.id === args.data.author);
      if (!checkUserExists) {
        throw new ApolloError("user doesn't exist");
      }
      const newPost = {
        id: uuid(),
        ...args.data,
      };
      posts.push(newPost);
      return newPost;
    },
    createComment: (parent, args, ctx, info) => {
      const checkUserExists = users.some(user => user.id === args.data.author);
      const checkPostExists = posts.some(post => post.id === args.data.post);
      if (!checkUserExists && !checkPostExists) {
        throw new ApolloError("user or post doesn't exist");
      }
      const newComment = {
        id: uuid(),
        ...args.data,
      };
      comments.push(newComment);
      return newComment;
    },
    deleteUser: (parent, args, ctx, info) => {
      // check if user exists in the list
      const searchUser = users.findIndex(user => user.id === args.id);
      // throw error if user doesn't exist
      if (searchUser === -1) {
        throw new ApolloError("user doesn't exist");
      }
      const deletedUser = users[searchUser];
      // remove user from list
      users.splice(searchUser, 1);
      // check if user also had related posts
      const userPosts = posts.filter(post => post.author !== args.id);
      posts = userPosts;
      // check if user has comments
      const userComments = comments.filter(comment => comment.author !== args.id);
      comments = userComments;
      return deletedUser;
    },
  },
  Query: {
    user: (parent, args, ctx, info) => {
      const findUser = users.find(user => user.id === args.id);
      if (!findUser) {
        throw new ApolloError("user doesn't exist");
      }
      return findUser;
    },
    users: (parent, args, ctx, info) => {
      if (args.queried) {
        return users.filter(user => (
          user.name.toLowerCase().includes(args.queried)
        ));
      }
      return users;
    },
    post: (parent, args, ctx, info) => {
      const findPost = posts.find(post => post.id === args.id);
      if (!findPost) {
        throw new ApolloError("post doesn't exist");
      }
      return findPost;
    },
    posts: (parent, args, ctx, info) => {
      if (args.queried) {
        return posts.filter(post => post.title.toLowerCase().includes(args.queried) || post.body.toLowerCase().includes(args.queried));
      }
      return posts;
    },
    comments: (parent, args, ctx, info) => {
      if (args.queried) {
        return comments.filter(comment => comment.text.includes(args.queried));
      }
      return comments;
    },
  },
  Post: {
    author: (parent, args, ctx, info) => users.find(user => user.id === parent.author),
    comments: (parent, args, ctx, info) => comments.filter(comment => comment.post === parent.id),
  },
  User: {
    posts: (parent, args, ctx, info) => posts.filter(post => post.author === parent.id),
    comments: (parent, args, ctx, info) => comments.filter(comment => comment.author === parent.id),
  },
  Comment: {
    author: (parent, args, ctx, info) => users.find(user => user.id === parent.author),
    post: (parent, args, ctx, info) => posts.find(post => post.id === parent.post),
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
