import { Button, Skeleton, Stack } from "@chakra-ui/core";

import React from "react";
import Layout from "../components/Layout";
import PageHead from "../components/PageHead";

const FauxRoom = () => <Skeleton height="2rem" />;

const IndexPage = () => {
  return (
    <Layout>
      <Stack spacing={4}>
        <PageHead title="Hello!" />
        <Stack spacing={2}>
          <FauxRoom />
          <FauxRoom />
          <FauxRoom />
          <FauxRoom />
          <FauxRoom />
        </Stack>

        <Button as="a" size="lg" href="/room">
          New Game
        </Button>

        <Button as="a" size="lg" href="/settings">
          Settings
        </Button>

        {/* <Button size="lg" onClick={() => clearUserData()}>
          Clear data
        </Button> */}
      </Stack>
    </Layout>
  );
};
export default IndexPage;
