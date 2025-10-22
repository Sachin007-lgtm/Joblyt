import httpx
import os
from dotenv import load_dotenv

load_dotenv()

HF_API_KEY = os.getenv('HUGGINGFACE_API_KEY')
HF_MODEL = 'sentence-transformers/all-mpnet-base-v2'
# Direct model endpoint
HF_API_URL = f"https://api-inference.huggingface.co/models/{HF_MODEL}"

print(f"Testing Hugging Face API...")
print(f"API Key: {HF_API_KEY[:20]}..." if HF_API_KEY else "No API Key")
print(f"URL: {HF_API_URL}")
print()

headers = {"Authorization": f"Bearer {HF_API_KEY}"}

# Test 1: Try with options parameter
print("Test 1: With options parameter")
payload = {"inputs": "software engineer", "options": {"use_cache": False}}
print(f"Payload: {payload}")

with httpx.Client(timeout=30.0) as client:
    response = client.post(HF_API_URL, headers=headers, json=payload)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print(f"Success! Embedding shape: {len(result) if isinstance(result, list) else 'N/A'}")
    else:
        print(f"Response: {response.text[:500]}")
    print()

# Test 2: Try sentence-transformers specific model
print("Test 2: Using a different sentence-transformers model")
test_url = "https://api-inference.huggingface.co/models/sentence-transformers/paraphrase-MiniLM-L6-v2"
payload = {"inputs": "software engineer"}
print(f"URL: {test_url}")
print(f"Payload: {payload}")

with httpx.Client(timeout=30.0) as client:
    response = client.post(test_url, headers=headers, json=payload)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print(f"Success! Result type: {type(result)}")
    else:
        print(f"Response: {response.text[:500]}")
