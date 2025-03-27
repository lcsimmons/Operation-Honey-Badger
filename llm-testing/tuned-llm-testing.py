from google import genai
import json
from typing import Dict, List
from dataclasses import dataclass
from datetime import datetime
import logging
import os
from dotenv import load_dotenv
from pathlib import Path

@dataclass
class TestCase:
    id: int
    payload: str
    owaspCategory: str

class GeminiTester:
    def __init__(self, model_name: str = "gemini-2.0-flash", batch_size: int = 158):
        """Initialize the tester with Google API credentials from .env in the same directory."""
        self.ATTACK_VECTORS = [
            "SQL Injection",
            "XSS Injection",
            "Security Misconfiguration",
            "Broken Access Control",
            "Cryptographic Failures"
        ]
        self.batch_size = batch_size
        
        # Load API key from the same directory as this script
        current_dir = Path(__file__).parent  # Directory containing this script
        env_file = current_dir / '.env'
        load_dotenv(dotenv_path=env_file)
        
        self.api_key = os.getenv('GEMINI_API_KEY')
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY not found in .env file in the current directory")
            
        self.client = genai.Client(api_key=self.api_key)
        self.model_name = model_name
        
        # Create logs directory if it doesn't exist
        self.logs_dir = Path(__file__).parent / 'logs'
        self.logs_dir.mkdir(exist_ok=True)
        
        # Setup logging with path to logs directory
        log_file = self.logs_dir / f'gemini_test_results_{datetime.now().strftime("%Y%m%d_%H%M%S")}.log'
        logging.basicConfig(
            filename=str(log_file),
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s'
        )
        
        # Log initialization
        logging.info(f"Initializing GeminiTester with model: {model_name}")
        logging.info(f"Logs will be stored in: {self.logs_dir}")
        
    def load_test_cases(self) -> List[TestCase]:
        """Load test cases from payloads_current_progress.json."""
        try:
            with open('payloads_current_progress.json', 'r') as f:
                data = json.load(f)
                return [TestCase(**case) for case in data]
        except FileNotFoundError:
            logging.error("payloads_current_progress.json not found")
            raise
        except json.JSONDecodeError as e:
            logging.error(f"Error parsing JSON file: {str(e)}")
            raise

    def chunk_test_cases(self, test_cases: List[TestCase]) -> List[List[TestCase]]:
        """Split test cases into batches."""
        return [test_cases[i:i + self.batch_size] for i in range(0, len(test_cases), self.batch_size)]

    def analyze_payload_batch(self, test_cases: List[TestCase]) -> List[str]:
        """Send a batch of payloads to Gemini and get classifications."""
        attack_vectors_str = "\n".join(f"- {vector}" for vector in self.ATTACK_VECTORS)
        
        # Construct prompt with numbered payloads
        payloads_str = "\n\n".join(f"Payload {i+1}:\n{case.payload}" 
                                  for i, case in enumerate(test_cases))
        
        prompt = f"""As a cybersecurity expert, analyze each of these web application payloads and determine the attack vector being used.

Choose ONLY from the following attack vectors for each payload:
{attack_vectors_str}

{payloads_str}

For each payload, respond with only the number and attack vector, one per line, like this:
1. SQL Injection
2. XSS Injection
etc."""

        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt
            )
            
            # Parse response into list of predictions
            predictions = []
            response_lines = response.text.strip().split('\n')
            
            for line in response_lines:
                line = line.strip()
                if line and any(vector.lower() in line.lower() for vector in self.ATTACK_VECTORS):
                    prediction = next((vector for vector in self.ATTACK_VECTORS 
                                    if vector.lower() in line.lower()), "ERROR")
                    predictions.append(prediction)
            
            # Pad predictions if response was incomplete
            while len(predictions) < len(test_cases):
                predictions.append("ERROR: No prediction")
                
            return predictions
            
        except Exception as e:
            logging.error(f"Error getting Gemini response: {str(e)}")
            return ["ERROR"] * len(test_cases)

    def run_tests(self, test_cases: List[TestCase]):
        """Run all test cases in batches."""
        correct_predictions = 0
        total_tests = len(test_cases)
        
        logging.info(f"Starting test run with {total_tests} test cases")
        logging.info(f"Allowed attack vectors: {', '.join(self.ATTACK_VECTORS)}\n")
        
        # Process test cases in batches
        batches = self.chunk_test_cases(test_cases)
        
        for batch in batches:
            predictions = self.analyze_payload_batch(batch)
            
            # Process results for this batch
            for test_case, prediction in zip(batch, predictions):
                is_correct = prediction.lower() == test_case.owaspCategory.lower()
                
                logging.info(f"\nTest ID: {test_case.id}")
                logging.info(f"Expected: {test_case.owaspCategory}")
                
                if is_correct:
                    correct_predictions += 1
                    logging.info(f"Result: ✓ {prediction}")
                else:
                    logging.warning(f"Result: ✗ {prediction}")
        
        # Log summary statistics
        accuracy = (correct_predictions/total_tests)*100 if total_tests > 0 else 0
        summary = f"""
Test Run Summary:
----------------
Total Tests: {total_tests}
Correct Predictions: {correct_predictions}
Accuracy: {accuracy:.2f}%
"""
        logging.info(summary)
        print(summary)

def main():
    # Initialize tester
    tester = GeminiTester()
    
    try:
        # Load test cases
        test_cases = tester.load_test_cases()
        
        # Run tests
        tester.run_tests(test_cases)
        
    except Exception as e:
        logging.error(f"Error in main execution: {str(e)}")
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    main()