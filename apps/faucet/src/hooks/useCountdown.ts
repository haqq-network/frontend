import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

const TIME_H_IN_DAY = 24;
const TIME_MIN_IN_H = 60;
const TIME_SEC_IN_MIN = 60;
const TIME_MS_IN_SEC = 1000;

export function useCountdown(seconds: number) {
  const intervalRef = useRef<number>();
  const [timeLeft, setTimeLeft] = useState<number>(seconds);
  const [countdown, setCountdown] = useState<TimeLeft | null>(null);

  const handleAllocateTimeUnits = useCallback(() => {
    const timeDifference = timeLeft * TIME_MS_IN_SEC;
    const secondsLeft = Math.floor(
      (timeDifference / TIME_MS_IN_SEC) % TIME_SEC_IN_MIN,
    );
    const minutesLeft = Math.floor(
      (timeDifference / (TIME_MS_IN_SEC * TIME_MIN_IN_H)) % TIME_SEC_IN_MIN,
    );
    const hoursLeft = Math.floor(
      (timeDifference / (TIME_MS_IN_SEC * TIME_MIN_IN_H * TIME_SEC_IN_MIN)) %
        TIME_H_IN_DAY,
    );
    const daysLeft = Math.floor(
      timeDifference /
        (TIME_MS_IN_SEC * TIME_MIN_IN_H * TIME_SEC_IN_MIN * TIME_H_IN_DAY),
    );
    const hoursLeftWithDays = daysLeft * TIME_H_IN_DAY + hoursLeft;

    setCountdown({
      hours: hoursLeftWithDays,
      minutes: minutesLeft,
      seconds: secondsLeft,
    });

    setTimeLeft((seconds) => {
      return seconds - 1;
    });
  }, [timeLeft]);

  useEffect(() => {
    const intervalId = setInterval(handleAllocateTimeUnits, 1000) as unknown;
    intervalRef.current = intervalId as number;

    return () => {
      clearInterval(intervalRef.current);
    };
  });

  useEffect(() => {
    if (timeLeft <= 0) {
      clearInterval(intervalRef.current);
    }
  }, [timeLeft]);

  const memoizedCountdown = useMemo(() => {
    if (!countdown) {
      return null;
    }

    return {
      hours: countdown.hours,
      minutes: countdown.minutes,
      seconds: countdown.seconds,
    };
  }, [countdown]);

  return memoizedCountdown;
}
