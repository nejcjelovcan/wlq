import { useEffect, useState } from "react";

export default function useCountdown(time: number | undefined) {
  const [intervalHandle, setIntervalHandle] = useState<any>(undefined);
  const [timeLeft, setTimeLeft] = useState(time);
  useEffect(() => {
    if (time !== undefined) {
      setTimeLeft(time);
      setIntervalHandle(
        setInterval(() => {
          setTimeLeft(timeLeft => {
            if (timeLeft !== undefined) {
              if (timeLeft === 0) return 0;
              return timeLeft - 1;
            }
            return;
          });
        }, 1000)
      );
    } else {
      clearInterval(intervalHandle);
    }
    return () => clearInterval(intervalHandle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

  return timeLeft;
}
