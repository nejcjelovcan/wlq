import { Flex, FlexProps } from "@chakra-ui/core";
import React, { ReactNode } from "react";

export default function ColumnFlex({
  children,
  ...props
}: { children: ReactNode } & FlexProps) {
  return (
    <Flex
      data-testid="ColumnFlex"
      flexGrow={1}
      justifyContent="center"
      flexDirection="column"
      alignItems="stretch"
      {...props}
    >
      {children}
    </Flex>
  );
}
