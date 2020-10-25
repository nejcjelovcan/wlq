import { Button, Skeleton, Stack } from "@chakra-ui/core";
import Link from "next/link";
import React from "react";
import PageHead from "../components/PageHead";
// import useToken from "../hooks/useToken";
import useUserDetails from "../hooks/useUserDetails";

const FauxRoom = () => <Skeleton height="2rem" />;

const IndexPage = () => {
  // useToken();
  useUserDetails();
  // const {
  //   actions: {
  //     user: { clearUserData }
  //   }
  // } = useOvermind();
  return (
    <>
      <Stack spacing={4}>
        <PageHead title="Hello!" />
        <Stack spacing={2}>
          <FauxRoom />
          <FauxRoom />
          <FauxRoom />
          <FauxRoom />
          <FauxRoom />
        </Stack>
        <Link href="/room/" passHref>
          <Button as="a" size="lg">
            New Game
          </Button>
        </Link>
        <Link href="/settings/" passHref>
          <Button as="a" size="lg">
            Settings
          </Button>
        </Link>
        {/* <Button size="lg" onClick={() => clearUserData()}>
          Clear data
        </Button> */}
      </Stack>
    </>
  );
};
export default IndexPage;