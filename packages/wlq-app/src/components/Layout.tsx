import { Flex } from "@chakra-ui/core";
import React, { FC } from "react";

const Layout: FC = ({ children }) => {
  const width = { base: "100%", sm: "30em" };

  return (
    <Flex
      data-testid="layout"
      direction="column"
      height="100vh"
      p={3}
      pb={4}
      alignItems="center"
    >
      <Flex direction="column" width={width} flexGrow={1}>
        {children}
      </Flex>
    </Flex>
  );
};
export default Layout;
