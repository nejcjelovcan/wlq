import React from "react";
import { Button, Center, Stack, Text } from "@chakra-ui/core";
import Link from "next/link";

export default function ErrorPage({
  statusCode
}: {
  statusCode: number | null | undefined;
}) {
  return (
    <Center height="90vh">
      <Stack spacing={4}>
        <Text>
          {statusCode
            ? `An error ${statusCode} occurred on server`
            : "An error occurred on client"}
        </Text>

        <Link href="/" replace passHref>
          <Button as="a" size="lg" variant="outline">
            Back Home
          </Button>
        </Link>
      </Stack>
    </Center>
  );
}
