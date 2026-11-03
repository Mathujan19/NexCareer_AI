"""LLM Configuration for NexCareer AI.

Initialises a single ChatOpenAI instance pointed at the local LM Studio
OpenAI-compatible endpoint (http://localhost:1234/v1).
Swap MODEL_NAME in .env to change the loaded model without touching code.
"""

import os
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

load_dotenv()

# ---------------------------------------------------------------------------
# Single shared LLM instance — used by all agent nodes in the LangGraph graph
# ---------------------------------------------------------------------------
llm = ChatOpenAI(
    base_url=os.getenv("OPENAI_BASE_URL", "http://localhost:1234/v1"),
    api_key=os.getenv("OPENAI_API_KEY", "lm-studio"),
    model=os.getenv("MODEL_NAME", "google/gemma-4-e4b"),
    temperature=0.2,  # Low temperature for structured, deterministic gap analysis
)
