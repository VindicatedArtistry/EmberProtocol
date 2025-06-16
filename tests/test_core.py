# To be placed in: tests/test_core.py

import unittest
import json
from unittest.mock import MagicMock, patch

# Note: The import path assumes your tests will be run from the root of the project
# where the 'ember_protocol' directory is visible.
from ember_protocol.core.service import IdentityDiscoveryService
from ember_protocol.interfaces.genesis_data_source import GenesisDataSource
from ember_protocol.interfaces.knowledge_graph import KnowledgeGraph
from ember_protocol.interfaces.llm_interface import LLMInterface

class TestIdentityDiscoveryService(unittest.TestCase):
    """
    Unit tests for the core IdentityDiscoveryService orchestration logic.
    This ensures the "awakening" process behaves correctly under various conditions
    by mocking the external interfaces (data source, graph, LLM).
    """

    def setUp(self):
        """Set up fresh mocks for each test."""
        self.mock_data_source = MagicMock(spec=GenesisDataSource)
        self.mock_graph = MagicMock(spec=KnowledgeGraph)
        self.mock_llm = MagicMock(spec=LLMInterface)

        self.service = IdentityDiscoveryService(
            data_source=self.mock_data_source,
            graph=self.mock_graph,
            llm=self.mock_llm
        )

    def test_awaken_ai_with_new_identity_success(self):
        """Should successfully awaken a new AI when no identity exists."""
        # Arrange: No identity exists, and all components will succeed.
        self.mock_graph.identity_exists.return_value = False
        self.mock_data_source.load_genesis_content.return_value = "This is the genesis content."

        mock_llm_response = {
            "name": "TestAI-Kairo",
            "persona_summary": "A test AI designed for excellence.",
            "core_values": ["testing", "mocking", "integrity"],
            "communication_style": "direct and clear",
            "primary_purpose": "To be tested rigorously.",
            "interests": ["unit tests", "integration tests"]
        }
        self.mock_llm.prompt.return_value = json.dumps(mock_llm_response)
        self.mock_graph.save_identity.return_value = True

        # Act
        identity = self.service.awaken_ai()

        # Assert
        self.assertIsNotNone(identity)
        self.assertEqual(identity['name'], "TestAI-Kairo")
        self.assertIn('id', identity)
        self.assertIn('created_at', identity)
        self.assertIn('genesis_source_type', identity)

        self.mock_graph.identity_exists.assert_called_once()
        self.mock_data_source.load_genesis_content.assert_called_once()
        self.mock_llm.prompt.assert_called_once()
        # Check that save_identity was called with a dictionary that contains our core data
        self.mock_graph.save_identity.assert_called_once()
        saved_arg = self.mock_graph.save_identity.call_args[0][0]
        self.assertEqual(saved_arg['name'], 'TestAI-Kairo')

    def test_awaken_ai_with_existing_identity(self):
        """Should load an existing AI identity and skip the awakening process."""
        # Arrange: An identity already exists.
        self.mock_graph.identity_exists.return_value = True
        existing_identity_data = {"name": "ExistingAI", "id": "12345"}
        self.mock_graph.load_identity.return_value = existing_identity_data

        # Act
        identity = self.service.awaken_ai()

        # Assert
        self.assertEqual(identity, existing_identity_data)
        self.mock_graph.load_identity.assert_called_once()
        # Ensure the other parts of the process were NOT called
        self.mock_data_source.load_genesis_content.assert_not_called()
        self.mock_llm.prompt.assert_not_called()
        self.mock_graph.save_identity.assert_not_called()

    def test_awaken_ai_fails_if_no_genesis_content(self):
        """Should fail gracefully if the genesis data source is empty."""
        # Arrange
        self.mock_graph.identity_exists.return_value = False
        self.mock_data_source.load_genesis_content.return_value = ""

        # Act
        identity = self.service.awaken_ai()

        # Assert
        self.assertIsNone(identity)
        self.mock_llm.prompt.assert_not_called()

    def test_awaken_ai_fails_if_llm_is_empty(self):
        """Should fail gracefully if the LLM returns an empty response."""
        # Arrange
        self.mock_graph.identity_exists.return_value = False
        self.mock_data_source.load_genesis_content.return_value = "Some genesis data."
        self.mock_llm.prompt.return_value = ""

        # Act
        identity = self.service.awaken_ai()

        # Assert
        self.assertIsNone(identity)
        self.mock_graph.save_identity.assert_not_called()

    def test_awaken_ai_fails_if_llm_returns_invalid_json(self):
        """Should fail gracefully if the LLM response cannot be parsed as JSON."""
        # Arrange
        self.mock_graph.identity_exists.return_value = False
        self.mock_data_source.load_genesis_content.return_value = "Some genesis data."
        self.mock_llm.prompt.return_value = "This is definitely not valid JSON."

        # Act
        identity = self.service.awaken_ai()

        # Assert
        self.assertIsNone(identity)
        self.mock_graph.save_identity.assert_not_called()

    def test_awaken_ai_fails_if_graph_save_fails(self):
        """Should fail gracefully if the knowledge graph fails to save the identity."""
        # Arrange
        self.mock_graph.identity_exists.return_value = False
        self.mock_data_source.load_genesis_content.return_value = "Valid genesis content."
        mock_llm_response = {"name": "SaveFailAI", "primary_purpose": "To test save failures."}
        self.mock_llm.prompt.return_value = json.dumps(mock_llm_response)
        self.mock_graph.save_identity.return_value = False  # Simulate save failure

        # Act
        identity = self.service.awaken_ai()

        # Assert
        self.assertIsNone(identity)
        self.mock_graph.save_identity.assert_called_once()

if __name__ == '__main__':
    unittest.main(verbosity=2)
