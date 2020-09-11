import styled from "styled-components";
import { css } from "styled-components";
import { Link } from "react-router-dom";

/**
 * Wrapper around React Router's Link component, that uses theme styling
 *
 * @param {string} color
 * @param {string} weight
 * @param {string} size
 */
export const A = styled(Link)`
  text-decoration: none;
  transition: color 0.1s;
  display: inline-block;
  color: ${p =>
    p.color ? p.theme.colors[p.color] : p.theme.colors.text.secondary};
  font-weight: ${p =>
    p.weight ? p.theme.font.weight[p.weight] : p.theme.font.weight.normal};
  font-size: ${p =>
    p.size ? p.theme.font.size[p.size] : p.theme.font.size.xs};

  &:hover {
    color: ${p => p.theme.colors.text.primary};
  }
`;

/**
 * Component for wrapping error messages
 */
export const Error = styled.div`
  color: ${p =>
    p.color ? p.theme.colors[p.color] : p.theme.colors.error.main};
  font-size: ${p =>
    p.size ? p.theme.font.size[p.size] : p.theme.font.size.sm};
`;

/**
 * Helper function for adding styles to Heading components
 *
 * @param {string} size, size of text
 */
const getHeadingStyles = size => css`
  margin: 0;
  font-size: ${size};
  font-weight: ${p => p.theme.font.weight.normal};
  color: ${p =>
    p.color ? p.theme.colors[p.color] : p.theme.colors.text.primary};
`;

export const H1 = styled.h1`
  ${getHeadingStyles(p => p.theme.font.size.lg)};
  font-weight: bold;
  margin: 0;
`;

export const H2 = styled.h2`
  ${getHeadingStyles(p => p.theme.font.size.md)};
  margin: 0;
`;

export const H3 = styled.h3`
  ${getHeadingStyles(p => p.theme.font.size.xs)};
  margin: 0;
`;

export const PARAGRAPHTEXT = styled.p`
  margin-top: 0;
  margin-bottom: 10px;
  line-height: 2;
`;

export const PARAGRAPHDESC = styled.p`
  margin-top: 10px;
  margin-bottom: 10px;
  line-height: 1.2;

  @media (max-width: 500px) {
    font-size: 0.9rem;
    width: 90%;
  }
`;

export const TAGS = styled.span`
  margin-right: 0.6em;
  padding: 0 15px;
  margin-bottom: 10px;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  border: 1px solid transparent;
  border-radius: 2em;
  background-color: #0366d6;
  color: white;
  display: inline-block;

  @media (max-width: 500px) {
    font-size: 0.9rem;
    padding: 0 10px;
  }
`;

export const TextContent = styled.div`
  display: flex;
  flex-direction: column;
`;

export const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const Image = styled.img`
  display: block;

  width: ${p => !p.usedInModal && "20%"};
  max-height: ${p => (p.usedInModal ? "200px" : "20%")};

  margin-right: 10px;
  object-fit: cover;

  @media (max-width: 650px) {
    width: 40%;
  }

  @media (max-width: 550px) {
    width: 60%;
    margin-bottom: 10px;
  }
`;

export const TextContainer = styled.div`
  overflow: scroll;
`;

export const ArticleIntro = styled.div`
  display: flex;

  @media (max-width: 550px) {
    flex-direction: column;
  }
`;

export const DescriptionTags = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
`;
