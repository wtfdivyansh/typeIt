"use client";
import { useEffect, useState } from "react";

const paragraph = `this is a simple paragraph that does not have any punctuation it flows continuously without any stops or breaks making it a bit challenging to read but still understandable if you focus on the context words just keep coming together forming a long stream of thoughts without interruption which can sometimes make things interesting or even confusing depending on how you look at it`;
export default function Home() {
  const [currentChar, setCurrentChar] = useState("");
  const [currentWord, setCurrentWord] = useState("");
  const [currentParagraph, setCurrentParagraph] = useState("");
  const [idx, setIdx] = useState(0);
  const wordsArray = paragraph.split(" ");
  const myWordsArray = currentParagraph.split(" ");
  let isWordCorrect = false;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.value == "" && e.target.value.length === 0) {
      return
    }
    if(e.target.value.slice(-1) === " " &&  currentParagraph.slice(-1) === " ") {
      setCurrentWord("");
      setCurrentChar("");
      return
    }
    const lastChar = e.target.value.slice(-1);
    console.log("lastChar", lastChar);
    setCurrentChar(e.target.value.slice(0, 1));
    setCurrentWord((prev) => prev + lastChar);
    if (lastChar === " " && e.target.value.length >0) {
      isWordCorrect = wordCorrect();
      setCurrentWord("");
      setIdx((prev) => prev + 1);
    }
    setCurrentParagraph(e.target.value);
  };
  const wordCorrect = () => {
    if (currentWord === wordsArray[idx]) {
      console.log("corrrect");
      return true;
    }
    console.log(currentWord, wordsArray[idx]);
    console.log("incorrect");
    return false;
  };
  useEffect(() => {
    // console.log("currentChar", currentChar);
    // console.log("currentWord", currentWord);
    console.log("currentParagraph", currentParagraph);
    console.log("idx", idx);
    // console.log("wordsArray", wordsArray);
    // console.log("myWordsArray", myWordsArray);
  }, [currentParagraph,idx]);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Backspace") {
        console.log("Backspace key pressed");
        if (currentChar === "" && currentWord === "" && currentParagraph.length>0) {
          const prevParagraph = currentParagraph.slice(0, -1);
          console.log("prevParagraph", prevParagraph,currentParagraph);
          console.log("sliced", currentParagraph.slice(-1));
          setCurrentWord(currentParagraph.slice(-1));
          setCurrentParagraph((prev) => prev.slice(0, -1));
          setIdx((prev) => prev - 1);
          setCurrentWord(myWordsArray[idx]);
        }
      }
      if (event.key === "Space" || event.key=== " ") {
        // if(currentChar === "" && currentWord === "") {
        //   setCurrentParagraph(currentParagraph.slice(0, -1));
        // }
        console.log("Space key pressed");
      }
    };
    

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  return (
    <div className="w-full h-full  flex flex-col items-center justify-center">
      <div className="w-1/2 text-neutral-500">{paragraph}</div>
      <input
        className="w-1/2"
        value={currentParagraph}
        onChange={handleChange}
      />
    </div>
  );
}
