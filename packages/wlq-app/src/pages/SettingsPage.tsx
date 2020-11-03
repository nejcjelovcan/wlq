import { Stack } from "@chakra-ui/core";
import React from "react";
import Layout from "../components/Layout";
import PageHead from "../components/PageHead";
import { useActions } from "../overmind";
import { SettingsParams } from "../overmind/root.statemachine";
import {
  getUserDetails,
  UserMachine
} from "../overmind/user/user.statemachine";
import UserDetailsForm from "./settingsPage/UserDetailsForm";

const SettingsPage = ({
  user,
  params: { roomId }
}: {
  user: UserMachine;
  params: SettingsParams;
}) => {
  const {
    router: { open },
    user: { updateDetails }
  } = useActions();

  return (
    <Layout>
      <Stack spacing={4}>
        <PageHead title="Settings" />
        <UserDetailsForm
          current={user.current}
          details={getUserDetails(user)}
          updateDetails={updateDetails}
          onDone={
            roomId
              ? () => open({ path: `/room/${roomId}` })
              : () => open({ path: "/" })
          }
        />
      </Stack>
    </Layout>
  );
};
export default SettingsPage;
