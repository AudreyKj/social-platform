import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { generatePath } from "react-router-dom";

import { A } from "components/Text";
import Follow from "components/Follow";
import { Spacing } from "components/Layout";
import Avatar from "components/Avatar";

import * as Routes from "routes";

import { useStore } from "store";
import { timeAgo } from "utils/date";

const Root = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${p => p.theme.colors.border.main};
  padding: ${p => p.theme.spacing.xs};
  margin-bottom: ${p => p.theme.spacing.xxs};
`;

const Author = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: ${p => p.theme.spacing.sm};
`;

const UserName = styled.div`
  max-width: 100%;
  font-size: ${p => p.theme.font.size.xs};
  font-weight: ${p => p.theme.font.weight.bold};
`;

const CreatedAt = styled.div`
  font-size: ${p => p.theme.font.size.tiny};
  color: ${p => p.theme.colors.text.secondary};
`;

const Name = styled.span`
  font-size: ${p => p.theme.font.size.xs};
  font-weight: ${p => p.theme.font.weight.bold};
  color: ${p => p.theme.colors.primary.main};
`;

/**
 * Author info for PostPopup component
 */

const PostPopupInfo = ({ author, createdAt }) => {
  const [{ auth }] = useStore();

  console.log("createdAt postpopup", createdAt);

  return (
    <Root>
      <Author>
        <A
          to={generatePath(Routes.USER_PROFILE, { username: author.username })}
        >
          <Avatar image={author.image} />
        </A>

        <Spacing left="xs">
          <Name>{author.username}</Name>
          <CreatedAt>{timeAgo(createdAt)} ago</CreatedAt>
        </Spacing>
      </Author>

      {auth.user.id !== author.id && <Follow user={author} />}
    </Root>
  );
};

PostPopupInfo.propTypes = {
  author: PropTypes.object.isRequired
};

export default PostPopupInfo;
