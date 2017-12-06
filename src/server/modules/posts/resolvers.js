import { withFilter } from 'graphql-subscriptions';

const POST_SUBSCRIPTION = 'post_subscription';
const POSTS_SUBSCRIPTION = 'posts_subscription';
const COMMENT_SUBSCRIPTION = 'comment_subscription';

export default pubsub => ({
  Query: {
    async posts(obj, { limit, after }, { PostRepo, Post }) {
      const edgesArray = [];
      const posts = await PostRepo.listOfPosts(limit, after);
      const totalCount = await Post.find({}).count();

      posts.map(post => {
        edgesArray.push({
          cursor: post.id,
          node: post,
        });
      });

      const endCursor =
        edgesArray.length > 0 ? edgesArray[edgesArray.length - 1].cursor : 0;

      const remainingCount = await Post.where('_id')
        .gt(endCursor)
        .count();
      return {
        totalCount,
        edges: edgesArray,
        pageInfo: {
          endCursor,
          hasNextPage: remainingCount > 0,
        },
      };
    },
    async post(obj, { id }, { Post }) {
      return Post.findById(id);
    },
  },

  Mutation: {
    async addPost(obj, { input }, { Post }) {
      const post = new Post(input);
      await post.save();
      // publish for post list
      pubsub.publish(POSTS_SUBSCRIPTION, {
        postsUpdated: {
          mutation: 'CREATED',
          id: post.id,
          node: post,
        },
      });
      return post;
    },
    async editPost(obj, { input }, { Post }) {
      const post = await Post.findOneAndUpdate(
        { _id: input.id },
        { $set: input },
      );
      // publish for post list
      pubsub.publish(POSTS_SUBSCRIPTION, {
        postsUpdated: {
          mutation: 'UPDATED',
          id: post.id,
          node: post,
        },
      });
      // publish for edit post page
      pubsub.publish(POST_SUBSCRIPTION, { postUpdated: post });
      return post;
    },
    async deletePost(obj, { id }, { Post }) {
      const post = await Post.findById(id);
      await post.remove();
      // publish for post list
      pubsub.publish(POSTS_SUBSCRIPTION, {
        postsUpdated: {
          mutation: 'DELETED',
          id,
          node: post,
        },
      });

      return { id: post.id };
    },

    async addComment(obj, { input }, { Post }) {
      const post = await Post.findById(input.postId);
      const commentId = post.comments.push({ content: input.content });
      await post.save();

      const comment = post.comments[commentId - 1];

      pubsub.publish(COMMENT_SUBSCRIPTION, {
        commentUpdated: {
          mutation: 'CREATED',
          id: 1,
          postId: input.postId,
          node: comment,
        },
      });
      return comment;
    },

    async editComment(obj, { input }, { Post }) {
      const post = await Post.findById(input.postId);
      const comment = post.comments.id(input.id);
      comment.set(input);
      await post.save();
      // publish for edit post page
      pubsub.publish(COMMENT_SUBSCRIPTION, {
        commentUpdated: {
          mutation: 'UPDATED',
          id: input.id,
          postId: input.postId,
          node: comment,
        },
      });
      return comment;
    },

    async deleteComment(obj, { input: { id, postId } }, { Post }) {
      const post = await Post.findById(postId);
      post.comments.id(id).remove();
      await post.save();
      // publish for edit post page
      pubsub.publish(COMMENT_SUBSCRIPTION, {
        commentUpdated: {
          mutation: 'DELETED',
          id,
          postId,
          node: null,
        },
      });
      return { id };
    },
  },
  Subscription: {
    postUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(POST_SUBSCRIPTION),
        (payload, variables) => payload.postUpdated.id === variables.id,
      ),
    },
    postsUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(POSTS_SUBSCRIPTION),
        (payload, variables) => variables.endCursor <= payload.postsUpdated.id,
      ),
    },
    commentUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(COMMENT_SUBSCRIPTION),
        (payload, variables) =>
          payload.commentUpdated.postId === variables.postId,
      ),
    },
  },
});
