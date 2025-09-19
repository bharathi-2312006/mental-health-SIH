from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

# Model ID for Gemma-2B (from Hugging Face Hub)
model_id = "google/gemma-2b"

# Load tokenizer
tokenizer = AutoTokenizer.from_pretrained(model_id)

# Load model (this will download it if not already cached)
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    torch_dtype=torch.float16,   # use float16 to save memory
    device_map="auto"            # automatically use GPU if available
)

# Example text
prompt = "Explain quantum computing in simple words."

# Tokenize input
inputs = tokenizer(prompt, return_tensors="pt").to(model.device)

# Generate response
outputs = model.generate(**inputs, max_new_tokens=200)

# Decode response
print(tokenizer.decode(outputs[0], skip_special_tokens=True))
