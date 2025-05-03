# To run this code you need to install the following dependencies:
# pip install google-generativeai python-dotenv

import os
import base64
import logging
import google.generativeai as genai
from dotenv import load_dotenv

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logger.info("--- Logger initialized successfully ---") # Add this line

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

        logger.info("Gemini Agent: Content prepared. Calling generate_content...")

        # Generate content with streaming
        response = model.generate_content(
            content,
            stream=True,
        )
        logger.info("Gemini Agent: Stream initiated.")

        response_text = ""
        chunk_count = 0
        # Add more detailed logging and error handling around the loop
        try:
            for chunk in response:
                chunk_count += 1
                chunk_text = None # Initialize chunk_text for this iteration
                try:
                    # Check if the attribute exists AND try to access it safely
                    if hasattr(chunk, "text"):
                        chunk_text = chunk.text # This is where the internal IndexError occurs
                    else:
                         logger.warning(f"Gemini Agent: Chunk {chunk_count} received without 'text' attribute: {type(chunk)}")

                    # Append only if text was successfully retrieved
                    if chunk_text is not None:
                        response_text += chunk_text
                        # logger.debug(f"Gemini Agent: Appended text: '{chunk_text}'") # Optional: Log appended text

                except IndexError as ie:
                    # Specifically catch the IndexError identified from the traceback
                    logger.warning(f"Gemini Agent: IndexError accessing chunk.text at chunk {chunk_count}. Likely an empty 'parts' list internally. Skipping chunk. Details: {ie}", exc_info=False) # Log as warning, don't need full traceback
                    # Optionally log the chunk type or content if helpful and safe
                    # logger.warning(f"Gemini Agent: Problematic chunk type: {type(chunk)}")
                    continue # Skip to the next chunk
                except Exception as access_err:
                    # Catch any other unexpected error during text access
                    logger.warning(f"Gemini Agent: Error accessing text from chunk {chunk_count}: {access_err}", exc_info=True)
                    continue # Skip to the next chunk


        except Exception as stream_err: # Catch errors during the overall streaming process
            logger.error(f"Gemini Agent: Error during stream processing loop (outside chunk access): {stream_err}", exc_info=True)
            logger.error(f"Gemini Agent: Last successful text: '{response_text}'")
            raise # Re-raise the error

        logger.info(f"Gemini Agent: Stream finished after {chunk_count} chunks. Full response length: {len(response_text)}")
        # Ensure some text was generated, otherwise it might indicate a persistent issue
        if not response_text and chunk_count > 0:
             logger.warning("Gemini Agent: Stream finished, but no text content was extracted from chunks.")
        elif chunk_count == 0:
             logger.warning("Gemini Agent: Stream finished immediately with zero chunks.")

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
