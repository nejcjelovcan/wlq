import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  useToast
} from "@chakra-ui/core";
import React, { useRef } from "react";
import ColumnFlex from "../../../../components/ColumnFlex";

const InviteYourFiends = ({ text }: { text?: string }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const toastRef = useRef<string | number | undefined>();
  const toast = useToast();

  const onClick = () => {
    if (toastRef.current) toast.close(toastRef.current);

    inputRef.current?.select();
    document.execCommand("copy");
    toastRef.current = toast({
      title: "Link copied!",
      description: "Paste it to your friends!",
      status: "success",
      duration: 3000,
      isClosable: true
    });
  };

  return (
    <ColumnFlex flexGrow={0}>
      <Stack spacing={2}>
        <Text textAlign="center">
          {text ? `${text} ` : ""}Invite your friends:
        </Text>

        <InputGroup>
          <Input
            onChange={() => {}}
            onClick={onClick}
            value={document?.location?.href}
            zIndex="base"
            pr="5.5rem"
            ref={inputRef}
          ></Input>
          <InputRightElement width="5.5rem" p={0}>
            <Button size="md" zIndex="sticky" onClick={onClick} ref={buttonRef}>
              Copy link
            </Button>
          </InputRightElement>
        </InputGroup>
      </Stack>
    </ColumnFlex>
  );
};
export default InviteYourFiends;
