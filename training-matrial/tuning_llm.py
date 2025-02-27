import os 
import json
import time
from google import genai
from dotenv import load_dotenv

 
env_path = "../.env"
load_dotenv(dotenv_path=env_path)
key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=key) 

with open("payloads.json", "r") as f:
    payload_data = json.load(f)

examples = []
for item in payload_data:
    prompt = "Classify the following payload into an OWASP category: " + item["payload"]
    category = item["owaspCategory"]
    examples.append((prompt, category))

training_dataset = genai.types.TuningDataset(
    examples=[genai.types.TuningExample(text_input=i, output=o) for i, o in examples]
)


tuning_job = client.tunings.tune(
    base_model='models/gemini-1.5-flash-001-tuning',
    training_dataset=training_dataset,
    config=genai.types.CreateTuningJobConfig(
        epoch_count=5,
        batch_size=4,
        learning_rate=0.001,
        tuned_model_display_name="OWASP Category Classifier"
    )
)