const CommonWords = {
  smallWords: [
    "cat",
    "dog",
    "is",
    "run",
    "pen",
    "box",
    "hat",
    "car",
    "red",
    "yes",
    "no",
    "fun",
    "big",
    "hot",
    "cold",
    "fast",
    "slow",
    "jump",
    "play",
    "am",
    "are",
    "tree",
    "moon",
    "star",
    "rain",
    "hill",
    "road",
    "bird",
    "wind",
    "fire",
  ],

  mediumWords: [
    "apple",
    "chair",
    "happy",
    "ocean",
    "forest",
    "breeze",
    "silver",
    "garden",
    "castle",
    "valley",
    "bright",
    "shadow",
    "morning",
    "evening",
    "holiday",
    "whisper",
    "rainbow",
    "sunrise",
    "fortune",
    "picture",
    "butter",
    "thunder",
    "lantern",
    "pattern",
    "shelter",
    "pumpkin",
    "curtain",
    "balloon",
    "crystal",
  ],

  bigWords: [
    "adventure",
    "wonderful",
    "chocolate",
    "strawberry",
    "motivation",
    "happiness",
    "determined",
    "celebration",
    "generation",
    "perseverance",
    "opportunity",
    "enthusiasm",
    "communication",
    "transformation",
    "appreciation",
    "achievement",
    "spectacular",
    "extraordinary",
    "understand",
    "reflection",
    "experience",
    "confidence",
    "perspective",
    "fascinating",
    "invitation",
    "compassion",
    "imagination",
    "inspiration",
    "enlightenment",
    "refreshingly",
  ],
};

export const generateWords = (count: number = 60) => {
  const words: string[] = [];
  let ttlBig = 4;

  for (let i = 0; i < count; i++) {
    if (ttlBig < 0) {
      ttlBig = 4;
    }
    const categories = Object.keys(CommonWords) as (keyof typeof CommonWords)[];

    let randomCategory =
      categories[Math.floor(Math.random() * categories.length)];
    if (ttlBig > 0 && randomCategory === "bigWords") {
      randomCategory = categories[Math.floor(Math.random() * 2)];
      console.log(randomCategory)
      ttlBig--;
    }

    const currentCategory = CommonWords[randomCategory];
    const randomIndex = Math.floor(Math.random() * currentCategory.length);

    words.push(currentCategory[randomIndex]);
  }
   console.log(words.join(" "));
   return words.join(" ");
};

generateWords();
