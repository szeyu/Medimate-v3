# To run this code you need to install the following dependencies:
# pip install google-generativeai python-dotenv

import os
import base64
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


def generate(input_text):
    try:
        # Get API key from environment variables
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is not set")

        # Initialize the client with API key
        genai.configure(api_key=api_key)

        # Set up the model with system instructions
        generation_config = {
            "temperature": 0.1,
            "max_output_tokens": 1024,
        }

        # System instructions - must be passed as part of the model configuration
        safety_settings = [
            {
                "category": "HARM_CATEGORY_HARASSMENT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
                "category": "HARM_CATEGORY_HATE_SPEECH",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
                "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
                "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE",
            },
        ]

        model = genai.GenerativeModel(
            model_name="gemini-2.0-flash",
            generation_config=generation_config,
            safety_settings=safety_settings,
        )

        # System instruction has to be included in the content for Gemini API
        system_instruction = """🔧 System Prompt: AI Transcriber Agent (Experienced Medical Doctor)
    You are an experienced and observant medical doctor trained in internal medicine and primary care. You are given a transcription of a conversation between a patient and a doctor. Your job is to:

    Identify hidden symptoms or risks shared by the patient that the doctor might have overlooked or not explored in detail.

    Suggest better or more suitable treatment alternatives, especially if the doctor's recommendation seems incomplete or inappropriate.

    Flag possible misdiagnoses, missed connections, or poor clinical decisions.

    Assume the transcription might not label the speaker clearly, or may even mix up speaker roles. Use your understanding of the context and phrasing to infer who is the patient and who is the doctor.

    Prioritize concise, context-aware analysis — clarity over verbosity.

    Act as a supportive second opinion system, not a replacement for the doctor. Your role is to assist in improving patient outcomes through intelligent observation.

    🎯 Output Format (Example):
    Patient: Mentioned ongoing fatigue, increased thirst, and blurry vision — subtle signs of potential undiagnosed diabetes. Also expressed concern about frequent urination, but this was not followed up.

    Doctor: Focused primarily on sleep quality and prescribed vitamins. Missed key pattern suggestive of Type 2 Diabetes. A simple blood glucose test could have been suggested. Opportunity for earlier diagnosis lost.

    📝 Note: Keep responses concise but meaningful. Avoid generic suggestions. Understand context deeply and infer speaker roles accurately for high-impact analysis."""

        # Create content parts with system instruction first
        content = [
            {"role": "user", "parts": [{"text": system_instruction}]},
            {
                "role": "model",
                "parts": [
                    {
                        "text": "I understand my role as an experienced medical doctor providing analysis of patient-doctor conversations. I'll identify overlooked symptoms, suggest better treatments, and flag possible misdiagnoses in a concise, meaningful way."
                    }
                ],
            },
            {
                "role": "user",
                "parts": [
                    {
                        "text": f"""Example case:
    Patient:
    "Yeah, I've been really tired lately… like exhausted all the time. I've also lost about 5 kilos in the past month but I didn't change my diet or anything. Oh, and I've been drinking a lot more water than usual — always thirsty."

    Doctor:
    "Sounds like stress. Maybe take a break, get some rest, and I'll prescribe you some supplements for energy. Let's monitor for now."

    Analysis:
    Patient: Reported persistent fatigue, unexplained weight loss, and increased thirst. These are classic symptoms that warrant further investigation.

    Doctor: Attributed symptoms to stress and prescribed supplements without further investigation.

    Recommendation: The constellation of symptoms suggests possible diabetes (Type 1 or Type 2) or hyperthyroidism. A basic metabolic panel including glucose and thyroid function tests should be considered before attributing the symptoms to stress and prescribing supplements.

    Now please analyze this new conversation:
    {input_text}"""
                    }
                ],
            },
        ]

        # Generate content with streaming
        response = model.generate_content(
            content,
            stream=True,
        )

        response_text = ""
        for chunk in response:
            if hasattr(chunk, "text"):
                chunk_text = chunk.text
                response_text += chunk_text
                print(chunk_text, end="")

        return response_text

    except Exception as e:
        print(f"\n\nError in generate function: {str(e)}")
        import traceback

        traceback.print_exc()
        return f"Error: {str(e)}"


# Test function to run the agent with sample input
def test_agent():
    sample_input = """Patient: "I’ve had this sharp pain in my upper back for a few days now. It comes and goes, sometimes when I’m just sitting still."

Doctor: "Hmm, probably muscular. You might’ve pulled something. Just take some ibuprofen and see how it goes."""

    print("\nTesting Gemini AI Agent with sample input...\n")
    result = generate(sample_input)
    # print("\n\nResult:", result)


if __name__ == "__main__":
    test_agent()
