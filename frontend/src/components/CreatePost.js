import React, { useState } from "react";
import { Mutation } from "react-apollo";
import styled from "styled-components";

import { Spacing, Overlay, Container } from "components/Layout";
import { Error } from "components/Text";
import { Button } from "components/Form";
import Avatar from "components/Avatar";
import theme from "../theme.js";

import PostImageUpload from "pages/Home/PostImageUpload";

import { GET_FOLLOWED_POSTS, CREATE_POST } from "graphql/post";
import { GET_AUTH_USER, GET_USER_POSTS } from "graphql/user";

import { useStore } from "store";

import { PROFILE_PAGE_POSTS_LIMIT } from "constants/DataLimit";
import { HOME_PAGE_POSTS_LIMIT } from "constants/DataLimit";
import { MAX_POST_IMAGE_SIZE } from "constants/ImageSize";

import { useGlobalMessage } from "hooks/useGlobalMessage";

const RootFocused = styled(Container)`
  margin: 0 auto;
  margin-top: 0;
  width: 100%;
  padding: 0 20px;
  background-color: #fff;
  border-radius: 3px;
  border: 0;
  border: 1px solid #e0e0e0;

  z-index: 3000;
  padding: 10px;
  position: absolute;
  top: 0;
`;

const Root = styled(Container)`
  position: relative;
  margin: 0px auto;
  width: 100%;
  padding: 0px 20px;
  z-index: 10;
  background-color: rgb(255, 255, 255);
  border-radius: 3px;
  border: 1px solid rgb(224, 224, 224);
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  padding: 5px 20px;
  z-index: 30;
  background-color: #fff;
  border-radius: 3px;
  border: 0;
  border: 1px solid #e0e0e0;
  position: relative;
  padding-right: 20px;
`;

const OptionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: ${p => p.theme.spacing.sm} 0;
`;

const TextareaOption = styled.textarea`
  width: 100%;
  margin: 0px 10px;
  padding-left: 20px;
  padding-top: 10px;
  border: 0px;
  outline: none;
  resize: none;
  transition: all 0.1s ease-out 0s;
  height: 40px;
  font-size: 14px;
  background-color: rgb(245, 245, 245);
  border-radius: 6px;
`;

const TextareaBig = styled.textarea`
  width: 100%;
  margin: 10px 0;
  padding-left: 20px;
  padding-top: 10px;
  border: 0;
  outline: none;
  resize: none;
  transition: 0.1s ease-out;
  height: 120px;
  font-size: 14px;
  background-color: rgb(245, 245, 245);
  border-radius: 6px;
`;

const TextareaMedium = styled.textarea`
  width: 100%;
  margin: 10px 0;
  padding-left: 20px;
  padding-top: 10px;
  border: 0;
  outline: none;
  resize: none;
  transition: 0.1s ease-out;
  height: 80px;
  font-size: 14px;
  background-color: rgb(245, 245, 245);
  border-radius: 6px;
`;

const TextareaSmall = styled.textarea`
  width: 100%;
  margin: 10px 0;
  padding-left: 10px;
  padding-top: 10px;
  border: 0;
  outline: none;
  resize: none;
  transition: 0.1s ease-out;
  height: auto;
  font-size: 14px;
  background-color: rgb(245, 245, 245);
  border-radius: 6px;
`;

const ImagePreviewContainer = styled.div`
  width: 150px;
  height: 150px;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: ${p => p.theme.shadows.sm};
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Options = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-top: 1px solid "#e0e0e0";
  padding: 20px 0;
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
`;

const Success = styled.div`
  color: green;
  font-size: 14px;
`;

function CreatePost() {
  const store = useStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [text, setText] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const message = useGlobalMessage();

  const handleReset = () => {
    setTitle("");
    setDescription("");
    setText("");
    setTags("");
    setSuccess("");
    setImage("");
    setIsFocused(false);
    setError("");
  };

  const handleOnFocus = () => setIsFocused(true);

  const handlePostImageUpload = e => {
    const file = e.target.files[0];
    console.log("file", file);

    if (!file) return;

    if (file.size >= MAX_POST_IMAGE_SIZE) {
      message.error(
        `File size should be less then ${MAX_POST_IMAGE_SIZE / 1000000}MB`
      );
      setError(
        `File size should be less then ${MAX_POST_IMAGE_SIZE / 1000000}MB`
      );
      return;
    }

    setImage(file);

    setIsFocused(true);
    e.target.value = null;
  };

  const handleTitleChange = e => {
    setTitle(e.target.value);
    setError("");
  };

  const handleDescriptionChange = e => {
    setDescription(e.target.value);
    setError("");
  };

  const handleTextChange = e => {
    setText(e.target.value);
    setError("");
  };

  const handleTagsChange = e => {
    setTags(e.target.value);
    setError("");
  };

  const handleSubmit = async (e, createPost) => {
    e.preventDefault();

    if (
      title.length === 0 ||
      text.length === 0 ||
      tags.length === 0 ||
      description.length === 0
    ) {
      setError("please ensure all fields are filled");
      return;
    }

    if (tags.match(/[^A-Za-z0-9 \,]/gi, "")) {
      setError("tags should be words separated by commas only");
      return;
    }

    if (description.length < 100 || description.length > 245) {
      setError(
        "the description must count between 100 characters minimum and 245 characters maximum"
      );
      return;
    }

    if (title.length > 100) {
      setError("the title must count 100 characters maximum");
      return;
    }

    if (text.length < 150) {
      setError("the text must count 150 characters minimum");
      return;
    }

    createPost();

    setSuccess("post created!");

    setTimeout(() => {
      handleReset();
    }, 1000);
  };

  return (
    <Mutation
      mutation={CREATE_POST}
      variables={{
        input: {
          title,
          description,
          text,
          tags,
          image,
          authorId: store ? store[0].auth.user.id : ""
        }
      }}
      refetchQueries={() => [
        {
          query: GET_FOLLOWED_POSTS,
          variables: {
            userId: store ? store[0].auth.user.id : "",
            skip: 0,
            limit: HOME_PAGE_POSTS_LIMIT
          }
        },
        { query: GET_AUTH_USER },
        {
          query: GET_USER_POSTS,
          variables: {
            username: store ? store[0].auth.user.username : "",
            skip: 0,
            limit: PROFILE_PAGE_POSTS_LIMIT
          }
        }
      ]}
    >
      {(createPost, { loading, error: apiError }) => {
        const isShareDisabled =
          loading ||
          title.length === 0 ||
          description.length === 0 ||
          tags.length === 0 ||
          text.length === 0;

        return (
          <>
            {isFocused && <Overlay onClick={handleReset} />}
            {!isFocused && (
              <Root color="white" radius="sm" padding="sm">
                <form onSubmit={e => handleSubmit(e, createPost)}>
                  <OptionWrapper>
                    <Avatar
                      image={store ? store[0].auth.user.image : ""}
                      size={40}
                    />

                    <TextareaOption
                      type="textarea"
                      name="title"
                      data-testid="focusTextArea"
                      focus={isFocused}
                      onFocus={handleOnFocus}
                      onClick={handleOnFocus}
                      placeholder="Publish an article"
                    />

                    {!isFocused && (
                      <PostImageUpload handleChange={handlePostImageUpload} />
                    )}
                  </OptionWrapper>
                </form>
              </Root>
            )}
            {isFocused && (
              <RootFocused color="white" radius="sm" padding="sm">
                <form onSubmit={e => handleSubmit(e, createPost)}>
                  <Wrapper>
                    <Avatar
                      image={store ? store[0].auth.user.image : ""}
                      size={40}
                    />

                    <TextareaSmall
                      type="textarea"
                      name="title"
                      data-testid="title"
                      focus={isFocused}
                      value={title}
                      onFocus={handleOnFocus}
                      onChange={handleTitleChange}
                      placeholder="Add your article's title"
                    />

                    <TextareaMedium
                      type="textarea"
                      name="description"
                      data-testid="description"
                      focus={isFocused}
                      value={description}
                      onFocus={handleOnFocus}
                      onChange={handleDescriptionChange}
                      placeholder="Add your article's description"
                    />

                    <TextareaBig
                      type="textarea"
                      name="text"
                      data-testid="text"
                      focus={isFocused}
                      value={text}
                      onFocus={handleOnFocus}
                      onChange={handleTextChange}
                      placeholder="Add your article's text"
                    />

                    <TextareaSmall
                      type="textarea"
                      name="tags"
                      data-testid="tags"
                      focus={isFocused}
                      value={tags}
                      onFocus={handleOnFocus}
                      onChange={handleTagsChange}
                      placeholder="Add article tags - separate with commas"
                    />

                    <Options>
                      <PostImageUpload
                        label="Photo"
                        handleChange={handlePostImageUpload}
                      />

                      <Buttons>
                        <Button text type="button" onClick={handleReset}>
                          Cancel
                        </Button>
                        <Button
                          data-testid="submit"
                          disabled={isShareDisabled}
                          type="submit"
                        >
                          Share
                        </Button>
                      </Buttons>
                    </Options>
                  </Wrapper>
                </form>
                {apiError ||
                  (error && (
                    <Spacing top="xs" bottom="sm">
                      <Error size="xs" data-testid="error">
                        {apiError
                          ? "Error: something went wrong, please try again"
                          : error}
                      </Error>
                    </Spacing>
                  ))}

                {success && (
                  <Spacing top="xs" bottom="sm">
                    <Success data-testid="success">{success}</Success>
                  </Spacing>
                )}
              </RootFocused>
            )}
          </>
        );
      }}
    </Mutation>
  );
}

export default CreatePost;
