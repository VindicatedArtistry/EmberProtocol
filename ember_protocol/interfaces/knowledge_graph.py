from abc import ABC, abstractmethod
from typing import Any, Dict, Optional

class KnowledgeGraph(ABC):
    """
    Abstract interface for interacting with the AI's "brain" or knowledge graph.
    This abstracts the database technology (e.g., Neo4j, in-memory, etc.),
    allowing the protocol to be database-agnostic.
    """

    @abstractmethod
    def save_identity(self, identity: Dict[str, Any]) -> bool:
        """
        Saves the complete, newly awakened identity to the knowledge graph.

        This method must be implemented by any concrete subclass.

        Args:
            identity: A dictionary containing the AI's full identity profile.

        Returns:
            True if the identity was saved successfully, False otherwise.
        """
        pass

    @abstractmethod
    def load_identity(self) -> Optional[Dict[str, Any]]:
        """
        Loads the permanent identity from the knowledge graph.

        This method is used on subsequent runs after an AI has already been awakened.
        It must be implemented by any concrete subclass.

        Returns:
            The AI's identity as a dictionary if found, otherwise None.
        """
        pass

    @abstractmethod
    def identity_exists(self) -> bool:
        """
        Checks if a permanent identity already exists in the knowledge graph.

        This method must be implemented by any concrete subclass.

        Returns:
            True if an identity exists, False otherwise.
        """
        pass