"use client";

import { M_PLUS_1 } from "next/font/google";
import { useEffect, useRef, useState } from "react";

type ReplayData = {
  event_type: "backspace" | "space" | "letter" | "prev_word";
  char: string;
  time: number;
}[];

export default function WatchReplay({
  replayData,
}: {
  replayData: ReplayData;
}) {
  const [paragraph, setParagraph] = useState<string[]>([]);
 

  useEffect(() => {
    let idx = -1;
    let paraIdx = 0 
    let currMs = 0
    const intervalId = setInterval(() => {
      if (idx >= replayData.length-1) {
        clearInterval(intervalId);
        return;
      }

      if(idx != -1 && replayData[idx].time > currMs) {
        currMs += 50;
        return;
      }

      setParagraph((prev) => {
        const newParagraph = [...prev];
        let lastWord = newParagraph[paraIdx] || "";

        console.log(replayData[idx],"replayData");

        switch (replayData[idx].event_type) {
          case "backspace":
            lastWord = lastWord.slice(0, -1);
            newParagraph[paraIdx] = lastWord;
            break;
          case "space":
            newParagraph.push("");
            paraIdx++;
            break;
          case "prev_word":
            newParagraph.pop();
            paraIdx--;
            break;
          case "letter":
            console.log("beofre", lastWord);
            lastWord += replayData[idx].char;
            console.log("after", lastWord);
            newParagraph[paraIdx] = lastWord;
            break;
        }

        return newParagraph;
      });
      idx++;
      currMs += 50
    }, 50);

    return () => clearInterval(intervalId);
  }, [replayData]);

  useEffect(() => {
    console.log(paragraph);
  }, [paragraph]);

  return (
    <div>
      <h1 className="text-red-500 ">{paragraph.join(" ")}</h1>
    </div>
  );
}
