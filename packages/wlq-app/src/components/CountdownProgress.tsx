import { CircularProgress, CircularProgressLabel } from "@chakra-ui/core";
import React from "react";
import useCountdown from "../hooks/useCountdown";

export default function CountdownProgress({
  visible,
  time
}: {
  visible: boolean;
  time?: number;
}) {
  const timeLeft = useCountdown(visible ? time : undefined);
  const color =
    time !== undefined && timeLeft !== undefined && timeLeft < time / 3
      ? "red.600"
      : "green.600";

  return (
    <CircularProgress
      // css={visible ? { animationDuration: "1s" } : { animation: "none" }}
      // key={questionText}
      data-testid="progress"
      visibility={visible ? "visible" : "hidden"}
      size="4rem"
      min={0}
      max={time}
      isIndeterminate={!visible}
      value={visible ? timeLeft : time}
      capIsRound
      trackColor="gray.900"
      color={color}
    >
      <CircularProgressLabel>{timeLeft}</CircularProgressLabel>
    </CircularProgress>
  );
}
