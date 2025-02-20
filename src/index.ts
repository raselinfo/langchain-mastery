import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import config from "config";

const googleLlm = new ChatGoogleGenerativeAI({
  apiKey: config.get("gemini_api_key"),
  model: "gemini-2.0-flash",
});

const openAiLLM = new ChatOpenAI({
  apiKey: config.get("open_ai_api_key"),
  model: "gpt-4o-mini",
});

const main = async () => {
  //   const promptResponse = await prompt.format({ country: "France" });
  //   const prompt = new PromptTemplate({
  //     template: "What is the capital of {country}?",
  //     inputVariables: ["country"],
  //   });

  const prompt = PromptTemplate.fromTemplate(
    "Write a {adjective} poem about {topic}"
  );

  const partialPrompt = await prompt.partial({ adjective: "angry" }); // romantic , sad

  const chain = await partialPrompt
    .pipe(openAiLLM)
    .invoke({ topic: "Girlfriend" });

  console.log(chain.content);
};

main();
