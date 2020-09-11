import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { generatePath } from "react-router-dom";
import { useHistory } from "react-router-dom";

import { Spacing } from "components/Layout";

import Avatar from "components/Avatar";
import { BrowserRouter as Router } from "react-router-dom";

import * as Routes from "routes";

const Root = styled.div`
  width: 100%;
  max-height: 350px;
  min-height: 40px;
  overflow: auto;
  position: absolute;
  top: 50px;
  font-size: ${p => p.theme.font.size.xs};
  box-shadow: ${p => p.theme.shadows.sm};
  background-color: ${p => p.theme.colors.white};
`;

const A = styled.a`
  text-decoration: none;
  transition: color 0.1s;
  display: inline-block;
  color: ${p =>
    p.color ? p.theme.colors[p.color] : p.theme.colors.text.secondary};
  font-weight: ${p =>
    p.weight ? p.theme.font.weight[p.weight] : p.theme.font.weight.normal};
  font-size: ${p =>
    p.size ? p.theme.font.size[p.size] : p.theme.font.size.xs};
  cursor: pointer;

  &:hover {
    color: ${p => p.theme.colors.text.primary};
  }
`;

const StyledA = styled(A)`
  display: block;

  &:hover {
    background-color: ${p => p.theme.colors.grey[100]};
  }
`;

const Item = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${p => p.theme.spacing.xs};
`;

const Name = styled.div`
  font-weight: ${p => p.theme.font.weight.bold};
`;

const UserName = styled.div`
  font-size: ${p => p.theme.font.size.xxs};
`;

const NoSearchResult = styled.div`
  text-align: center;
  padding: ${p => p.theme.spacing.xs};
  color: ${p => p.theme.colors.text.main};
`;

/**
 * Displays search result, meant to be used in Search component
 */
const SearchResult = ({ users, posts, forMessage }) => {
  let history = useHistory();
  if ((!users && !posts) || (users.length < 1 && posts.length < 1)) {
    return (
      <Root>
        <NoSearchResult>No search results.</NoSearchResult>
      </Root>
    );
  }

  const openModal = postId => {
    history.push(`/post/${postId}`);
  };

  return (
    <Root>
      {users.map(user => (
        <StyledA
          key={user.id}
          to={
            forMessage
              ? generatePath(Routes.MESSAGES, { userId: user.id })
              : generatePath(Routes.USER_PROFILE, { username: user.username })
          }
        >
          <Item>
            <Avatar image={user.image} size={34} />

            <Spacing left="xs">
              <Name>{user.fullName}</Name>
              <UserName>@{user.username}</UserName>
            </Spacing>
          </Item>
        </StyledA>
      ))}

      {posts.map(post => (
        <StyledA key={post.id}>
          <Item data-testid="result" onClick={() => openModal(post.id)}>
            {post.title}
          </Item>
        </StyledA>
      ))}
    </Root>
  );
};

SearchResult.propTypes = {
  users: PropTypes.array.isRequired,
  forMessage: PropTypes.bool
};

export default SearchResult;
