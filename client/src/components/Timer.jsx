import { useEffect, useRef, useState } from "react";

export default function Timer({ deadline, durationSec, onExpire }) {
  const [secondsLeft, setSecondsLeft] = useState(durationSec);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    const id = setInterval(() => {
      const left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setSecondsLeft(left);
      if (left === 0) {
        clearInterval(id);
        onExpireRef.current();   // submits; the server gives -1 per unanswered question
      }
    }, 250);
    return () => clearInterval(id);
  }, [deadline]);

  const m = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const s = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className={"timer" + (secondsLeft <= 60 ? " danger" : "")}>
      {m}:{s}
    </div>
  );
}