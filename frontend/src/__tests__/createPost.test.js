import React from "react";
import {
  render,
  cleanup,
  findByTestId,
  findByText,
  fireEvent,
  waitForElement
} from "@testing-library/react";
import CreatePost from "../components/CreatePost.js";
import theme from "../theme.js";
import { CREATE_POST } from "../graphql/post.js";
import { MockedProvider } from "react-apollo/test-utils";
import { ThemeProvider } from "styled-components";
import wait from "waait";

it("on click submit should data of the new post to the server via graphql mutation", async () => {
  const title = "title post";
  const description =
    "new post descriptionnew post descriptionnew post descriptionnew post descriptionnew post description";
  const tags = "tag1/ tag2: tag3";
  const image = "image file";
  const text =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla egestas purus eget diam rutrum, ac efficitur turpis facilisis. Cras pellentesque nunc euismod, rutrum dui at, porttitor augue. Sed non vulputate ante. Ut eu ante fringilla, malesuada felis et, mattis risus. Fusce ullamcorper rutrum mauris, eget eleifend lacus mattis sit amet. Duis iaculis semper ante, eu aliquam mauris auctor sed. Proin efficitur placerat eros ut hendrerit. Duis laoreet magna ac risus lobortis, ac dictum velit dictum. Aliquam et massa tempor, eleifend lectus sit amet, vulputate metus. Nullam nisl leo, tempus non neque vitae, lacinia varius nulla";

  const post = [
    {
      title: title,
      description: description,
      text: text,
      image: image,
      id: 1
    }
  ];

  const mocks = [
    {
      request: {
        query: CREATE_POST,
        variables: {
          input: {
            title: title,
            description: description,
            tags: "tag1, tag2, tag3",
            image: "",
            text: text
          }
        }
      },
      result: { data: post }
    }
  ];

  const { container, getByTestId } = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <ThemeProvider theme={theme}>
        <CreatePost />
      </ThemeProvider>
    </MockedProvider>
  );

  //click to open modal
  fireEvent.click(getByTestId("focusTextArea"));

  const textareaTitle = getByTestId("title");
  const textareaText = getByTestId("text");
  const textareaDescription = getByTestId("description");
  const textareaTags = getByTestId("tags");

  fireEvent.change(textareaTitle, { target: { value: title } });
  fireEvent.change(textareaText, { target: { value: text } });
  fireEvent.change(textareaDescription, { target: { value: text } });
  fireEvent.change(textareaTags, { target: { value: tags } });

  fireEvent.click(getByTestId("submit"));

  await wait(0);

  //tags error simulation
  expect(getByTestId("error").innerHTML).toContain(
    "tags should be words separated by commas only"
  );

  fireEvent.change(textareaTags, {
    target: {
      value: "tag1, tag2, tag3"
    }
  });

  fireEvent.click(getByTestId("submit"));

  //description error simulation
  expect(getByTestId("error").innerHTML).toContain(
    "the description must count between 100 characters minimum and 245 characters maximum"
  );

  fireEvent.change(textareaDescription, {
    target: {
      value: description
    }
  });

  fireEvent.click(getByTestId("submit"));

  const success = getByTestId("success");

  expect(success.innerHTML).toContain("post created!");
});
