import { Stack } from "@chakra-ui/core";
import React from "react";
import Layout from "../components/Layout";
import PageHead from "../components/PageHead";
import { useOvermind } from "../overmind";
import UserDetailsForm from "./settingsPage/UserDetailsForm";

const SettingsPage = () => {
  const {
    state: {
      router: { currentPage },
      user: { current, details }
    },
    actions: {
      router: { open },
      user: { updateDetails }
    }
  } = useOvermind();

  if (currentPage.name !== "Settings") return null;

  return (
    <Layout>
      <Stack spacing={4}>
        <PageHead title="Settings" />
        <UserDetailsForm
          current={current}
          details={details}
          updateDetails={updateDetails}
          onDone={
            currentPage.next
              ? () => open(`/room/${currentPage.next}`)
              : () => open("/")
          }
        />
      </Stack>
    </Layout>
  );
};
export default SettingsPage;
