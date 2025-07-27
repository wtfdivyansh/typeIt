"use client";

import { useEffect, useState } from "react";

type ReplayData = {
  char: string;
  time: number;
  isBackspace?: boolean;
}[];

export default function WatchReplay({
  replayData,
}: {
  replayData: ReplayData;
}) {
  const [paragraph, setParagraph] = useState<string[]>([]);

  useEffect(() => {
    let idx = 0;
    const intervalId = setInterval(() => {
      if (idx >= replayData.length) {
        clearInterval(intervalId); 
        return;
      }

      setParagraph((prev) => {
        const newParagraph = [...prev];
        let lastWord = newParagraph[newParagraph.length - 1] ?? "";

        if (replayData[idx]?.isBackspace) {
          lastWord = lastWord.slice(0, -1);
          newParagraph[newParagraph.length - 1] = lastWord;
        } else if (replayData[idx].char === " ") {
          newParagraph.push("");
        } else {
          lastWord += replayData[idx].char;
          newParagraph[newParagraph.length - 1] = lastWord;
        }

        return newParagraph;
      });

      idx++;
    }, 200);

    return () => clearInterval(intervalId); 
  }, [replayData]);

  return (
    <div>
      <h1 className="text-red-500">{paragraph.join(" ")}</h1>
    </div>
  );
}
