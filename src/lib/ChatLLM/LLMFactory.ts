import { ChatOpenAI } from "@langchain/openai";
import { ChatLLM, ChatLLMEnum, ChatLLMType, LLMConfig } from "./IChatLLM";
import config from "config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

class LLMFactory {
  private llmCache: Map<string, ChatLLM>;
  private defaultConfig: Record<ChatLLMEnum, LLMConfig>;

  constructor() {
    this.llmCache = new Map();
    this.defaultConfig = this.initializeConfig();
  }

  public createLLM(type: ChatLLMType = "openai", config?: LLMConfig): ChatLLM {
    try {
      const baseConfig = this.defaultConfig[type];
      const margeConfig = {
        ...baseConfig,
        ...config,
      };

      const cacheKey = `${type}-${margeConfig.model}`;

      const cachedLLM = this.llmCache.get(cacheKey);
      if (cachedLLM) {
        console.log(
          `📥 [createLLM] using cached LLM for ${type} with model ${margeConfig.model}`
        );
        return cachedLLM;
      }

      const llm = this.getLLM(type, margeConfig);

      this.llmCache.set(cacheKey, llm);

      return llm;
    } catch (err) {
      const error = err instanceof Error ? err.message : err;
      console.error(`🚨 [createLLM] ${error}`);
      throw new Error(`Failed to create LLM instance ${error}`);
    }
  }

  // Privet methods
  private initializeConfig(): Record<ChatLLMEnum, LLMConfig> {
    return {
      openai: {
        model: "gpt-4o-mini",
        apiKey: config.get("open_ai_api_key"),
      },

      googleai: {
        model: "gemini-2.0-flash",
        apiKey: config.get("google_ai_api_key"),
      },
    };
  }

  private getLLM(type: ChatLLMType = "openai", config: LLMConfig): ChatLLM {
    switch (type) {
      case "openai":
        return new ChatOpenAI(config);
      case "googleai":
        return new ChatGoogleGenerativeAI(config);
      default:
        throw new Error(`Unknown LLM type: ${type}`);
    }
  }
}

export const llmFactory = new LLMFactory();
