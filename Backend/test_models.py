import httpx
import os
from dotenv import load_dotenv

load_dotenv()

HF_API_KEY = os.getenv('HUGGINGFACE_API_KEY')

# Try different models that support feature extraction
models_to_test = [
    "BAAI/bge-small-en-v1.5",  # Good for embeddings
    "thenlper/gte-small",  # General text embeddings
    "sentence-transformers/all-MiniLM-L6-v2"  # Smaller sentence transformer
]

headers = {"Authorization": f"Bearer {HF_API_KEY}"}

for model in models_to_test:
    print(f"\n{'='*60}")
    print(f"Testing: {model}")
    print(f"{'='*60}")
    
    url = f"https://api-inference.huggingface.co/models/{model}"
    payload = {"inputs": "software engineer"}
    
    with httpx.Client(timeout=30.0) as client:
        response = client.post(url, headers=headers, json=payload)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ SUCCESS!")
            print(f"Result type: {type(result)}")
            if isinstance(result, list):
                print(f"Embedding dimension: {len(result)}")
                print(f"First 5 values: {result[:5]}")
        else:
            print(f"❌ Error: {response.text[:200]}")
