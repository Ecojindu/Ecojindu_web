"use client";

import * as React from "react";

interface TypewriterTextProps {
  text?: string;
  speed?: number;
  delay?: number;
  className?: string;
}

export function TypewriterText({
  text = "Arrive On Time.",
  speed = 90,
  delay = 250,
  className = "text-[#8FE029]",
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = React.useState("");
  const [isDoneTyping, setIsDoneTyping] = React.useState(false);
  const [showCursor, setShowCursor] = React.useState(true);

  React.useEffect(() => {
    let index = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        index++;
        setDisplayedText(text.slice(0, index));

        if (index >= text.length) {
          clearInterval(interval);
          setIsDoneTyping(true);

          // Cursor blinks 3 times (500ms per cycle = 1500ms total), then stops and hides
          setTimeout(() => {
            setShowCursor(false);
          }, 1500);
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, speed, delay]);

  return (
    <span className={className} aria-label={text} suppressHydrationWarning>
      <span aria-hidden="true" suppressHydrationWarning>
        {displayedText}
      </span>
      {showCursor && (
        <span
          aria-hidden="true"
          className={`inline-block ml-1 w-[3px] sm:w-[4px] md:w-[5px] h-[0.85em] align-baseline bg-[#8FE029] rounded-sm ${
            isDoneTyping ? "animate-typewriter-blink-3" : "opacity-100"
          }`}
        />
      )}
    </span>
  );
}
