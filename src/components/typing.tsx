"use client";
import { cn } from "@/utils/utils";
import { useEffect, useRef, useState } from "react";

const paragraphText = `this is a simple paragraph that does not have any punctuation it flows continuously without any stops or breaks making it a bit challenging to read but still understandable if you focus on the context words just keep coming together forming a long stream of thoughts without interruption which can sometimes make things interesting or even confusing depending on how you look at it`;
const wordsArray = paragraphText.split(" ");

export default function Typing() {
  const [word, setWord] = useState("");
  const [idx, setIdx] = useState(0);
  const [paragraph, setParagraph] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wordRefs = useRef<(HTMLDivElement | null)[]>([]);
  const boolCorrect = useRef<Boolean[]>([]);
  const previousWordRef = useRef(""); // Store previous word when backspacing

  const [caretPosition, setCaretPosition] = useState({ x: 0, y: 0 });

  const updateCaretPosition = () => {
    const currentWordRef = wordRefs.current[idx];

    if (currentWordRef) {
      const letters = currentWordRef.children;
      if (letters.length > 0) {
        const typedWord = paragraph[idx] || "";
        const lastIndex = typedWord.length > 0 ? typedWord.length - 1 : -1;
        const lastLetter =
          lastIndex >= 0
            ? (letters[lastIndex] as HTMLElement)
            : (letters[0] as HTMLElement);

        if (lastLetter) {
          const rect = lastLetter.getBoundingClientRect();
          const containerRect = containerRef.current?.getBoundingClientRect();
          if (containerRect) {
            setCaretPosition({
              x:
                lastIndex >= 0
                  ? rect.left - containerRect.left + rect.width
                  : rect.left - containerRect.left,
              y: rect.top - containerRect.top,
            });
          }
        }
      }
    }
  };

  const handleChange = (value: string) => {
    if (value.startsWith(" ")) return;

    setParagraph((prev) => {
      const newParagraph = [...prev];
      newParagraph[idx] = value.trim();
      return newParagraph;
    });

    if (value.endsWith(" ") && value.trim().length > 0) {
      setIdx((prev) => prev + 1);
      boolCorrect.current[idx] = value.trim() === wordsArray[idx];
      setWord("");
    } else {
      setWord(value);
    }
  };

  const handleBackspace = () => {
    if (idx === 0) return;

    const isBackspaceToPrev = boolCorrect.current[idx - 1];

    if (!isBackspaceToPrev) {
      setIdx((prev) => prev - 1);
      setParagraph((prev) => {
        const newParagraph = [...prev];
        previousWordRef.current = newParagraph[idx - 1] || "";
        return newParagraph;
      });
    }
  };

  useEffect(() => {
    if (previousWordRef.current) {
      setWord(previousWordRef.current);
      previousWordRef.current = "";
    }
  }, [idx]);

  useEffect(() => {
    updateCaretPosition();
  }, [word, idx, paragraph]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div ref={containerRef} className="w-2/3 text-neutral-300 relative">
        <div className="w-full relative">
          <div className="line-clamp-3 font-mono text-3xl tracking-wide">
            {wordsArray.map((word, wordIndex) => {
              const typedWord = paragraph[wordIndex] || "";
              const extraChars =
                typedWord.length > word.length
                  ? typedWord.slice(word.length).split("")
                  : [];

              return (
                <div
                  key={wordIndex}
                  className={cn("inline-block mr-6",{

                  })}
                  ref={(el) => {
                    if (el) {
                      wordRefs.current[wordIndex] = el;
                    }
                  }}
                >
                  {word.split("").map((letter, letterIndex) => {
                    const actualLetter = word[letterIndex];
                    const typedLetter = typedWord[letterIndex] || " ";

                    return (
                      <span
                        key={letterIndex}
                        className={cn("text-neutral-600 font-mono", {
                          "text-neutral-100": actualLetter === typedLetter,
                          "text-red-400":
                            actualLetter !== typedLetter && typedLetter !== " ",
                        })}
                      >
                        {letter}
                      </span>
                    );
                  })}

                  {extraChars.map((letter, extraIndex) => (
                    <span key={extraIndex} className="text-orange-700 font-mono">
                      {letter}
                    </span>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
        <span
          className="bg-sky-300/80 h-10 w-[3px] absolute"
          style={{
            top: caretPosition.y,
            left: caretPosition.x,
            transition: "left 0.05s ease-out, top 0.05s ease-out",
          }}
        />

        <input
          ref={inputRef}
          className="absolute inset-0 opacity-0"
          value={word}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && word === "") {
              handleBackspace();
            }
          }}
        />
      </div>
    </div>
  );
}
