import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import {
  A,
  H1,
  H2,
  H3,
  TAGS,
  PARAGRAPHDESC,
  TextContent,
  TagsContainer,
  Image,
  TextContainer,
  ArticleIntro,
  DescriptionTags
} from "components/Text";
import { Spacing } from "components/Layout";
import { LikeIcon, PostCommentIcon } from "components/icons";
import PostPopupInfo from "../../components/PostPopup/PostPopupInfo";

const Overlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  opacity: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s, visibility 0.3s;
  background-color: rgba(0, 0, 0, 0.3);
  color: ${p => p.theme.colors.white};
`;

const Root = styled.div`
  width: 100%;
  position: relative;
  cursor: pointer;
  border-radius: ${p => p.theme.radius.sm};
  overflow: hidden;
  border: 1px solid #ccc;
  margin-bottom: 20px;
  padding: 0 10px 0 0;

  &:hover ${Overlay} {
    opacity: 1;
  }
`;

/**
 * Card component, meant to be used in Explore page
 */

const ExploreCard = ({
  openPostPopup,
  image,
  title,
  description,
  author,
  username,
  createdAt,
  tags,
  postId,
  countLikes,
  countComments
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Root>
      <PostPopupInfo author={author} createdAt={createdAt} />

      <ArticleIntro>
        {image && <Image src={image} />}
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
      </ArticleIntro>

      <Overlay onClick={openPostPopup}>
        <LikeIcon color="white" />

        <Spacing left="xs" right="lg">
          {countLikes}
        </Spacing>

        <PostCommentIcon color="white" />

        <Spacing left="xs">{countComments}</Spacing>
      </Overlay>
    </Root>
  );
};

ExploreCard.propTypes = {
  openPostPopup: PropTypes.func.isRequired,
  image: PropTypes.string.isRequired,
  countLikes: PropTypes.number.isRequired,
  countComments: PropTypes.number.isRequired
};

export default ExploreCard;
