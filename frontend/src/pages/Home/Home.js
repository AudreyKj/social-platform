import React, { useState, Fragment } from "react";
import styled from "styled-components";
import { generatePath } from "react-router-dom";
import { Query } from "react-apollo";
import { useHistory } from "react-router-dom";

import { A } from "components/Text";
import PostPopup from "components/PostPopup";
import Modal from "components/Modal";
import PostCard from "components/PostCard";
import { Spacing, Container } from "components/Layout";
import { Loading } from "components/Loading";
import InfiniteScroll from "components/InfiniteScroll";
import Skeleton from "components/Skeleton";
import CreatePost from "components/CreatePost";
import Head from "components/Head";

import { GET_FOLLOWED_POSTS } from "graphql/post";

import { useStore } from "store";

import { HOME_PAGE_POSTS_LIMIT } from "constants/DataLimit";

import * as Routes from "routes";

const Empty = styled.div`
  padding: ${p => p.theme.spacing.sm};
  border: 1px solid ${p => p.theme.colors.border.main};
  border-radius: ${p => p.theme.radius.sm};
  margin-top: ${p => p.theme.spacing.lg};
  background-color: ${p => p.theme.colors.white};
`;

const StyledA = styled(A)`
  text-decoration: underline;
  font-weight: ${p => p.theme.font.weight.bold};
`;

/**
 * Home page of the app
 */
const Home = () => {
  const [{ auth }] = useStore();
  const [modalPostId, setModalPostId] = useState(null);
  let history = useHistory();

  const openModal = postId => {
    //window.history.pushState("", "", generatePath(Routes.POST, { id: postId }));

    history.push(`/post/${postId}`);
    setModalPostId(postId);

    setModalPostId(postId);
  };

  const variables = {
    userId: auth.user.id,
    skip: 0,
    limit: HOME_PAGE_POSTS_LIMIT
  };

  return (
    <Container maxWidth="sm">
      <Head />

      <Spacing top="lg" />

      <CreatePost />

      <Query
        query={GET_FOLLOWED_POSTS}
        variables={variables}
        notifyOnNetworkStatusChange
      >
        {({ data, loading, fetchMore, networkStatus }) => {
          if (loading && networkStatus === 1) {
            return (
              <Skeleton
                height={500}
                bottom="lg"
                top="lg"
                count={HOME_PAGE_POSTS_LIMIT}
              />
            );
          }

          const { posts, count } = data.getFollowedPosts;

          if (!posts.length) {
            return (
              <Empty>
                <StyledA to={generatePath(Routes.EXPLORE)}>
                  Explore new articles
                </StyledA>
                &nbsp;or&nbsp;
                <StyledA to={generatePath(Routes.PEOPLE)}>
                  Find new people
                </StyledA>
              </Empty>
            );
          }

          return (
            <InfiniteScroll
              data={posts}
              dataKey="getFollowedPosts.posts"
              count={parseInt(count)}
              variables={variables}
              fetchMore={fetchMore}
            >
              {data => {
                const showNextLoading =
                  loading && networkStatus === 3 && count !== data.length;

                console.log("data home", data);

                return (
                  <Fragment>
                    {data.map(post => (
                      <Fragment key={post.id}>
                        <Modal open={modalPostId === post.id}>
                          <PostPopup id={post.id} />
                        </Modal>

                        <Spacing bottom="lg" top="lg">
                          <PostCard
                            author={post.author}
                            imagePublicId={post.imagePublicId}
                            postId={post.id}
                            comments={post.comments}
                            createdAt={post.createdAt}
                            title={post.title}
                            description={post.description}
                            text={post.text}
                            tags={post.tags}
                            image={post.image}
                            likes={post.likes}
                            openModal={() => openModal(post.id)}
                          />
                        </Spacing>
                      </Fragment>
                    ))}

                    {showNextLoading && <Loading top="lg" />}
                  </Fragment>
                );
              }}
            </InfiniteScroll>
          );
        }}
      </Query>
    </Container>
  );
};

export default Home;
