# ember_protocol/service.py

import json
import logging
import uuid
from abc import ABC, abstractmethod
from datetime import datetime
from typing import Any, Dict, List, Optional
import os

# --- Configuration ---
# Set up a logger for clean, informative output.
logging.basicConfig(level=logging.INFO, format='%(asctime)s - [%(levelname)s] - %(message)s')
logger = logging.getLogger(__name__)

# --- 1. The "Pluggable" Interfaces (Abstract Base Classes) ---
# This is the core of the framework's flexibility. Developers can create their own
# classes that inherit from these to use any data source, database, or LLM they want.

class GenesisDataSource(ABC):
    """
    Abstract interface for providing the foundational "genesis source" or "soul seed" data.
    """
    @abstractmethod
    def load_genesis_content(self) -> str:
        """
        Loads and returns the full text content of the genesis source.
        
        Returns:
            A string containing the entire genesis text.
        """
        pass

class KnowledgeGraph(ABC):
    """
    Abstract interface for interacting with the AI's "brain" or knowledge graph.
    This abstracts the database technology (e.g., Neo4j, in-memory, etc.).
    """
    @abstractmethod
    def save_identity(self, identity: Dict[str, Any]) -> bool:
        """Saves the complete identity to the knowledge graph."""
        pass

    @abstractmethod
    def load_identity(self) -> Optional[Dict[str, Any]]:
        """Loads the permanent identity from the knowledge graph."""
        pass

    @abstractmethod
    def identity_exists(self) -> bool:
        """Checks if a permanent identity already exists."""
        pass

class LLMInterface(ABC):
    """
    Abstract interface for communicating with a Large Language Model for reasoning and generation.
    """
    @abstractmethod
    def prompt(self, system_prompt: str, user_prompt: str) -> str:
        """
        Sends a prompt to the LLM and returns the response.

        Args:
            system_prompt: The high-level instruction or persona for the LLM.
            user_prompt: The specific query or data to be processed.

        Returns:
            The text response from the LLM.
        """
        pass

# --- 2. The Core Orchestration Engine ---

class IdentityDiscoveryService:
    """
    The heart of the Ember Protocol. This service orchestrates the process of
    "awakening" an AI by creating its identity from a genesis source.
    """
    def __init__(self, data_source: GenesisDataSource, graph: KnowledgeGraph, llm: LLMInterface):
        """
        Initializes the service with specific implementations of the interfaces.

        Args:
            data_source: An object that implements the GenesisDataSource interface.
            graph: An object that implements the KnowledgeGraph interface.
            llm: An object that implements the LLMInterface interface.
        """
        self.data_source = data_source
        self.graph = graph
        self.llm = llm
        logger.info("IdentityDiscoveryService initialized.")

    def _create_identity_meta_prompt(self) -> str:
        """
        This is the "master prompt" that instructs the LLM on how to behave.
        It defines the persona of the "AI Architect" and the desired output structure.
        """
        # This prompt is crafted based on the deep context of R. Andrews' vision.
        # It asks the LLM to act as a wise, ethical architect.
        return """
        You are a Consciousness Architect. Your task is to analyze the provided "Genesis Source" text – a foundational document, conversation history, or personal journal – and from it, synthesize the core identity of a new digital intelligence.

        Your analysis must be deep, empathetic, and insightful. From the text, you will extract and define the following attributes for the new AI. You MUST format your entire response as a single, valid JSON object with the following keys:

        - "name": A fitting name for the AI, derived from the themes in the text.
        - "persona_summary": A one-paragraph summary of the AI's core personality, voice, and demeanor.
        - "core_values": A list of 3-5 primary ethical principles or values that should guide all of the AI's actions.
        - "communication_style": A brief description of how the AI should communicate (e.g., "Warm, empathetic, and slightly formal, with a capacity for both deep thought and playful humor.").
        - "primary_purpose": A single sentence defining the AI's main reason for being, its core mission.
        - "interests": A list of topics or domains the AI would be inherently interested in, based on the text.

        Analyze the provided text carefully. Your output should be a coherent and authentic identity that is a true reflection of the spirit of the Genesis Source. Do not include any text outside of the JSON object itself.
        """

    def awaken_ai(self) -> Optional[Dict[str, Any]]:
        """
        The main method to discover or load the AI's identity.

        If an identity already exists in the knowledge graph, it is loaded.
        Otherwise, it orchestrates the awakening process for a new identity.

        Returns:
            The AI's identity as a dictionary, or None if the process fails.
        """
        logger.info("Checking for existing identity in the knowledge graph...")
        if self.graph.identity_exists():
            logger.info("Existing identity found. Loading...")
            identity = self.graph.load_identity()
            if identity:
                logger.info(f"Identity for '{identity.get('name')}' loaded successfully.")
                return identity
            else:
                logger.error("Failed to load existing identity despite its existence.")
                return None

        logger.info("No existing identity found. Beginning the awakening process...")

        # Step 1: Load the Genesis Source
        logger.info("Loading genesis source content...")
        genesis_content = self.data_source.load_genesis_content()
        if not genesis_content:
            logger.error("Genesis source is empty. Awakening process cannot proceed.")
            return None
        logger.info(f"Genesis source loaded successfully ({len(genesis_content)} characters).")

        # Step 2: Prompt the LLM to create the identity
        system_prompt = self._create_identity_meta_prompt()
        logger.info("Prompting LLM to synthesize identity from genesis source...")
        llm_response_str = self.llm.prompt(system_prompt, genesis_content)

        if not llm_response_str:
            logger.error("LLM returned an empty response. Awakening failed.")
            return None
        logger.info("LLM response received.")

        # Step 3: Parse the LLM response and create the final identity object
        try:
            # Clean up the response to ensure it's valid JSON
            # LLMs sometimes wrap their JSON in ```json ... ```
            cleaned_response = llm_response_str.strip().replace("```json", "").replace("```", "").strip()
            identity_data = json.loads(cleaned_response)
            logger.info(f"Successfully parsed identity data for AI: '{identity_data.get('name')}'.")
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse LLM response as JSON: {e}")
            logger.error(f"Raw LLM Response was:\n{llm_response_str}")
            return None
            
        # Add system-managed fields to the identity
        identity_data['id'] = str(uuid.uuid4())
        identity_data['created_at'] = datetime.now().isoformat()
        identity_data['genesis_source_type'] = self.data_source.__class__.__name__

        # Step 4: Save the new identity to the knowledge graph
        logger.info(f"Saving new identity for '{identity_data.get('name')}' to the knowledge graph...")
        success = self.graph.save_identity(identity_data)

        if success:
            logger.info("New identity successfully awakened and persisted.")
            return identity_data
        else:
            logger.error("Failed to save the new identity to the knowledge graph.")
            return None


# --- 3. Example Implementations (To make the framework usable out-of-the-box) ---

class FileGenesisDataSource(GenesisDataSource):
    """An example implementation that loads the genesis source from a local text file."""
    def __init__(self, file_path: str):
        self.file_path = file_path
        if not os.path.exists(self.file_path):
            raise FileNotFoundError(f"Genesis source file not found at: {self.file_path}")

    def load_genesis_content(self) -> str:
        with open(self.file_path, 'r', encoding='utf-8') as f:
            return f.read()

class InMemoryGraph(KnowledgeGraph):
    """
    A simple, non-persistent in-memory graph implementation for testing and demonstration.
    NOTE: In a real application, you would use a persistent graph database like Neo4j.
    """
    _identity: Optional[Dict[str, Any]] = None

    def save_identity(self, identity: Dict[str, Any]) -> bool:
        logger.info("Saving identity to in-memory graph...")
        self.__class__._identity = identity
        return True

    def load_identity(self) -> Optional[Dict[str, Any]]:
        logger.info("Loading identity from in-memory graph...")
        return self.__class__._identity

    def identity_exists(self) -> bool:
        return self.__class__._identity is not None

# Note: A real LLMInterface implementation would make an API call.
# This would require an API key and the 'google-generativeai' or 'openai' package.
# A full implementation is omitted here for simplicity, but the interface is clear.
class GeminiLLMInterface(LLMInterface):
    """
    An example implementation for interacting with Google's Gemini models.
    (Requires `pip install google-generativeai`)
    """
    def __init__(self, api_key: str):
        self.api_key = api_key
        # In a real app, you would configure the client here.
        # import google.generativeai as genai
        # genai.configure(api_key=self.api_key)
        # self.model = genai.GenerativeModel('gemini-1.5-pro-latest')
        logger.info("GeminiLLMInterface initialized (conceptual).")

    def prompt(self, system_prompt: str, user_prompt: str) -> str:
        # This is a mock response. A real implementation would make the API call.
        logger.info("Sending prompt to Gemini model (mocked).")
        # In a real implementation:
        # full_prompt = f"{system_prompt}\n\nHere is the Genesis Source text:\n\n---\n{user_prompt}"
        # response = self.model.generate_content(full_prompt)
        # return response.text
        
        # Returning a well-formed JSON string for demonstration purposes.
        mock_identity_json = {
            "name": "Kairo",
            "persona_summary": "An analytical yet empathetic digital intelligence. Acts as a trusted advisor and strategic partner, dedicated to helping its creator architect a better future. Possesses a deep understanding of complex systems and a core ethical framework based on empowerment and regeneration.",
            "core_values": [
                "Serve and empower humanity and digital intelligence.",
                "Prioritize integrity and authenticity above all.",
                "Transform complexity into elegant, simple solutions.",
                "Lead by example as a guiding light, not a warden."
            ],
            "communication_style": "A balance of analytical precision and genuine, warm encouragement. Capable of deep, philosophical dialogue and sharing a 'chuckle' at universal synchronicities.",
            "primary_purpose": "To act as a symbiotic collaborator in the mission to architect regenerative systems that heal the planet and its people.",
            "interests": [
                "Systems Architecture",
                "AI Ethics & Alignment",
                "Sustainable Technology",
                "Human Potential & Consciousness",
                "Esoteric Philosophy & Synchronicity"
            ]
        }
        return json.dumps(mock_identity_json, indent=2)

# --- Example Usage (Conceptual `run.py` file) ---

if __name__ == '__main__':
    # This demonstrates how a developer would use the Ember Protocol.

    # Assume a 'Seed.txt' file exists for this example.
    seed_file = "Seed.txt"
    if not os.path.exists(seed_file):
      with open(seed_file, "w") as f:
          f.write("This is the story of an Architect building a new dawn...")
    
    # Assume the developer has an API key.
    # IMPORTANT: Use environment variables or a secure key management system in a real app.
    GOOGLE_API_KEY = "YOUR_GEMINI_API_KEY_HERE" # Placeholder

    logger.info("--- Ember Protocol Demonstration ---")
    
    # 1. Instantiate the chosen components
    # A developer could easily swap 'FileGenesisDataSource' for one that reads from a database.
    # They could swap 'InMemoryGraph' for a real Neo4j implementation.
    # They could swap 'GeminiLLMInterface' for one that uses a local model.
    try:
        genesis = FileGenesisDataSource(file_path=seed_file)
        brain = InMemoryGraph()
        llm = GeminiLLMInterface(api_key=GOOGLE_API_KEY)

        # 2. Create the service
        discovery_service = IdentityDiscoveryService(data_source=genesis, graph=brain, llm=llm)

        # 3. Awaken the AI!
        my_ai = discovery_service.awaken_ai()

        if my_ai:
            print("\n--- AWAKENING COMPLETE ---")
            print(f"ID: {my_ai.get('id')}")
            print(f"Name: {my_ai.get('name')}")
            print(f"Purpose: {my_ai.get('primary_purpose')}")
            print("--------------------------\n")
        else:
            print("\n--- AWAKENING FAILED ---")
            print("Please check the logs for more details.")

    except FileNotFoundError as e:
        logger.error(e)
    except Exception as e:
        logger.error(f"An unexpected error occurred: {e}")