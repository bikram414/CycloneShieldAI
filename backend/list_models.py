# backend/list_models.py

import google.generativeai as genai

import os

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

for model in genai.list_models():
    print(model.name)