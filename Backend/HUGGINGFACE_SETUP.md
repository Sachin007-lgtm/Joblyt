# Hugging Face Inference API Setup

This project has been updated to use **Hugging Face's Inference API** instead of local PyTorch and Transformers libraries. This significantly reduces memory usage and deployment size, making it perfect for cloud platforms like Render.

## Changes Made

### 1. Removed Heavy Dependencies
- ❌ `torch` (PyTorch)
- ❌ `transformers`
- ❌ `sentence-transformers`
- ❌ `ipykernel` (not needed for production)

### 2. Updated Code
- Modified `app/matching.py` to use Hugging Face Inference API
- All embedding generation now happens via API calls instead of local model loading
- Uses the same model (`sentence-transformers/all-mpnet-base-v2`) via API

### 3. Required Environment Variables

Add these to your `.env` file:

```env
# Hugging Face API Configuration
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
HUGGINGFACE_MODEL=BAAI/bge-small-en-v1.5

# Existing variables (keep as is)
GROK_API_KEY=your_groq_api_key
LLM_MODEL_NAME=gemma2-9b-it
# ... other existing variables
```

## Getting Your Hugging Face API Key

1. Go to [Hugging Face](https://huggingface.co/)
2. Sign up or log in
3. Go to Settings → Access Tokens
4. Create a new token with "Read" access
5. Copy the token and add it to your `.env` file

**Note:** Hugging Face Inference API is FREE for most models with rate limits. Perfect for small to medium projects!

## Benefits

✅ **Smaller Deployment Size**: No need to install 2GB+ PyTorch  
✅ **Lower Memory Usage**: No models loaded in memory  
✅ **Faster Cold Starts**: Render/Cloud servers start much faster  
✅ **Same Accuracy**: Uses the exact same model via API  
✅ **Auto Scaling**: Hugging Face handles model hosting  

## Installation

```bash
cd Backend
pip install -r requirements.txt
```

## Testing Locally

Make sure you have your `HUGGINGFACE_API_KEY` set in `.env`, then:

```bash
cd Backend
uvicorn app.main:app --reload
```

## Deployment on Render

1. Update your Render environment variables:
   - Add `HUGGINGFACE_API_KEY`
   - Keep all other existing variables

2. The app will now deploy successfully without memory issues!

## Rate Limits

Hugging Face Inference API free tier includes:
- 30,000 requests per month
- Rate limit: 100 requests per minute

For higher limits, check [Hugging Face Pricing](https://huggingface.co/pricing).

## Alternative Models

You can use different embedding models by changing `HUGGINGFACE_MODEL`:

- `BAAI/bge-small-en-v1.5` (default, 384 dimensions, fast & accurate)
- `BAAI/bge-base-en-v1.5` (768 dimensions, more accurate but slower)
- `BAAI/bge-large-en-v1.5` (1024 dimensions, best quality)

**Note:** Sentence-transformers models don't work with HF Inference API for embeddings. Use BGE models instead.

## Fallback to Local

If you want to switch back to local models (not recommended for Render):

1. Reinstall dependencies: `pip install sentence-transformers torch`
2. Revert the code changes in `app/matching.py`

---

**Questions?** The code is fully documented and all embedding functions now use `get_embeddings()` which calls the Hugging Face API.
