"use client";
import { useSettingsStore } from "@/store/use-settings-store";
import { cn } from "@/utils/utils";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { DEFAULT_CHARS } from "@/utils/constants";
import Result from "./results";
import { generateWords } from "@/lib/words-generator";
import { char } from "drizzle-orm/mysql-core";

// const paragraphText = `this is a simple paragraph that does not have any punctuation it flows continuously without any stops or breaks making it a bit challenging to read but still understandable if you focus on the context words just keep coming together forming a long stream of thoughts without interruption which can sometimes make things interesting or even confusing depending on how you look at it`;

// const wordsArray = paragraphText.split(" ");

type ParagraphWithTimestamp = {
  word: string;
  timeStamp: number;
  wpm: number;
};
type charWithTimestamp = {
  event_type: "backspace" | "space" | "letter" | "prev_word";
  char: string;
  time: number;
  
};
type ParaResult = {
  correct: number;
  incorrect: number;
  missed: number;
};

type ChartData = {
  time: number;
  wpm: number;
};

export default function Typing() {
  const { settings } = useSettingsStore();
  const [text, setText] = useState(generateWords);
  const [word, setWord] = useState("");
  const [idx, setIdx] = useState(0);
  const [paragraph, setParagraph] = useState<ParagraphWithTimestamp[]>([]);
  const charPositionRef = useRef<number>(0);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(settings.time);
  const [isFocused, setIsFocused] = useState(false);
  const [accuracy, setAccuracy] = useState(0);
  const [result, setResult] = useState<ParaResult | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [wpm, setWpm] = useState(0);
  const chartDataRef = useRef<ChartData[]>([]);
  const charWithTimestampRef = useRef<charWithTimestamp[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wordRefs = useRef<(HTMLDivElement | null)[]>([]);
  const boolCorrect = useRef<Boolean[]>([]);
  const previousWordRef = useRef("");
  const gameStartTime = useRef<number | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [caretPosition, setCaretPosition] = useState({ x: 0, y: 0 });
  const [wordsArray, setWordsArray] = useState<string[]>(
    generateWords().split(" ")
  );
  const [opacity, setOpacity] = useState(0);

  const updateCaretPosition = useCallback(() => {
    const currentWordRef = wordRefs.current[idx];

    if (currentWordRef) {
      const letters = currentWordRef.children;
      if (letters.length > 0) {
        const typedWord = paragraph[idx]?.word || "";
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

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      console.log(e.key);
      const value = e.currentTarget.value;

      console.log(charPositionRef.current, "position");
      if (e.key === "Backspace") {
        console.log(value);
        console.log(word);
        console.log(boolCorrect.current);
        console.log(idx);
        if (value === "" && idx > 0) {
          console.log("insided");
          const isBackspaceToPrev = boolCorrect.current[idx - 1];

          if (!isBackspaceToPrev) {
            console.log("back to prev");
            setIdx((prev) => prev - 1);
            setParagraph((prev) => {
              const newParagraph = [...prev];
              previousWordRef.current = newParagraph[idx - 1].word || "";
              return newParagraph;
            });
            charWithTimestampRef.current[charPositionRef.current] = {
              event_type: "prev_word",
              char: " ",
              time: (Date.now() - gameStartTime.current!)
            };
            charPositionRef.current++;
          }

        
          
        } else if (value.length > 0) {
          charWithTimestampRef.current[charPositionRef.current] = {
            event_type: "backspace",
            char: value[value.length - 1],
            time: (Date.now() - gameStartTime.current!) 
          };
          charPositionRef.current++;
          setWord((prev) => prev.slice(0, -1));

          setParagraph((prev) => {
            const newParagraph = [...prev];
            newParagraph[idx] = {
              word: word.slice(0, -1).trim(),
              timeStamp: Date.now(),
              wpm: paragraph[idx]?.wpm || 0,
            };
            return newParagraph;
          });
        }
        return;
      }

      if (e.key === " ") {
        e.preventDefault();
        if (value.trim().length > 0) {
          const startTimeOfPrevWord =
            idx === 0 ? gameStartTime.current! : paragraph[idx - 1].timeStamp;

          const elapsedTime = (Date.now() - startTimeOfPrevWord) / 1000 / 60;

          const wordWPM =
            elapsedTime > 0
              ? Math.floor(wordsArray[idx].length / 5 / elapsedTime)
              : 0;

          boolCorrect.current[idx] = value.trim() === wordsArray[idx];
          setParagraph((prev) => {
            const newParagraph = [...prev];
            newParagraph[idx] = {
              ...newParagraph[idx],
              wpm: wordWPM,
            };
            return newParagraph;
          });
          charWithTimestampRef.current[charPositionRef.current] = {
            event_type: "space",
            char: " ",
            time: (Date.now() - gameStartTime.current!) ,
            
          };
          charPositionRef.current++;

          setIdx((prev) => prev + 1);
          setWord("");
        }
        return;
      }

      if(e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        if (value.length >= DEFAULT_CHARS) return;

        if (!gameStartTime.current) {
          gameStartTime.current = Date.now();
          setIsTestStarted(true);
        }

        const newValue = value + e.key;

        setParagraph((prev) => {
          const newParagraph = [...prev];
          newParagraph[idx] = {
            word: newValue.trim(),
            timeStamp: Date.now(),
            wpm: paragraph[idx]?.wpm || 0,
          };
          return newParagraph;
        });

        charWithTimestampRef.current[charPositionRef.current] = {
          event_type: "letter",
          char: e.key,
          time: (Date.now() - gameStartTime.current!),
        };
        charPositionRef.current++;

        if (idx === 0 && gameStartTime.current === null) {
          gameStartTime.current = Date.now();
        }
        setWord(newValue);
      }
    },
    [idx, paragraph.length, wordsArray, word]
  );

  const reset = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setWord("");
    setIdx(0);
    setParagraph([]);
    setIsTestStarted(false);
    // setIsFocused(false);
    charPositionRef.current = 0;
    charWithTimestampRef.current = [];
    setWpm(0);
    gameStartTime.current = null; 
    setTimeLeft(settings.time);
    setIsCompleted(false);
    setText(generateWords());
    boolCorrect.current = [];
    const newWords = generateWords();
    setWordsArray(newWords.split(" "));
    setOpacity(0);
  }, [settings.time]);

  const calculateAccuracy = useCallback(() => {
    const totalCharsTillNow = paragraph.reduce(
      (acc, curr) => acc + curr.word.length,
      0
    );

    const correctCharsTillNow = paragraph.reduce((acc, curr, index) => {
      let correct = 0;
      const originalWord = wordsArray[index] || "";

      for (let i = 0; i < curr.word.length; i++) {
        if (originalWord[i] === curr.word[i]) {
          correct++;
        }
      }

      return acc + correct;
    }, 0);

    if (totalCharsTillNow > 0) {
      setAccuracy(Math.round((correctCharsTillNow / totalCharsTillNow) * 100));
    } else {
      setAccuracy(0);
    }
  }, [paragraph, idx]);

  const calculateResult = useCallback(() => {
    const { correct, incorrect, extra } = paragraph.reduce(
      (acc, typedWord, index) => {
        const originalWord = wordsArray[index] || "";

        for (let i = 0; i < typedWord.word.length; i++) {
          if (
            i < originalWord.length &&
            originalWord[i] === typedWord.word[i]
          ) {
            acc.correct++;
          } else {
            acc.incorrect++;
          }
        }
        if (typedWord.word.length > originalWord.length) {
          acc.extra += typedWord.word.length - originalWord.length;
        }

        return acc;
      },
      { correct: 0, incorrect: 0, extra: 0 }
    );

    setResult({
      correct,
      incorrect,
      missed: extra,
    });

    setIsCompleted(true);
  }, [paragraph]);

  useEffect(() => {
    if (!isTestStarted) return;

    if (timeLeft === 0) {
      calculateResult();

      return;
    }

    if (!timerRef.current) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
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

    const correctChars = paragraph.reduce((acc, curr, index) => {
      const originalWord = wordsArray[index] || "";
      return (
        acc +
        curr.word.split("").reduce((charAcc, char, i) => {
          return charAcc + (originalWord[i] === char ? 1 : 0);
        }, 0)
      );
    }, 0);

    const wpmValue = Math.floor(correctChars / 5 / elapsedTimeInMinutes);
    chartDataRef.current.push({
      time: timeLeft,
      wpm: wpmValue,
    });

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
    calculateAccuracy();
  }, [word]);

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
      window.addEventListener("resize", updatePositions);
    }

    return () => {
      window.removeEventListener("resize", updatePositions);
    };
  }, [word, idx, isFocused, updateScrollPosition, updateCaretPosition]);

  useEffect(() => {
    const handleTab = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault();
        reset();
      }
    };
    window.addEventListener("keydown", handleTab);
    return () => {
      window.removeEventListener("keydown", handleTab);
    };
  }, []);

  useEffect(() => {
    if (opacity < 1) {
      const fadeIn = setTimeout(() => {
        setOpacity((prev) => Math.min(prev + 0.1, 1));
      }, 50);
      return () => clearTimeout(fadeIn);
    }
  }, [opacity, wordsArray]);

  return !isCompleted ? (
    <div className="w-full h-full flex items-center justify-center bg-black">
      <div className="flex flex-col items-center justify-center w-[75%]">
        <div className="self-start flex flex-row gap-x-2 justify-between w-full ">
          <span className="font-mono text-neutral-300 text-xl">{wpm} </span>
          <span
            className={cn(
              "font-mono text-neutral-400 text-xl self-end transition-colors duration-200",
              {
                "text-red-400": accuracy <= 50 && accuracy > 0,
              }
            )}
          >
            {accuracy} %
          </span>
          <span
            className={cn(
              "font-mono text-neutral-700 text-xl self-end transition-colors duration-200",
              {
                "text-red-600": timeLeft <= 5,
              }
            )}
          >
            {timeLeft}s
          </span>
        </div>
        <div
          ref={containerRef}
          className="w-full text-neutral-300 relative"
          tabIndex={0}
          onFocus={() => {
            setIsFocused(true);
          }}
          onBlur={() => setIsFocused(false)}
        >
          <motion.div
            key={wordsArray.join(" ")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            ref={scrollRef}
            className="w-full max-h-[9rem] overflow-y-hidden overflow-x-hidden relative"
          >
            <div className="font-mono text-3xl tracking-wide leading-[3rem]">
              {wordsArray.map((word, wordIndex) => {
                const typedWord = paragraph[wordIndex]?.word || "";
                const isUnderlined =
                  typedWord.length > word.length ||
                  (!boolCorrect.current[wordIndex] && idx > wordIndex);

                return (
                  <Word
                    key={wordIndex}
                    word={word}
                    typedWord={typedWord}
                    isUnderlined={isUnderlined}
                    wordRef={(el) => {
                      if (el) {
                        wordRefs.current[wordIndex] = el;
                      }
                    }}
                  />
                );
              })}
            </div>
          </motion.div>
          {isFocused && (
            <motion.div
              layoutId="caret"
              className="bg-sky-300/80 h-10 w-[3px] absolute"
              style={{
                top: caretPosition.y,
                left: caretPosition.x,
              }}
              transition={{
                type: "tween",
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
            readOnly
            disabled={!isFocused}
            onKeyDown={handleKeyDown}
          />
          {!isFocused && !isTestStarted && (
            <div className="absolute inset-0 bg-transparent backdrop-blur-sm transition-opacity duration-300 flex items-center justify-center text-white text-2xl font-mono">
              Click here to start
            </div>
          )}
        </div>
      </div>
    </div>
  ) : (
    <Result
      result={result!}
      accuracy={accuracy}
      wpm={wpm}
      wordsReview={paragraph}
      actualWords={wordsArray}
      wordsWithTimestamp={chartDataRef.current}
      reset={reset}
      replayData={charWithTimestampRef.current}
      boolCorrect={boolCorrect}
    />
  );
}

export const Word = memo(
  ({
    word,
    typedWord,
    isUnderlined,
    wordRef,
  }: {
    word: string;
    typedWord: string;
    isUnderlined: boolean;
    wordRef: (el: HTMLDivElement | null) => void;
  }) => {
    const extraChars =
      typedWord.length > word.length
        ? typedWord.slice(word.length).split("")
        : [];

    return (
      <div
        className={cn("inline-block mr-6 ", {
          "underline underline-offset-4": isUnderlined,
        })}
        ref={wordRef}
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
  }
);
