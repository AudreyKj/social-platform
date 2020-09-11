import React, { useState } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import { Query } from "react-apollo";
import {
  A,
  H1,
  H2,
  H3,
  TAGS,
  PARAGRAPHDESC,
  PARAGRAPHTEXT,
  TextContent,
  TagsContainer,
  Image,
  TextContainer,
  ArticleIntro,
  DescriptionTags
} from "components/Text";
import { Loading } from "components/Loading";
import { CloseIcon } from "components/icons";
import CreateComment from "components/CreateComment";
import { Spacing } from "components/Layout";
import NotFound from "components/NotFound";
import Head from "components/Head";
import PostPopupInfo from "./PostPopupInfo";
import PostPopupComments from "./PostPopupComments";
import PostPopupOptions from "./PostPopupOptions";
import { timeAgo } from "utils/date";

import { GET_POST } from "graphql/post";

const Root = styled.div`
  margin: ${p => !p.usedInModal && p.theme.spacing.lg} 0;
  box-shadow: ${p => p.theme.shadows.sm};
  border-radius: ${p => p.theme.radius.sm};
  z-index: ${p => (p.usedInModal ? p.theme.zIndex.xl : "inherit")};
  overflow: hidden;
  width: 95%;
`;

const Container = styled.div`
  max-height: ${p => (p.usedInModal ? "900px" : "auto")};
  overflow-y: ${p => (p.usedInModal ? "auto" : "inherit")};

  background-color: ${p => p.theme.colors.white};
  padding-left: 20px;
  padding-right: 20px;
`;

const PostPopup = ({
  id,
  image,
  title,
  text,
  description,
  author,
  username,
  tags,
  closeModal,
  usedInModal,
  comments,
  toggleComments,
  createdAt
}) => {
  return (
    <Query query={GET_POST} variables={{ id }}>
      {({ data, loading, error }) => {
        if (loading) return <Loading top="lg" />;
        if (error) return <NotFound />;

        const post = data.getPost;

        return (
          <Root usedInModal={usedInModal}>
            <Head
              title={post.title ? post.title : `${post.author.username}'s post`}
            />

            <Container usedInModal={usedInModal}>
              <Spacing>
                <PostPopupInfo
                  author={post.author}
                  createdAt={post.createdAt}
                />

                <ArticleIntro>
                  {post.image && <Image src={post.image} />}
                  <TextContent>
                    {post.title && <H1>{post.title}</H1>}
                    <DescriptionTags>
                      {post.description && (
                        <PARAGRAPHDESC>{post.description}</PARAGRAPHDESC>
                      )}

                      <TagsContainer>
                        {post.tags
                          ? post.tags
                              .split(",")
                              .map(elem => <TAGS key={id + elem}>{elem}</TAGS>)
                          : ""}
                      </TagsContainer>
                    </DescriptionTags>
                  </TextContent>
                </ArticleIntro>
                <TextContainer>
                  {post.text && <PARAGRAPHTEXT>{post.text}</PARAGRAPHTEXT>}
                </TextContainer>
              </Spacing>
              <Spacing>
                <PostPopupOptions
                  postId={post.id}
                  postAuthor={post.author}
                  postLikes={post.likes}
                />

                <CreateComment post={post} />
              </Spacing>

              <PostPopupComments
                usedInModal={usedInModal}
                comments={post.comments}
                postId={post.id}
                postAuthor={post.author}
              />
            </Container>
          </Root>
        );
      }}
    </Query>
  );
};

PostPopup.propTypes = {
  id: PropTypes.string.isRequired,
  closeModal: PropTypes.func,
  usedInModal: PropTypes.bool.isRequired
};

PostPopup.defaultProps = {
  usedInModal: true
};

export default withRouter(PostPopup);
