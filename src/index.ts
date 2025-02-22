import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { LLMChain } from "langchain/chains";
import { StringOutputParser } from "@langchain/core/output_parsers";
import config from "config";
import { RunnableSequence } from "@langchain/core/runnables";

const openAILLM = new ChatOpenAI({
  openAIApiKey: config.get("open_ai_api_key"),
  model: "gpt-4o-mini",
});

const googleLLM = new ChatGoogleGenerativeAI({
  apiKey: config.get("google_ai_api_key"),
  model: "gemini-2.0-flash",
});

const stringParser = new StringOutputParser();

const runLLM = async () => {
  const translatorPrompt = PromptTemplate.fromTemplate(
    `Translate the text to {language} :: {text}`
  );

  // const chain2= new LLMChain({llm: openAILLM, prompt: translatorPrompt});

  // const chain = translatorPrompt.pipe(googleLLM).pipe(stringParser);
  // const chain = RunnableSequence.from([
  //   translatorPrompt,
  //   googleLLM,
  //   stringParser,
  // ]);

  // const chainResult = await chain.invoke({
  //   language: "Chinese",
  //   text: "I love you",
  // });

  // console.log(chainResult);

  // const chainResult = chain.streamLog({
  //   language: "Chinese",
  //   text: "I love you",
  // });

  // const chainResult = chain.streamEvents(
  //   {
  //     language: "Chinese",
  //     text: "I love you",
  //   },
  //   { version: "v2" }
  // );

  // console.log(chainResult);

  // for await (const state of chainResult) {
  //   console.log(state);
  // }

  // const chainResult = await chain.batch([
  //   {
  //     language: "Chinese",
  //     text: "I love you",
  //   },
  //   {
  //     language: "Japanese",
  //     text: "I love you Bangladesh",
  //   },
  // ]);

  // chainResult.forEach((result) => {
  //   console.log(result.content);
  // });

  // LangChain stream

  const newsArticlePrompt = PromptTemplate.fromTemplate(
    `Write a news article about {topic}`
  );

  const chain = await RunnableSequence.from([
    newsArticlePrompt,
    // translatorPrompt,
    googleLLM,
  ]).stream({
    // language: "Chinese",
    // text: "I love you Bangladesh",
    topic: "Bangladesh",
  });

  let text: string = "";
  for await (const chunk of chain) {
    text += chunk.content;
    console.clear();

    console.log(text);
  }
};
runLLM();
