/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import { ApolloError } from 'apollo-server';
import uuid from 'uuid/v4';

const Mutation = {
  createUser: (parent, args, { dbs }, info) => {
    // check if email already exists and throw an error
    const checkEmailDuplicate = dbs.users.some(user => args.data.email === user.email);
    if (checkEmailDuplicate) {
      throw new ApolloError('Email already exists');
    } else {
      // create user
      const newUser = {
        id: uuid(),
        ...args.data,
      };
        // add new user to user list
      dbs.users.push(newUser);
      return newUser;
    }
  },
  updateUser: (parent, args, { dbs }, info) => {
    const { id, name } = args.data;
    //   search user in db
    const findUser = dbs.users.find(user => user.id === id);
    if (!findUser) {
      throw new ApolloError('user not found');
    }
    findUser.name = name;
    return findUser;
  },
  createPost: (parent, args, { dbs }, info) => {
    const checkUserExists = dbs.users.some(user => user.id === args.data.author);
    if (!checkUserExists) {
      throw new ApolloError("user doesn't exist");
    }
    const newPost = {
      id: uuid(),
      ...args.data,
    };
    dbs.posts.push(newPost);
    return newPost;
  },
  createComment: (parent, args, { dbs }, info) => {
    // check if user exists
    const checkUserExists = dbs.users.some(user => user.id === args.data.author);
    // check if posts exists
    const checkPostExists = dbs.posts.some(post => post.id === args.data.post);
    if (!checkUserExists && !checkPostExists) {
      throw new ApolloError("user or post doesn't exist");
    }
    const newComment = {
      id: uuid(),
      ...args.data,
    };
    dbs.comments.push(newComment);
    return newComment;
  },
  deleteUser: (parent, args, { dbs }, info) => {
    // check if user exists in the list
    const searchUser = dbs.users.findIndex(user => user.id === args.id);
    // throw error if user doesn't exist
    if (searchUser === -1) {
      throw new ApolloError("user doesn't exist");
    }
    const deletedUser = dbs.users.splice(searchUser, 1);
    // remove user from list
    dbs.users.splice(searchUser, 1);
    // check if user also had related posts
    const userPosts = dbs.posts.filter(post => post.author !== args.id);
    dbs.posts = userPosts;
    // check if user has comments
    const userComments = dbs.comments.filter(comment => comment.author !== args.id);
    dbs.comments = userComments;
    return deletedUser[0];
  },
  deletePost: (parent, args, { dbs }, info) => {
    // search post in the posts
    const searchPost = dbs.posts.findIndex(post => post.id === args.id);
    if (searchPost === -1) {
      throw new ApolloError("post doesn't exist");
    }
    const deletedPost = dbs.posts.splice(searchPost, 1);
    const postComment = dbs.comments.filter(comment => comment.post !== args.id);
    dbs.comments = postComment;
    return deletedPost[0];
  },
  deleteComment: (parent, args, { dbs }, info) => {
    const findComment = dbs.comments.findIndex(comment => comment.id === args.id);
    if (findComment === -1) {
      throw new ApolloError("comment doesn't exist");
    }
    const deleteComment = dbs.comments.splice(findComment, 1);
    return deleteComment[0];
  },
};

export { Mutation as default };
