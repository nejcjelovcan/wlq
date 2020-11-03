import { Box, Flex, Heading, Skeleton } from "@chakra-ui/core";
import React, { useContext } from "react";
import UserDetailsContext from "../contexts/UserDetailsContext";
import UserBadge from "./UserBadge";

export type PageHeadProps = {
  loading?: boolean;
  title: string;
  showAlias?: boolean;
};

const PageHead = ({ loading, title, showAlias = true }: PageHeadProps) => {
  const userDetails = useContext(UserDetailsContext);

  return (
    <Flex direction="row" justifyContent="space-between" alignItems="center">
      <Flex direction="row" alignItems="center" height="3.2rem">
        <Box mr={2}>
          <Skeleton isLoaded={!loading}>
            <Heading>{title}</Heading>
          </Skeleton>
        </Box>
      </Flex>
      {userDetails && (
        <UserBadge userDetails={userDetails} showAlias={showAlias} />
      )}
    </Flex>
  );
};
export default PageHead;
