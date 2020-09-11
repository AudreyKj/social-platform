import React from "react";
import {
  render,
  cleanup,
  findByTestId,
  findByText,
  fireEvent,
  waitForElement
} from "@testing-library/react";
import SearchResult from "../components/Search/SearchResult.js";
import theme from "../theme.js";
import { SEARCH_POSTS } from "../graphql/post";
import { MockedProvider } from "react-apollo/test-utils";
import { useApolloClient } from "@apollo/react-hooks";
import { ThemeProvider } from "styled-components";

import wait from "waait";

jest.mock("react-router-dom", () => ({
  useHistory: () => ({
    push: jest.fn()
  })
}));

it("should display posts in search results", async () => {
  const post = [
    {
      createdAt: "1599684957285",
      description:
        "Lorem IpsumLorem IpsumLorem IpsumLorem IpsumLorem IpsumLorem IpsumLorem IpsumLorem Ipsum",
      id: "5f59415d5915270cc2f61db9",
      image:
        "https://res.cloudinary.com/dkkf9iqnd/image/upload/v1599684956/post/332ecf91-dd51-478f-bb69-0d7229697460.jpg",
      tags: "tag1, tag2, tag3, tag4",
      text:
        "It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      title: "article title"
    }
  ];

  const { container, getByTestId } = render(
    <ThemeProvider theme={theme}>
      <SearchResult posts={post} users={[]} />
    </ThemeProvider>
  );

  const result = getByTestId("result");

  expect(result.innerHTML).toContain("article title");
});
