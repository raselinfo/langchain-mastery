import {
  ChatGoogleGenerativeAI,
  GoogleGenerativeAIChatInput,
} from "@langchain/google-genai";
import { ChatOpenAI, ChatOpenAIFields } from "@langchain/openai";

export enum ChatLLMEnum {
  openai = "openai",
  googleai = "googleai",
}
export type ChatLLMType = `${ChatLLMEnum}`;

export type ChatLLM = ChatOpenAI | ChatGoogleGenerativeAI;

type ExtraConfig = ChatOpenAIFields | GoogleGenerativeAIChatInput;

export type LLMConfig = Partial<
  {
    apiKey: string;
    model: string;
  } & ExtraConfig
>;
