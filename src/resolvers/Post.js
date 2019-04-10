const Post = {
  author: (parent, args, { dbs }, info) => dbs.users.find(user => user.id === parent.author),
  comments: (parent, args, { dbs }, info) => dbs.comments.filter(comment => comment.post === parent.id),
};

export { Post as default };
