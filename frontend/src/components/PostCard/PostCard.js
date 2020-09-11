import React, { useState } from "react";
import PropTypes from "prop-types";
import { generatePath } from "react-router-dom";
import styled from "styled-components";
import { withApollo } from "react-apollo";

import Comment from "components/Comment";
import CreateComment from "components/CreateComment";
import Like from "components/Like";
import { DotsIcon, PostCommentIcon } from "components/icons";
import { Spacing } from "components/Layout";
import { A, H1, TAGS, PARAGRAPHDESC, PARAGRAPHTEXT } from "components/Text";
import { Button } from "components/Form";
import PostCardOption from "components/PostCard/PostCardOption";
import Modal from "components/Modal";
import Avatar from "components/Avatar";

import { GET_FOLLOWED_POSTS, DELETE_POST } from "graphql/post";
import { GET_AUTH_USER } from "graphql/user";
import { GET_USER_POSTS } from "graphql/user";

import {
  HOME_PAGE_POSTS_LIMIT,
  PROFILE_PAGE_POSTS_LIMIT
} from "constants/DataLimit";

import { useStore } from "store";

import * as Routes from "routes";

import { timeAgo } from "utils/date";

const Root = styled.div`
  width: 100%;
  border-radius: ${p => p.theme.radius.sm};
  padding-bottom: ${p => p.theme.spacing.xs};
  background-color: ${p => p.theme.colors.white};
  border: 1px solid ${p => p.theme.colors.border.main};
  padding-left: 10px;
`;

const TopRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  padding: ${p => p.theme.spacing.xs} ${p => p.theme.spacing.sm};
`;

const CreatedAt = styled.div`
  font-size: ${p => p.theme.font.size.xxs};
  color: ${p => p.theme.colors.text.hint};
  border-bottom: 1px solid ${p => p.theme.colors.text.secondary};
  border: 0;
  margin-top: 2px;
`;

const Author = styled(A)`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Name = styled.span`
  font-size: ${p => p.theme.font.size.xs};
  font-weight: ${p => p.theme.font.weight.bold};
  color: ${p => p.theme.colors.primary.main};
`;

const Image = styled.img`
  display: block;
  width: 200px;
  width: ${p => !p.usedInModal && "30%"};
  max-height: ${p => (p.usedInModal ? "200px" : "30%")};
  margin-bottom: 10px;
  object-fit: cover;
`;

const Poster = styled.img`
  display: block;
  width: 100%;

  max-height: auto;
  object-fit: cover;
  cursor: pointer;
  margin-bottom: ${p => p.theme.spacing.sm};
`;

const BottomRow = styled.div`
  overflow: hidden;
`;

const CountAndIcons = styled.div`
  padding: 0 ${p => p.theme.spacing.sm};
`;

const Count = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-bottom: ${p => p.theme.spacing.xs};
  font-size: ${p => p.theme.font.size.xs};
  color: ${p => p.theme.colors.text.secondary};
`;

const Icons = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-top: 1px solid ${p => p.theme.colors.border.main};
`;

const Comments = styled.div`
  padding: 0 ${p => p.theme.spacing.sm};
`;

const StyledButton = styled(Button)`
  padding: 0;
  padding-left: 4px;
  font-size: ${p => p.theme.font.size.xxs};
`;

const CommentLine = styled.div`
  margin-bottom: 5px;
  border-top: 1px solid ${p => p.theme.colors.border.main};
`;

const ReadMore = styled.span`
  display: block;
  text-decoration: underline;
  cursor: pointer;
  margin-bottom: 30px;
`;

const TextContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const TagsContainer = styled.div`
  display: flex;
  margin-bottom: 10px;
  flex-wrap: wrap;
`;

const TextContainer = styled.div`
  overflow: scroll;
  height: 300px;
`;

const ArticleIntro = styled.div`
  display: flex;
  flex-direction: column;
`;

const DescriptionTags = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
`;

/*
 * Component for rendering user post
 */

const PostCard = ({
  author,
  imagePublicId,
  comments,
  title,
  description,
  text,
  tags,
  createdAt,
  image,
  likes,
  postId,
  openModal,
  client
}) => {
  const [{ auth }] = useStore();
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const [readMore, setReadMore] = useState(false);

  const toggleReadMore = () => {
    if (!readMore) {
      setReadMore(true);
    } else {
      setReadMore(false);
    }
  };

  const toggleCreateComment = () => {
    setIsCommentOpen(true);
  };

  const toggleComment = () => {
    setIsCommentOpen(!isCommentOpen);
  };

  const closeOption = () => setIsOptionOpen(false);

  const openOption = () => setIsOptionOpen(true);

  const deletePost = async () => {
    try {
      await client.mutate({
        mutation: DELETE_POST,
        variables: { input: { id: postId, imagePublicId } },
        refetchQueries: () => [
          {
            query: GET_FOLLOWED_POSTS,
            variables: {
              userId: auth.user.id,
              skip: 0,
              limit: HOME_PAGE_POSTS_LIMIT
            }
          },
          { query: GET_AUTH_USER },
          {
            query: GET_USER_POSTS,
            variables: {
              username: auth.user.username,
              skip: 0,
              limit: PROFILE_PAGE_POSTS_LIMIT
            }
          }
        ]
      });
    } catch (err) {}

    setIsOptionOpen(false);
  };

  return (
    <>
      <Root>
        <Modal onClose={closeOption} open={isOptionOpen}>
          <PostCardOption
            postId={postId}
            closeOption={closeOption}
            author={author}
            deletePost={deletePost}
          />
        </Modal>

        <TopRow>
          <Author
            to={generatePath(Routes.USER_PROFILE, {
              username: author.username
            })}
          >
            <Avatar image={author.image} />

            <Spacing left="xs">
              <Name>{author.fullName}</Name>
              <CreatedAt>{timeAgo(createdAt)}</CreatedAt>
            </Spacing>
          </Author>

          <Button ghost onClick={openOption}>
            <DotsIcon />
          </Button>
        </TopRow>

        <ArticleIntro>
          {image && <Poster src={image} onClick={openModal} />}
          <TextContent>
            {title && <H1>{title}</H1>}
            <DescriptionTags>
              {description && <PARAGRAPHDESC>{description}</PARAGRAPHDESC>}

              <TagsContainer>
                {tags
                  ? tags
                      .split(",")
                      .map(elem => <TAGS key={postId + elem}>{elem}</TAGS>)
                  : ""}
              </TagsContainer>
            </DescriptionTags>
          </TextContent>
          {!readMore && text && (
            <ReadMore onClick={toggleReadMore}> read more </ReadMore>
          )}
        </ArticleIntro>

        {readMore && (
          <>
            <PARAGRAPHTEXT>{text}</PARAGRAPHTEXT>
            <ReadMore onClick={toggleReadMore}> close </ReadMore>
          </>
        )}

        <BottomRow>
          <CountAndIcons>
            <Count>
              {likes.length} likes
              <Spacing />
              <StyledButton onClick={toggleComment} text>
                {comments.length} comments
              </StyledButton>
            </Count>

            <Icons>
              <Like
                fullWidth
                withText
                user={author}
                postId={postId}
                likes={likes}
              />

              <Button fullWidth text onClick={toggleCreateComment}>
                <PostCommentIcon /> <Spacing inline left="xxs" /> <b>Comment</b>
              </Button>
            </Icons>
          </CountAndIcons>

          {isCommentOpen && (
            <>
              <Spacing top="xs">
                <CommentLine />
                <CreateComment
                  post={{ id: postId, author }}
                  focus={isCommentOpen}
                />
              </Spacing>

              {comments.length > 0 && <CommentLine />}

              <Comments>
                {comments.map(comment => (
                  <Comment
                    key={comment.id}
                    comment={comment}
                    postId={postId}
                    postAuthor={author}
                  />
                ))}
              </Comments>
            </>
          )}
        </BottomRow>
      </Root>
    </>
  );
};

PostCard.propTypes = {
  author: PropTypes.object.isRequired,
  imagePublicId: PropTypes.string,
  title: PropTypes.string.isRequired,
  image: PropTypes.string,
  likes: PropTypes.array.isRequired,
  comments: PropTypes.array,
  createdAt: PropTypes.string.isRequired,
  postId: PropTypes.string.isRequired,
  openModal: PropTypes.func.isRequired,
  client: PropTypes.object.isRequired
};

export default withApollo(PostCard);
