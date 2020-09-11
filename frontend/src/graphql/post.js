import gql from "graphql-tag";

/**
 * Records to select from post comments
 */
export const postCommentsPayload = `
  comments {
    id
    comment
    author {
      id
      username
      fullName
      image
    }
  }
`;

/**
 * Records to select from post author
 */
export const postAuthorPayload = `
  author {
    id
    username
    fullName
    image
    following {
      id
      user
    }
    followers {
      id
      user
    }
    notifications {
      id
      author {
        id
        username
      }
      follow {
        id
      }
      like {
        id
      }
      comment {
        id
      }
    }
  }
`;

/**
 * Records to select from post likes
 */
export const postLikesPayload = `
  likes {
    id
    user
    post
  }
`;

/**
 * Creates a post
 */
export const CREATE_POST = gql`
  mutation($input: CreatePostInput!) {
    createPost(input: $input) {
      id
    }
  }
`;

/**
 * Searches posts by tags or title
 */

export const SEARCH_POSTS = gql`
  query($searchQuery: String!) {
    searchPosts(searchQuery: $searchQuery) {
      id
      title
      description
      text
      image
      tags
      createdAt
    }
  }
`;

/**
 * Gets all posts from followed users
 */
export const GET_FOLLOWED_POSTS = gql`
  query($userId: String!, $skip: Int, $limit: Int) {
    getFollowedPosts(userId: $userId, skip: $skip, limit: $limit) {
      count
      posts {
        id
        title
        description
        text
        image
        tags
        imagePublicId
        createdAt
        ${postAuthorPayload}
        ${postCommentsPayload}
        ${postLikesPayload}
      }
    }
  }
`;

/**
 * Gets all available posts
 */
export const GET_POSTS = gql`
  query($authUserId: ID!, $skip: Int, $limit: Int) {
    getPosts(authUserId: $authUserId, skip: $skip, limit: $limit) {
      count
      posts {
        id
        title
        description
        text
        tags
        image
        createdAt
        ${postAuthorPayload}
        ${postCommentsPayload}
        ${postLikesPayload}
      }
    }
  }
`;

/**
 * Gets specific post by id
 */
export const GET_POST = gql`
  query($id: ID!) {
    getPost(id: $id) {
      id
      title
      description
      text
      tags
      image
      createdAt
      ${postAuthorPayload}
      ${postCommentsPayload}
      ${postLikesPayload}
    }
  }
`;

/**
 * Deletes a post
 */
export const DELETE_POST = gql`
  mutation($input: DeletePostInput!) {
    deletePost(input: $input) {
      id
    }
  }
`;
