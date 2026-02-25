import { useState, useEffect, useRef, useCallback } from "react";

interface UseCountdownOptions {
  /** ISO 8601 date string for expiration */
  expiresAt: string;
  /** Called when countdown reaches zero */
  onExpire?: () => void;
}

export function useCountdown({ expiresAt, onExpire }: UseCountdownOptions) {
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    const expiresMs = new Date(expiresAt).getTime();

    const tick = () => {
      const remaining = Math.max(0, Math.floor((expiresMs - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clear();
        onExpireRef.current?.();
      }
    };

    tick();
    timerRef.current = setInterval(tick, 1000);

    return clear;
  }, [expiresAt, clear]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formatted = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  const isExpired = timeLeft <= 0;
  const isUrgent = timeLeft > 0 && timeLeft <= 60;

  return { timeLeft, formatted, isExpired, isUrgent };
}
