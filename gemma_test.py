from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

# Load tokenizer and model
model_name = "google/gemma-2b"

print("🔄 Downloading model... this may take a while the first time.")
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    device_map="auto",  # Uses GPU if available
    torch_dtype=torch.float16,  # Efficient loading
)

# Test prompt
prompt = "You are a counselor. How would you help a student who feels anxious before exams?"

inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
outputs = model.generate(**inputs, max_length=200)

print("\n🤖 Model response:\n")
print(tokenizer.decode(outputs[0], skip_special_tokens=True))
