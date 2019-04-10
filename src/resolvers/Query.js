import { ApolloError } from 'apollo-server';

const Query = {
  user: (parent, args, { dbs }, info) => {
    const findUser = dbs.users.find(user => user.id === args.id);
    if (!findUser) {
      throw new ApolloError("user doesn't exist");
    }
    return findUser;
  },
  users: (parent, args, { dbs }, info) => {
    if (args.queried) {
      return dbs.users.filter(user => (
        user.name.toLowerCase().includes(args.queried)
      ));
    }
    return dbs.users;
  },
  post: (parent, args, { dbs }, info) => {
    const findPost = dbs.posts.find(post => post.id === args.id);
    if (!findPost) {
      throw new ApolloError("post doesn't exist");
    }
    return findPost;
  },
  posts: (parent, args, { dbs }, info) => {
    if (args.queried) {
      return dbs.posts.filter(post => post.title.toLowerCase().includes(args.queried) || post.body.toLowerCase().includes(args.queried));
    }
    return dbs.posts;
  },
  comments: (parent, args, { dbs }, info) => {
    if (args.queried) {
      return dbs.comments.filter(comment => comment.text.includes(args.queried));
    }
    return dbs.comments;
  },
};

export { Query as default };
