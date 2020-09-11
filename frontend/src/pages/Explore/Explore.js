import React, { useState, Fragment } from "react";
import { useHistory } from "react-router-dom";

import styled from "styled-components";
import { generatePath } from "react-router-dom";
import { Query } from "react-apollo";

import { Container } from "components/Layout";
import ExploreCard from "./ExploreCard";
import Skeleton from "components/Skeleton";
import PostPopup from "components/PostPopup";
import Modal from "components/Modal";
import InfiniteScroll from "components/InfiniteScroll";
import Empty from "components/Empty";
import { Loading } from "components/Loading";
import Head from "components/Head";

import { GET_POSTS } from "graphql/post";

import { EXPLORE_PAGE_POSTS_LIMIT } from "constants/DataLimit";

import { useStore } from "store";

import * as Routes from "routes";

const Root = styled(Container)`
  margin-bottom: ${p => p.theme.spacing.sm};

  @media (min-width: ${p => p.theme.screen.lg}) {
    margin-left: ${p => p.theme.spacing.lg};
    padding: 0;
  }
`;

const PostsContainer = styled.div`
  margin:30px;

  border-radius: 12px
  padding:10px;

`;

//Explore page

const Explore = () => {
  const [{ auth }] = useStore();
  let history = useHistory();

  const [modalPostId, setModalPostId] = useState(null);

  const [comments, setComments] = useState(false);

  const toggleComments = () => {
    if (comments) {
      setComments(false);
    } else {
      setComments(true);
    }
  };

  const openModal = postId => {
    history.push(`/post/${postId}`);
    setModalPostId(postId);

    console.log("modalPostId", modalPostId);
  };

  const variables = {
    authUserId: auth.user.id,
    skip: 0,
    limit: EXPLORE_PAGE_POSTS_LIMIT
  };

  return (
    <Root maxWidth="md">
      <Head title="Explore New Articles and Users" />

      <Query
        query={GET_POSTS}
        variables={variables}
        notifyOnNetworkStatusChange
      >
        {({ data, loading, fetchMore, networkStatus }) => {
          if (loading && networkStatus === 1) {
            return (
              <PostsContainer>
                <Skeleton height={300} count={EXPLORE_PAGE_POSTS_LIMIT} />
              </PostsContainer>
            );
          }

          const { posts, count } = data.getPosts;

          if (!posts.length > 0) return <Empty text="No articles yet." />;

          return (
            <InfiniteScroll
              data={posts}
              dataKey="getPosts.posts"
              count={parseInt(count)}
              variables={variables}
              fetchMore={fetchMore}
            >
              {data => {
                console.log("data EXPLORE", data);
                const showNextLoading =
                  loading && networkStatus === 3 && count !== data.length;

                return (
                  <Fragment>
                    <PostsContainer>
                      {data.map(post => (
                        <Fragment key={post.id}>
                          <ExploreCard
                            image={post.image}
                            description={post.description}
                            author={post.author}
                            username={post.author.username}
                            createdAt={post.createdAt}
                            title={post.title}
                            text={post.text}
                            tags={post.tags}
                            postId={post.postId}
                            countLikes={post.likes.length}
                            countComments={post.comments.length}
                            openPostPopup={() => openModal(post.id)}
                          />
                        </Fragment>
                      ))}
                    </PostsContainer>

                    {showNextLoading && <Loading top="lg" />}
                  </Fragment>
                );
              }}
            </InfiniteScroll>
          );
        }}
      </Query>
    </Root>
  );
};

export default Explore;
