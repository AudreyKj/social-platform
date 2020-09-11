import gql from "graphql-tag";

/**
 * Records to select from post comments
 */
export const articleCommentsPayload = `
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
export const articleAuthorPayload = `
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
 * Records to select from article likes
 */
export const articleLikesPayload = `
  likes {
    id
    user
    article
  }
`;

/**
 * Creates an article
 */
export const CREATE_ARTICLE = gql`
  mutation($input: CreateArticleInput!) {
    createArticle(input: $input) {
      id
    }
  }
`;

/**
 * Gets all articles from followed users
 */
export const GET_FOLLOWED_ARTICLES = gql`
  query($userId: String!, $skip: Int, $limit: Int) {
    getFollowedArticles(userId: $userId, skip: $skip, limit: $limit) {
      count
      article {
        id
        title
        text
        description
        tags
        image
        imagePublicId
        createdAt
        ${articleAuthorPayload}
        ${articleCommentsPayload}
        ${articleLikesPayload}
      }
    }
  }
`;

/**
 * Gets all available articles
 */
export const GET_ARTICLES = gql`
  query($authUserId: ID!, $skip: Int, $limit: Int) {
    getArticles(authUserId: $authUserId, skip: $skip, limit: $limit) {
      count
      article {
        id
        title
        image
        ${articleAuthorPayload}
        ${articleCommentsPayload}
        ${articleLikesPayload}
      }
    }
  }
`;

/**
 * Gets specific article by id
 */
export const GET_ARTICLE = gql`
  query($id: ID!) {
    getArticle(id: $id) {
      id
      title
      image
      createdAt
      ${articleAuthorPayload}
      ${articleCommentsPayload}
      ${articleLikesPayload}
    }
  }
`;

/**
 * Deletes an article
 */
export const DELETE_ARTICLE = gql`
  mutation($input: DeleteArticleInput!) {
    deleteArticle(input: $input) {
      id
    }
  }
`;
