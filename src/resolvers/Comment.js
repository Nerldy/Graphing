const Comment = {
  author: (parent, args, { dbs }, info) => dbs.users.find(user => user.id === parent.author),
  post: (parent, args, { dbs }, info) => dbs.posts.find(post => post.id === parent.post),
};

export { Comment as default };
