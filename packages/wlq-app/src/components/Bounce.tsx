import { Box } from "@chakra-ui/core";
import { css, keyframes } from "@emotion/core";
import React, { ReactNode } from "react";

export default function Bounce({
  animate,
  children
}: {
  animate: boolean;
  children: ReactNode;
}) {
  return <Box css={animate ? bounce : css``}>{children}</Box>;
}

const animation = keyframes`
  from, 20%, 53%, 80%, to {
    transform: translate3d(0,0,0);
  }

  40%, 43% {
    transform: translate3d(0, -30px, 0);
  }

  70% {
    transform: translate3d(0, -15px, 0);
  }

  90% {
    transform: translate3d(0,-4px,0);
  }
`;

const bounce = css`
  animation: ${animation} 1s ease;
  animation-duration: 1s;
`;
