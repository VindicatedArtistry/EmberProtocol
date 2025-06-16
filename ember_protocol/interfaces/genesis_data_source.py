from abc import ABC, abstractmethod

class GenesisDataSource(ABC):
    """
    Abstract interface for providing the foundational "genesis source" or "soul seed" data.

    This class defines the contract for any data source that wants to provide
    the initial context for an AI's identity. Developers can create their own
    concrete implementations to load data from a file, a database, a web API,
    or any other source.
    """

    @abstractmethod
    def load_genesis_content(self) -> str:
        """
        Loads and returns the full text content of the genesis source.
        
        This method must be implemented by any concrete subclass.

        Returns:
            A string containing the entire genesis text.
        """
        pass
