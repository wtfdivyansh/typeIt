"use client";
import { cn } from "@/utils/utils";
import { useEffect, useRef, useState } from "react";

const paragraphText = `this is a simple paragraph that does not have any punctuation it flows continuously without any stops or breaks making it a bit challenging to read but still understandable if you focus on the context words just keep coming together forming a long stream of thoughts without interruption which can sometimes make things interesting or even confusing depending on how you look at it`;
const wordsArray = paragraphText.split(" ");

export default function Home() {
  const [word, setWord] = useState("");
  const [idx, setIdx] = useState(0);
  const [paragraph, setParagraph] = useState<string[]>([]);
 const isBackspace = useRef(false)
  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wordRefs = useRef<(HTMLDivElement | null)[]>([]);
  const boolCorrect = useRef<Boolean[]>([]);

  const [caretPosition, setCaretPosition] = useState({ x: 0, y: 0 });

  const updateCaretPosition = () => {
    const currentWordRef = wordRefs.current[idx];

    if (currentWordRef) {
      const letters = currentWordRef.children;
      console.log(letters);
      if (letters.length > 0) {
        const typedWord = paragraph[idx] || "";
        console.log("typed",typedWord)
        const lastIndex = typedWord.length > 0 ? typedWord.length - 1 : -1;
        const lastLetter =
          lastIndex >= 0
            ? (letters[lastIndex] as HTMLElement)
            : (letters[0] as HTMLElement);
        console.log("lastLetter", lastLetter);

        if (lastLetter) {
          console.log("lastIndex", lastIndex);
          const rect = lastLetter.getBoundingClientRect();
          const containerRect = containerRef.current?.getBoundingClientRect();
          if (containerRect) {
            if (lastIndex >= 0) {
              setCaretPosition({
                x: rect.left - containerRect.left + rect.width,
                y: rect.top - containerRect.top,
              });
            } else {
              setCaretPosition({
                x: rect.left - containerRect.left,
                y: rect.top - containerRect.top,
              });
            }
          }
        }
      }
    }
  };

  const handleChange = (value:string) => {
    console.log(value)
    console.log("hey")
    if (value.startsWith(" ")) return;
    console.log(word.length, paragraph.length)
    const isBackspaceToPrev = boolCorrect.current[idx - 1];
    console.log(isBackspace.current,"ISBACKSPACE")
    if (word.length == 0  && paragraph.length> 0 && !isBackspaceToPrev && isBackspace.current) {
      console.log("insite")
    
      if (!isBackspaceToPrev) {

        setIdx((prev) => prev - 1);
        
        setParagraph((prev) => {
          const newParagraph = [...prev];
          const newWord = newParagraph[idx - 1].trim();
          console.log("newWord",newWord)
            setWord(newWord);
          newParagraph.pop();
          console.log("newParagraph",newParagraph)
          return newParagraph;
        });
      
      }
      isBackspace.current = false
      return
    }

    setParagraph((prev) => {
      const newParagraph = [...prev];
      newParagraph[idx] = value.trim();
      return newParagraph;
    });

    if (value.endsWith(" ") && value.trim().length > 0) {
      setIdx((prev) => prev + 1);
      if (value.trim()=== wordsArray[idx]) {
        boolCorrect.current[idx] = true;
      } else {
        boolCorrect.current[idx] = false;
      }
      setWord("");
      console.log("called1")
    } else {
      setWord(value);
      console.log("called2")
    }
  };

  useEffect(() => {
    console.log("called",idx);
    console.log(boolCorrect.current)
    console.log("word",word)
    console.log("paragraph",paragraph)
    updateCaretPosition();

  }, [word, idx, paragraph]);
  useEffect(() => {
    setCaretPosition({ x: 0, y: 0 });
  }, []);
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div ref={containerRef} className="w-1/2 text-neutral-300 relative">
        <div className="w-full relative">
          <div>
            {wordsArray.map((word, wordIndex) => {
              const typedWord = paragraph[wordIndex] || "";
              const extraChars =
                typedWord.length > word.length
                  ? typedWord.slice(word.length).split("")
                  : [];

              return (
                <div
                  key={wordIndex}
                  className="inline-block mr-2"
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
                          "text-green-500": actualLetter === typedLetter,
                          "text-yellow-500":
                            actualLetter !== typedLetter && typedLetter !== " ",
                        })}
                      >
                        {letter}
                      </span>
                    );
                  })}

                  {extraChars.map((letter, extraIndex) => (
                    <span key={extraIndex} className="text-red-500 font-mono">
                      {letter}
                    </span>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
        <span
          className="bg-green-500 h-6 w-[2px] absolute"
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
          onChange={(e)=> {console.log("inside onchange",e.target.value);handleChange(e.target.value)}}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && word =="") {
              isBackspace.current = true
              handleChange(word)
            }
          }}
        />
      </div>
    </div>
  );
}
