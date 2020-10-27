import { Box, Flex, Heading, Skeleton } from "@chakra-ui/core";
import React from "react";
import UserBadge from "./UserBadge";
import { UserDetails } from "@wlq/wlq-core/lib/model";

export type PageHeadProps = {
  loading?: boolean;
  title: string;
  userDetails?: UserDetails;
  showAlias?: boolean;
};

const PageHead = ({
  loading,
  title,
  showAlias = true,
  userDetails
}: PageHeadProps) => {
  return (
    <Flex direction="row" justifyContent="space-between" alignItems="center">
      <Flex direction="row" alignItems="flex-end" height="3.2rem">
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
