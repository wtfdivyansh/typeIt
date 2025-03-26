export interface testResultDB  { 
 id:string;
 originalWords :string[];
 typedWords:string[];
 mode:string
 accuracy:number;
 wpm:number;
 rawWpm:number;
 date:Date
}