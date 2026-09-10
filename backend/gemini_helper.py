from dotenv import load_dotenv
import os
import google.generativeai as genai

load_dotenv("backend/.env")

api_key = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=api_key)

model = genai.GenerativeModel("models/gemini-3.6-flash")

def generate_briefing(category, risk, landfall, eta):

    prompt = f"""
    Generate a professional cyclone emergency briefing.

    Category: {category}
    Risk: {risk}
    Expected Landfall: {landfall}
    ETA: {eta}

    Include:
    - Situation summary
    - Recommended actions
    - Risk assessment

    Keep it under 150 words.
    """

    try:
        response = model.generate_content(prompt)

        if response and response.text:
            return response.text

    except Exception as e:
        print("Gemini Error:", e)

    return f"""
CYCLONE EMERGENCY BRIEFING

Category: {category}

Risk Level: {risk}

Expected Landfall:
{landfall}

ETA:
{eta}

Situation Summary:
A cyclone system is being monitored and may impact the {landfall} region.

Recommended Actions:
• Monitor official weather updates
• Prepare emergency supplies
• Avoid unnecessary coastal travel
• Follow evacuation instructions if issued

Risk Assessment:
Current threat level is classified as {risk}.
"""