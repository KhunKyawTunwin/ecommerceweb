import { css } from "styled-components";

export const mobile = (props) => {
  return css`
    @media screen and (max-width: 380px) {
      ${props}
    }
  `;
};
