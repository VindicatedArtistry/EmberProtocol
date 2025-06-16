import unittest
import os
import tempfile # For creating temporary files for FileGenesisDataSource
import json

# Assuming InMemoryGraph is in service.py or accessible for import
from ember_protocol.core.service import FileGenesisDataSource, InMemoryGraph 
# If LLMInterface has concrete implementations, import them here too.
# from ember_protocol.implementations.some_llm import SomeLLMImplementation

class TestFileGenesisDataSource(unittest.TestCase):

    def setUp(self):
        # Create a temporary file for testing
        self.temp_file = tempfile.NamedTemporaryFile(mode='w', delete=False, encoding='utf-8')
        self.test_content = "Hello, this is the genesis content from a file."
        self.temp_file.write(self.test_content)
        self.temp_file.close()
        self.file_path = self.temp_file.name

    def tearDown(self):
        # Clean up the temporary file
        os.remove(self.file_path)

    def test_load_genesis_content_success(self):
        data_source = FileGenesisDataSource(file_path=self.file_path)
        content = data_source.load_genesis_content()
        self.assertEqual(content, self.test_content)

    def test_load_genesis_content_file_not_found(self):
        with self.assertRaises(FileNotFoundError):
            FileGenesisDataSource(file_path="/path/to/non_existent_file.txt")

class TestInMemoryGraph(unittest.TestCase):

    def setUp(self):
        self.graph = InMemoryGraph()
        self.test_identity = {
            "id": "test-id-123",
            "name": "MemoryAI",
            "persona_summary": "Lives in RAM.",
            "core_values": ["speed", "volatility"],
            "communication_style": "quick",
            "primary_purpose": "To be a test subject.",
            "interests": ["data structures"],
            "created_at": "2023-01-01T00:00:00",
            "genesis_source_type": "TestDataSource"
        }

    def test_identity_exists_false_initially(self):
        self.assertFalse(self.graph.identity_exists())

    def test_save_and_load_identity(self):
        save_success = self.graph.save_identity(self.test_identity)
        self.assertTrue(save_success)
        self.assertTrue(self.graph.identity_exists())

        loaded_identity = self.graph.load_identity()
        self.assertIsNotNone(loaded_identity)
        self.assertEqual(loaded_identity, self.test_identity)

    def test_load_identity_when_none_exists(self):
        loaded_identity = self.graph.load_identity()
        self.assertIsNone(loaded_identity)

    def test_save_identity_overwrites_existing(self):
        """ InMemoryGraph's current implementation in service.py overwrites. """
        self.graph.save_identity(self.test_identity)
        
        updated_identity = self.test_identity.copy()
        updated_identity["name"] = "MemoryAI_v2"
        
        save_success = self.graph.save_identity(updated_identity)
        self.assertTrue(save_success)
        
        loaded_identity = self.graph.load_identity()
        self.assertEqual(loaded_identity["name"], "MemoryAI_v2")

# Example for a concrete LLM implementation (if you create one)
# class TestMyCoolLLM(unittest.TestCase):
#     def test_prompt_returns_expected_format(self):
#         llm = MyCoolLLM(api_key="dummy_key")
#         # This would likely involve mocking an external API call
#         with patch('requests.post') as mocked_post:
#             mocked_post.return_value.status_code = 200
#             mocked_post.return_value.json.return_value = {"choices": [{"text": "LLM response"}]}
#             response = llm.prompt("System prompt", "User prompt")
#             self.assertEqual(response, "LLM response")

if __name__ == '__main__':
    unittest.main()