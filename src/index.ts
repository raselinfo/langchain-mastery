import { PromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import config from "config";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { llmFactory } from "./lib/ChatLLM/LLMFactory";
import { title } from "process";

// BlogAI
// - TitleAI : only create SEO friendly title
// - ArticleAI: create article

/**
 * - TitlePrompt -> TitleAI -> StringOutputParser -> Title
 * - ArticlePrompt -> ArticleAI -> StringOutputParser -> Article
 */

const titlePrompt = PromptTemplate.fromTemplate(
  `Generate a creative and SEO friendly title for a article about {topic}`
);

const articlePrompt = PromptTemplate.fromTemplate(
  `Write a detailed article based on the title {title}`
);

const titleAI = llmFactory.createLLM("openai", {
  temperature: 0.5,
});
const articleAI = llmFactory.createLLM("googleai");

const stringParser = new StringOutputParser();

const runLLM = async () => {
  // const chain = titlePrompt
  //   .pipe(titleAI)
  //   // .pipe((title) => articlePrompt.format({ title }))
  //   .pipe(stringParser)
  //   .pipe(articleAI);
  const chain = RunnableSequence.from([
    titlePrompt,
    titleAI,
    stringParser, // string
    (title) => articlePrompt.format({ title }),
    articleAI,
    // {
    //   title: (output) => articlePrompt.format({ title: output }),
    //   article: async (prompt) => {
    //     const article = await articleAI.invoke(prompt);
    //     return article.content;
    //   },
    // },
  ]);

  // console.log(await chain.invoke({ topic: "LangChain" }));

  const aiResult = await chain.stream({ topic: "LangChain" });

  let content = "";
  for await (const chunk of aiResult) {
    content += chunk.content;
    console.clear();
    console.log(content);
  }
};

runLLM();
