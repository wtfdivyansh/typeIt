"use client";
import { useSettingsStore } from "@/store/use-settings-store";
import { cn } from "@/utils/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

const paragraphText = `this is a simple paragraph that does not have any punctuation it flows continuously without any stops or breaks making it a bit challenging to read but still understandable if you focus on the context words just keep coming together forming a long stream of thoughts without interruption which can sometimes make things interesting or even confusing depending on how you look at it`;
const wordsArray = paragraphText.split(" ");

export default function Typing() {
  const { settings } = useSettingsStore();
  const [word, setWord] = useState("");
  const [idx, setIdx] = useState(0);
  const [paragraph, setParagraph] = useState<string[]>([]);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(settings.time);
  const [isFocused, setIsFocused] = useState(false);
  const [wpm, setWpm] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wordRefs = useRef<(HTMLDivElement | null)[]>([]);
  const boolCorrect = useRef<Boolean[]>([]);
  const previousWordRef = useRef("");
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [caretPosition, setCaretPosition] = useState({ x: 0, y: 0 });

  const updateCaretPosition = useCallback(() => {
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
  }, [idx, paragraph]);

  const updateScrollPosition = useCallback(() => {
    if (scrollRef.current) {
      const lastWord = wordRefs.current[idx];
      if (lastWord) {
        const wordRect = lastWord.getBoundingClientRect();
        const scrollRect = scrollRef.current.getBoundingClientRect();

        if (wordRect.bottom > scrollRect.bottom) {
          scrollRef.current.scrollBy({
            top: scrollRect.height - wordRect.height,
            behavior: "instant",
          });
        }
      }
    }
  }, [idx]);

  const handleChange = useCallback((value: string) => {
    if (value.startsWith(" ")) return;
    
    if (paragraph.length === 0 && value !== "") {
      setIsTestStarted(true);
    }

    setParagraph((prev) => {
      const newParagraph = [...prev];
      newParagraph[idx] = value.trim();
      return newParagraph;
    });

    if (value.endsWith(" ") && value.trim().length > 0) {
      boolCorrect.current[idx] = value.trim() === wordsArray[idx];
      setIdx((prev) => prev + 1);
      setWord("");
    } else {
      setWord(value);
    }
  }, [idx, paragraph.length]);

  const handleBackspace = useCallback(() => {
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
  }, [idx]);

  const reset = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setWord("");
    setIdx(0);
    setParagraph([]);
    setIsTestStarted(false);
    setIsFocused(false);
    setWpm(0);
    setTimeLeft(settings.time);
    boolCorrect.current = [];
  }, [settings.time]);

  // Handle timer
  useEffect(() => {
    if (!isTestStarted) return;
    
    if (timeLeft === 0) {
      reset();
      return;
    }
    
    if (!timerRef.current) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            clearInterval(timerRef.current!);
            timerRef.current = null;
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isTestStarted, timeLeft, reset]);


  useEffect(() => {
    if (!isTestStarted) return;
    
    const elapsedTime = settings.time - timeLeft;
    if (elapsedTime <= 0) return;
    
    const elapsedTimeInMinutes = elapsedTime / 60;
    const typedChars = paragraph.join("").length;
    const wpmValue = Math.floor(typedChars / 5 / elapsedTimeInMinutes);
    
    setWpm(wpmValue);
  }, [isTestStarted, timeLeft, paragraph, settings.time]);

  useEffect(() => {
    if (previousWordRef.current) {
      setWord(previousWordRef.current);
      previousWordRef.current = "";
    }
  }, [idx]);

  useEffect(() => {
    if (isFocused) {
      inputRef.current?.focus();
    }
  }, [isFocused]);


  useEffect(() => {
    let isUpdateScheduled = false;
    
    const updatePositions = () => {
      if (isUpdateScheduled) return;
      
      isUpdateScheduled = true;
      requestAnimationFrame(() => {
        updateScrollPosition();
        updateCaretPosition();
        isUpdateScheduled = false;
      });
    };
    
    updatePositions();
    

    if (isFocused) {
      window.addEventListener('resize', updatePositions);
    }
    
    return () => {
      window.removeEventListener('resize', updatePositions);
    };
  }, [word, idx, isFocused, updateScrollPosition, updateCaretPosition]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center justify-center w-[75%]">
        <div className="self-start flex flex-row gap-x-2 justify-between w-full ">
          <span className="font-mono text-neutral-300 text-xl">{wpm} </span>
          <span className="font-mono text-neutral-400 text-xl self-end">
            {timeLeft}s
          </span>
        </div>
        <div
          ref={containerRef}
          className="w-full  text-neutral-300 relative"
          tabIndex={0}
          onFocus={() => {
            setIsFocused(true);
          }}
          onBlur={() => setIsFocused(false)}
        >
          <div
            ref={scrollRef}
            className="w-full max-h-[9rem] overflow-y-auto overflow-x-hidden relative"
          >
            <div className="font-mono text-3xl tracking-wide leading-[3rem]">
              {wordsArray.map((word, wordIndex) => {
                const typedWord = paragraph[wordIndex] || "";
                const extraChars =
                  typedWord.length > word.length
                    ? typedWord.slice(word.length).split("")
                    : [];

                return (
                  <div
                    key={wordIndex}
                    className={cn("inline-block mr-6 ", {
                      "underline underline-offset-4":
                        extraChars.length > 0 ||
                        (!boolCorrect.current[wordIndex] && idx > wordIndex),
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
                              actualLetter !== typedLetter &&
                              typedLetter !== " ",
                          })}
                        >
                          {letter}
                        </span>
                      );
                    })}

                    {extraChars.map((letter, extraIndex) => (
                      <span
                        key={extraIndex}
                        className="text-orange-700 font-mono"
                      >
                        {letter}
                      </span>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
          {isFocused && (
            <motion.div
              layoutId="caret"
              className="bg-sky-300/80 h-10 w-[3px] absolute"
              style={{
                top: caretPosition.y,
                left: caretPosition.x,
              }}
              transition={{
                type: "spring",
                damping: 20,
                stiffness: 300,
                duration: 0.1,
              }}
            />
          )}
          <input
            ref={inputRef}
            className="absolute inset-0 opacity-0"
            value={word}
            disabled={!isFocused}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && word === "") {
                handleBackspace();
              }
            }}
          />
          {!isFocused && !isTestStarted && (
            <div className="absolute inset-0 bg-transparent backdrop-blur-sm transition-opacity duration-300 flex items-center justify-center text-white text-2xl font-mono">
              Click here to start
            </div>
          )}
        </div>
      </div>
    </div>
  );
}