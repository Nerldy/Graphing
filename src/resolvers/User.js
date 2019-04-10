const User = {
  posts: (parent, args, { dbs }, info) => dbs.posts.filter(post => post.author === parent.id),
  comments: (parent, args, { dbs }, info) => dbs.comments.filter(comment => comment.author === parent.id),
};

export { User as default };
