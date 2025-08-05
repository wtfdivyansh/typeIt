"use client";
import { cn } from "@/lib/utils";
import { clear } from "console";
import { Pause, Play, RefreshCcw } from "lucide-react";
import { memo, RefObject, useEffect, useRef, useState } from "react";
import { set } from "react-hook-form";

type ReplayData = {
  event_type: "backspace" | "space" | "letter" | "prev_word";
  char: string;
  time: number;
}[];

export default function WatchReplay({
  replayData,
  text,
  boolCorrect,
  wordsWithTimestamp,
}: {
  text: string[];
  wordsWithTimestamp: {
    time: number;
    wpm: number;
  }[];
  boolCorrect: RefObject<Boolean[]>;
  replayData: ReplayData;
}) {
  const [paragraph, setParagraph] = useState<string[]>([]);
  const [watching, setWatching] = useState(false);
  const [index, setIndex] = useState(0);
  const [wpm, setWpm] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const prevState = useRef({
    idx: -1,
    paraIdx: 0,
    currMs: 0,
  });
  function reset() {
    setParagraph([]);
    setIndex(0);
    setWpm(0);
    setWatching(false);
    clearInterval(timerRef.current!);
    prevState.current = {
      idx: -1,
      paraIdx: 0,
      currMs: 0,
    };
  }
  useEffect(() => {
    if (!watching) {
      if (timerRef.current) {
       clearInterval(timerRef.current);
       timerRef.current = null;
      }
      return;
    }

    let idx = prevState.current.idx;
    let paraIdx = prevState.current.paraIdx;
    let currMs = prevState.current.currMs;
    console.log(paraIdx, text.length - 1);
    console.log("ehere");
    if (paraIdx >= text.length - 1) {
      console.log("inside end");
      setParagraph([]);
      setIndex(0);
      setWpm(0);
      setWatching(false);
      prevState.current = {
        idx: -1,
        paraIdx: 0,
        currMs: 0,
      };
      return;
    }
    if (!timerRef.current) {
      timerRef.current = setInterval(() => {
        console.log(replayData.length, idx);
        console.log("space", paraIdx, text.length);

        if (paraIdx >= text.length - 1 && idx >= replayData.length - 1) {
          console.log("end complete ");
          setWatching(false);
          return;
        }

        if (idx != -1 && replayData[idx].time > currMs) {
          console.log("end");
          currMs += 50;
          return;
        }
        let elapsedIndex =
          currMs / 1000 < 1 ? 0 : Math.floor(currMs / 1000) - 1;

        if (
          elapsedIndex > 1 &&
          wordsWithTimestamp[elapsedIndex].time * 1000 <= currMs
        ) {
          setWpm(wordsWithTimestamp[elapsedIndex].wpm);
        }

        setParagraph((prev) => {
          const newParagraph = [...prev];
          let lastWord = newParagraph[paraIdx] || "";
          switch (replayData[idx].event_type) {
            case "backspace":
              lastWord = lastWord.slice(0, -1);
              newParagraph[paraIdx] = lastWord;
              break;
            case "space":
              newParagraph.push("");
              setIndex((prev) => prev + 1);
              paraIdx++;
              break;
            case "prev_word":
              newParagraph.pop();
              setIndex((prev) => prev - 1);
              paraIdx--;
              break;
            case "letter":
              lastWord += replayData[idx].char;

              newParagraph[paraIdx] = lastWord;
              break;
          }

          return newParagraph;
        });
        console.log("at end", paraIdx, text.length - 1);
        idx++;
        currMs += 50;
        prevState.current = {
          idx,
          paraIdx,
          currMs,
        };
      }, 50);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [watching]);
  useEffect(() => {
    console.log(replayData);
  }, []);
  return (
    <div>
      <div className="flex justify-start items-start gap-2 ">
        <div className="flex items-center gap-2">
          <span className="text-neutral-600 font-semibold font-mono">
            {wpm} WPM
          </span>
        </div>
        <button
          className={cn(
            "bg-transparent text-neutral-600  font-bold  rounded-full cursor-pointer transition-colors duration-200 hover:text-neutral-400",
            {
              watching: "text-neutral-300",
            }
          )}
          onClick={() => setWatching((prev) => !prev)}
        >
          {watching ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6" />
          )}
        </button>
        <button className="bg-transparent text-neutral-600  font-bold  rounded-full cursor-pointer transition-colors duration-200 hover:text-neutral-400">
          <RefreshCcw className="w-6 h-6" onClick={reset} />
        </button>
      </div>
      <div className="">
        {text.map((word, wordIndex) => {
          const typedWord = paragraph[wordIndex] || "";
          const isUnderlined =
            typedWord.length > word.length ||
            (!boolCorrect.current[wordIndex] && index > wordIndex);

          return (
            <Word
              key={wordIndex}
              word={word}
              typedWord={typedWord}
              isUnderlined={isUnderlined}
            />
          );
        })}
      </div>
    </div>
  );
}

export const Word = memo(
  ({
    word,
    typedWord,
    isUnderlined,
  }: {
    word: string;
    typedWord: string;
    isUnderlined: boolean;
  }) => {
    const extraChars =
      typedWord.length > word.length
        ? typedWord.slice(word.length).split("")
        : [];

    return (
      <div
        className={cn("inline-block mr-4 transition-all  duration-200", {
          "underline underline-offset-4": isUnderlined,
        })}
      >
        {word.split("").map((letter, letterIndex) => {
          const actualLetter = word[letterIndex];
          const typedLetter = typedWord[letterIndex] || " ";

          return (
            <span
              key={letterIndex}
              className={cn(
                "text-neutral-600 font-mono transition-colors duration-200",
                {
                  "text-neutral-100": actualLetter === typedLetter,
                  "text-red-400":
                    actualLetter !== typedLetter && typedLetter !== " ",
                }
              )}
            >
              {letter}
            </span>
          );
        })}

        {extraChars.map((letter, extraIndex) => (
          <span
            key={extraIndex}
            className="text-orange-700 font-mono transition-all duration-100"
          >
            {letter}
          </span>
        ))}
      </div>
    );
  }
);
