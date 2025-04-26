import os
import shutil
from fastapi import FastAPI, HTTPException, UploadFile, File, Request # Added Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import uuid
from OCRScanner import OCRScanner
from voice_analyzer import VoiceAnalyzer # Ensure this import is correct
from chatbot import ChatBot
import logging
import base64
from io import BytesIO
import numpy as np
import pandas as pd
from geminiaiagent import generate as gemini_agent_generate
import traceback # Import traceback for detailed error logging
from typing import Optional # For optional fields in response model
from pydub import AudioSegment, exceptions as pydub_exceptions # Import pydub
import tempfile # Import tempfile

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# --- Add ffmpeg check/warning (optional but recommended) ---
try:
    AudioSegment.converter = AudioSegment.get_converter_path()
    logger.info(f"ffmpeg converter found at: {AudioSegment.converter}")
except pydub_exceptions.CouldntEncodeError:
    logger.warning("ffmpeg/avconv not found or not configured correctly. '.m4a' conversion might fail. Please install ffmpeg and ensure it's in the system PATH.")
except Exception as ff_check_err:
     logger.warning(f"Could not verify ffmpeg presence: {ff_check_err}")
# ---------------------------------------------------------

# Initialize FastAPI
app = FastAPI(
    title="MediMate API", # Updated title
    description="API for MediMate features including OCR, Voice Analysis, and Chat",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create upload directory if it doesn't exist
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
logger.info(f"Upload directory set to: {os.path.abspath(UPLOAD_DIR)}")

# Initialize OCR Scanner
ocr_scanner = OCRScanner()
logger.info("OCRScanner initialized.")

# Initialize Voice Analyzer
try:
    voice_analyzer = VoiceAnalyzer()
    logger.info("VoiceAnalyzer initialized.")
except Exception as va_init_err:
    logger.error(f"Failed to initialize VoiceAnalyzer: {va_init_err}", exc_info=True)
    # Depending on severity, you might want to exit or disable voice features
    voice_analyzer = None # Set to None if initialization fails

# Initialize ChatBot
chatbot = ChatBot()
logger.info("ChatBot initialized.")

# --- Pydantic Models ---
class OCRRequest(BaseModel):
    image: str  # Base64 encoded image

class OCRResponse(BaseModel):
    medication_name: str
    description: str
    dosage: str
    frequency: str
    time_of_day: str
    start_date: str
    duration: str
    special_instructions: str

class VoiceAnalysisResponse(BaseModel):
    glucose_level: float
    confidence: Optional[float] = None # Ensure field name is 'confidence'
    status: str
    range_info: str

class ChatRequest(BaseModel):
    message: str

class TranscriptionAnalysisRequest(BaseModel):
    transcription: str

class TranscriptionAnalysisResponse(BaseModel):
    key_points: str

# --- Helper Function: Convert to WAV (Moved here) ---
async def convert_to_wav(input_path: str, request_id: str) -> tuple[str, bool]:
    """
    Convert audio file to WAV format if needed.
    Returns the path to the WAV file and a boolean indicating if conversion occurred.
    """
    endpoint_name = "/upload-voice (convert_to_wav)" # Context for logging
    # Check if the file is already in WAV format
    if input_path.lower().endswith('.wav'):
        logger.info(f"[{request_id}] {endpoint_name} - Input file is already WAV: {input_path}")
        return input_path, False # Return path and flag indicating no conversion needed

    logger.info(f"[{request_id}] {endpoint_name} - Attempting conversion for: {input_path}")
    temp_wav_path = None
    try:
        # Load the audio file using pydub
        file_ext = os.path.splitext(input_path)[1].lower()
        if file_ext == '.m4a':
            audio = AudioSegment.from_file(input_path, format="m4a")
        # Add other formats if needed
        # elif file_ext == '.mp3':
        #     audio = AudioSegment.from_file(input_path, format="mp3")
        else:
            # This case should ideally not happen if initial validation is correct
            raise ValueError(f"Unsupported audio format for conversion: {input_path}")

        if len(audio) == 0:
             logger.warning(f"[{request_id}] {endpoint_name} - Audio file loaded but has zero duration/length: {input_path}")
             # Depending on requirements, you might raise an error here
             # raise ValueError("Input audio file is empty or silent.")

        # Create a temporary WAV file path using tempfile
        # delete=False is important because the file needs to exist after this block
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False, dir=UPLOAD_DIR, prefix=f"{request_id}_conv_") as temp_wav:
            temp_wav_path = temp_wav.name
        logger.info(f"[{request_id}] {endpoint_name} - Created temporary WAV path: {temp_wav_path}")

        # Export as WAV
        logger.info(f"[{request_id}] {endpoint_name} - Exporting to temporary WAV: {temp_wav_path}")
        audio.export(temp_wav_path, format="wav")
        logger.info(f"[{request_id}] {endpoint_name} - Successfully converted to WAV: {temp_wav_path}")

        return temp_wav_path, True # Return path and flag indicating conversion happened

    except pydub_exceptions.CouldntDecodeError as decode_err:
         logger.error(f"[{request_id}] {endpoint_name} - Pydub failed to decode '{input_path}'. Check file integrity and ffmpeg installation.", exc_info=True)
         raise Exception(f"Failed to decode audio file. Ensure it's a valid '{file_ext}' file and ffmpeg is installed.") from decode_err
    except FileNotFoundError as fnf_err:
         logger.error(f"[{request_id}] {endpoint_name} - Audio conversion failed. Input file not found: {input_path}", exc_info=True)
         raise Exception(f"Audio file not found at path: {input_path}") from fnf_err
    except Exception as e:
        logger.error(f"[{request_id}] {endpoint_name} - Error converting audio file '{input_path}' to WAV: {e}", exc_info=True)
        # Clean up temp file if created before error
        if temp_wav_path and os.path.exists(temp_wav_path):
            try:
                os.remove(temp_wav_path)
                logger.warning(f"[{request_id}] {endpoint_name} - Cleaned up intermediate temp file {temp_wav_path} during conversion error.")
            except Exception as cleanup_err:
                logger.warning(f"[{request_id}] {endpoint_name} - Failed to clean up intermediate temp file {temp_wav_path} during conversion error: {cleanup_err}")
        raise Exception(f"Error converting audio file: {e}") from e

# --- Endpoints ---

@app.post("/process-medication-image", response_model=OCRResponse)
async def process_image(request: OCRRequest):
    """
    Process a base64 encoded medication label image and extract information
    """
    try:
        # Create a temporary file path
        temp_file_path = os.path.join(UPLOAD_DIR, f"{uuid.uuid4()}.jpg")

        try:
            # Decode base64 image
            image_data = base64.b64decode(request.image)

            # Save the image data to a temporary file
            logger.info(f"Saving decoded image to: {temp_file_path}")
            with open(temp_file_path, "wb") as f:
                f.write(image_data)

            # Process the image with Gemini Vision
            logger.info("Processing image with Gemini Vision")
            result = ocr_scanner.process_image(temp_file_path)
            logger.info(f"Gemini Vision Result: {result}")

            if "error" in result:
                raise HTTPException(status_code=500, detail=result["error"])

            # Map the result to expected response format
            response = OCRResponse(
                medication_name=result.get("Medication Name", "Not specified"),
                description=result.get("Description", "Not specified"),
                dosage=result.get("Dosage", "Not specified"),
                frequency=result.get("Frequency", "Not specified"),
                time_of_day=result.get("Time of day", "Not specified"),
                start_date=result.get("Start Date", "Not specified"),
                duration=result.get("Duration", "Not specified"),
                special_instructions=result.get(
                    "Special Instructions", "Not specified"
                ),
            )

            return response

        except Exception as e:
            logger.error(f"Error processing image: {str(e)}")
            raise HTTPException(
                status_code=500, detail=f"Error processing image: {str(e)}"
            )

        finally:
            # Clean up the temporary file
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)

    except Exception as e:
        logger.error(f"Error in request processing: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Invalid request: {str(e)}")


@app.post("/process-text", response_model=OCRResponse)
async def process_text(text: str):
    """
    Process plain text from a medication label and extract information
    """
    try:
        # Process the text
        result = ocr_scanner.extract_metrics(text)

        # Map the result to expected response format
        response = OCRResponse(
            medication_name=result.get("Medication Name", "Not specified"),
            description=result.get("Description", "Not specified"),
            dosage=result.get("Dosage", "Not specified"),
            frequency=result.get("Frequency", "Not specified"),
            time_of_day=result.get("Time of day", "Not specified"),
            start_date=result.get("Start Date", "Not specified"),
            duration=result.get("Duration", "Not specified"),
            special_instructions=result.get("Special Instructions", "Not specified"),
        )

        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing text: {str(e)}")


@app.post("/upload-voice", response_model=VoiceAnalysisResponse)
async def upload_voice(request: Request, file: UploadFile = File(...)): # Added Request
    """
    Upload a voice file (.wav or .m4a), convert if necessary, and predict glucose level
    """
    # --- VERY FIRST LOG ---
    logger.info("--- >>> Entered /upload-voice endpoint function <<< ---")
    logger.info(f"Request Headers: {dict(request.headers)}")
    # --- END VERY FIRST LOG ---

    endpoint_name = "/upload-voice"
    request_id = str(uuid.uuid4())
    logger.info(f"[{request_id}] {endpoint_name} - Processing request.")

    original_temp_file_path = None # Path of the initially uploaded file
    converted_wav_path = None    # Path of the WAV file (might be same as original)
    was_converted = False        # Flag if conversion happened

    try:
        # --- Initial Validation and Logging ---
        if not file:
            logger.error(f"[{request_id}] {endpoint_name} - Failed: No file object received.")
            raise HTTPException(status_code=400, detail="No file provided in the request.")

        logger.info(f"[{request_id}] {endpoint_name} - Received file: Filename='{file.filename}', Content-Type='{file.content_type}', Size={getattr(file, 'size', 'Unknown')}")

        if not file.filename:
            logger.error(f"[{request_id}] {endpoint_name} - Failed: Filename missing.")
            raise HTTPException(status_code=400, detail="Filename is missing in the upload.")

        # --- File Extension Validation ---
        logger.info(f"[{request_id}] {endpoint_name} - Validating file extension...")
        allowed_extensions = (".wav", ".m4a")
        file_ext = os.path.splitext(file.filename)[1].lower()
        if file_ext not in allowed_extensions:
            logger.error(f"[{request_id}] {endpoint_name} - Failed: Invalid file extension '{file_ext}'. Allowed: {allowed_extensions}")
            raise HTTPException(
                status_code=400, detail=f"Invalid file type '{file_ext}'. Only .wav or .m4a allowed."
            )
        logger.info(f"[{request_id}] {endpoint_name} - File extension '{file_ext}' is valid.")

        # --- Save Original Uploaded File ---
        original_temp_file_path = os.path.join(UPLOAD_DIR, f"{request_id}_orig{file_ext}") # Mark as original
        logger.info(f"[{request_id}] {endpoint_name} - Generated original temporary file path: {original_temp_file_path}")

        try:
            logger.info(f"[{request_id}] {endpoint_name} - Attempting to read file content...")
            file_content = await file.read()
            content_length = len(file_content)
            logger.info(f"[{request_id}] {endpoint_name} - Successfully read {content_length} bytes from file stream.")

            if content_length == 0:
                 logger.error(f"[{request_id}] {endpoint_name} - Failed: Received empty file content (0 bytes).")
                 raise HTTPException(status_code=400, detail="Received empty file.")

            logger.info(f"[{request_id}] {endpoint_name} - Attempting to write content to {original_temp_file_path}...")
            with open(original_temp_file_path, "wb") as buffer:
                buffer.write(file_content)
            logger.info(f"[{request_id}] {endpoint_name} - Successfully wrote original content to {original_temp_file_path}.")

            # Verify save
            if not os.path.exists(original_temp_file_path) or os.path.getsize(original_temp_file_path) == 0:
                 logger.error(f"[{request_id}] {endpoint_name} - Failed: Original file saving failed or resulted in empty file at {original_temp_file_path}.")
                 raise HTTPException(status_code=500, detail="Failed to properly save the uploaded file on the server.")
            logger.info(f"[{request_id}] {endpoint_name} - Verified original file exists with size {os.path.getsize(original_temp_file_path)} bytes.")

        except HTTPException as http_exc:
             raise http_exc # Re-raise validation errors
        except Exception as save_error:
            logger.error(f"[{request_id}] {endpoint_name} - Error during file reading or saving original: {save_error}", exc_info=True)
            raise HTTPException(status_code=500, detail=f"Server error saving uploaded file: {save_error}")

        # --- Convert to WAV if Necessary ---
        logger.info(f"[{request_id}] {endpoint_name} - Checking if conversion to WAV is needed...")
        try:
            # Call the conversion function (now part of main.py)
            converted_wav_path, was_converted = await convert_to_wav(original_temp_file_path, request_id)
            logger.info(f"[{request_id}] {endpoint_name} - Conversion check complete. Using WAV path: {converted_wav_path}. Was converted: {was_converted}")
            # Verify the WAV file exists after conversion attempt
            if not os.path.exists(converted_wav_path) or os.path.getsize(converted_wav_path) == 0:
                logger.error(f"[{request_id}] {endpoint_name} - Failed: WAV file path '{converted_wav_path}' does not exist or is empty after conversion check.")
                raise HTTPException(status_code=500, detail="Server error: Failed to obtain valid WAV file for analysis.")
            logger.info(f"[{request_id}] {endpoint_name} - Verified WAV file exists at {converted_wav_path} with size {os.path.getsize(converted_wav_path)} bytes.")

        except Exception as convert_error:
            logger.error(f"[{request_id}] {endpoint_name} - Error during audio conversion: {convert_error}", exc_info=True)
            raise HTTPException(status_code=500, detail=f"Server error converting audio to WAV: {convert_error}")

        # --- Voice Analysis (using the WAV file) ---
        if voice_analyzer is None:
             logger.error(f"[{request_id}] {endpoint_name} - Failed: VoiceAnalyzer was not initialized successfully.")
             raise HTTPException(status_code=500, detail="Voice analysis service is unavailable.")

        logger.info(f"[{request_id}] {endpoint_name} - Starting feature extraction using: {converted_wav_path}...")
        # Pass the potentially converted WAV path to the analyzer
        features = voice_analyzer.extract_voice_features(converted_wav_path)
        logger.info(f"[{request_id}] {endpoint_name} - Feature extraction completed successfully.")

        logger.info(f"[{request_id}] {endpoint_name} - Starting glucose prediction...")
        glucose_level, confidence = voice_analyzer.predict_glucose(features)
        logger.info(f"[{request_id}] {endpoint_name} - Prediction completed: Glucose={glucose_level}, Confidence={confidence}")

        # --- Determine Status and Range Info ---
        logger.info(f"[{request_id}] {endpoint_name} - Determining status based on prediction...")
        status = "Normal"
        range_info = "Normal range (80-120 mg/dL)"
        normal_range = getattr(voice_analyzer, 'normal_range', (80, 120))

        if glucose_level < normal_range[0]:
            status = "Low"
            range_info = f"Below normal range (< {normal_range[0]} mg/dL)"
        elif glucose_level > normal_range[1]:
            status = "High"
            if glucose_level > 140:
                range_info = f"Potentially high range (> {normal_range[1]} mg/dL, e.g., > 140 mg/dL)"
            else:
                range_info = f"Elevated range ({normal_range[1]}-140 mg/dL)"

        logger.info(f"[{request_id}] {endpoint_name} - Determined Status='{status}', RangeInfo='{range_info}'")

        # --- Prepare and Return Response ---
        response_data = VoiceAnalysisResponse(
            glucose_level=round(float(glucose_level), 2),
            confidence=round(float(confidence), 2) if confidence is not None else None,
            status=status,
            range_info=range_info,
        )
        logger.info(f"[{request_id}] {endpoint_name} - Sending successful response: {response_data.dict()}")
        return response_data

    except HTTPException as http_exc:
         # Log and re-raise known HTTP exceptions
         logger.error(f"[{request_id}] {endpoint_name} - HTTPException occurred: {http_exc.status_code} - {http_exc.detail}", exc_info=False) # Don't need full traceback for these
         raise http_exc
    except Exception as e:
        # Catch-all for unexpected errors during the main process
        logger.error(f"[{request_id}] {endpoint_name} - Unexpected error in main processing: {e}", exc_info=True)
        logger.error(f"[{request_id}] {endpoint_name} - Traceback: {traceback.format_exc()}")
        # Determine status code based on where error might have occurred
        status_code = 500 # Default to internal server error
        if isinstance(e, (ValueError, TypeError)): # Example: could be bad data format
             status_code = 400
        raise HTTPException(status_code=status_code, detail=f"An unexpected server error occurred: {e}")

    finally:
        # --- Clean up Temporary Files ---
        logger.info(f"[{request_id}] {endpoint_name} - Starting cleanup...")
        # Clean up the converted WAV file if it was created and is different from original
        if was_converted and converted_wav_path and os.path.exists(converted_wav_path):
            try:
                os.remove(converted_wav_path)
                logger.info(f"[{request_id}] {endpoint_name} - Cleaned up temporary WAV file: {converted_wav_path}")
            except Exception as cleanup_error:
                logger.error(f"[{request_id}] {endpoint_name} - Error cleaning up temporary WAV file {converted_wav_path}: {cleanup_error}", exc_info=True)
        elif converted_wav_path:
             logger.info(f"[{request_id}] {endpoint_name} - No conversion occurred or WAV path invalid, skipping WAV cleanup for: {converted_wav_path}")

        # Clean up the original uploaded file
        if original_temp_file_path and os.path.exists(original_temp_file_path):
            try:
                os.remove(original_temp_file_path)
                logger.info(f"[{request_id}] {endpoint_name} - Cleaned up original uploaded file: {original_temp_file_path}")
            except Exception as cleanup_error:
                logger.error(f"[{request_id}] {endpoint_name} - Error cleaning up original file {original_temp_file_path}: {cleanup_error}", exc_info=True)
        elif original_temp_file_path:
             logger.warning(f"[{request_id}] {endpoint_name} - Original file {original_temp_file_path} not found during cleanup.")
        logger.info(f"[{request_id}] {endpoint_name} - Cleanup finished.")


@app.post("/train-voice-model")
async def train_voice_model(file: UploadFile = File(...)):
    """
    Upload training data and train the voice analysis model
    """
    try:
        # Save the uploaded training data file
        temp_file_path = os.path.join(UPLOAD_DIR, f"training_data_{uuid.uuid4()}.csv")

        try:
            # Save the uploaded file
            with open(temp_file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            # Load training data
            training_data = pd.read_csv(temp_file_path)

            # Assuming the CSV has columns for features and 'glucose_level'
            X_train = training_data[voice_analyzer.feature_names].values
            y_train = training_data["glucose_level"].values

            # Train the model
            voice_analyzer.train_model(X_train, y_train)

            # Save the trained model
            voice_analyzer.save_model()

            return {"message": "Model trained successfully"}

        except Exception as e:
            logger.error(f"Error training model: {str(e)}")
            raise HTTPException(
                status_code=500, detail=f"Error training model: {str(e)}"
            )

        finally:
            # Clean up the temporary file
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)

    except Exception as e:
        logger.error(f"Error in request processing: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Invalid request: {str(e)}")

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    """
    Get a streaming response from the Gemini-powered chatbot
    """
    try:
        return StreamingResponse(
            chatbot.get_response(request.message),
            media_type='application/json'
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze-transcription", response_model=TranscriptionAnalysisResponse)
async def analyze_transcription(request: TranscriptionAnalysisRequest):
    """
    Analyze a medical transcription using Gemini AI and extract key points
    """
    try:
        logger.info("Analyzing transcription with Gemini AI")

        # Call Gemini AI Agent to analyze the transcription
        analysis = gemini_agent_generate(request.transcription)

        # Return the analysis
        return TranscriptionAnalysisResponse(key_points=analysis)

    except Exception as e:
        logger.error(f"Error analyzing transcription: {str(e)}")
        import traceback

        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500, detail=f"Error analyzing transcription: {str(e)}"
        )

@app.get("/")
async def root():
    logger.info("Root endpoint '/' accessed.")
    return {"message": "MediMate API is running. Use /docs for API documentation."}


if __name__ == "__main__":
    import uvicorn
    logger.info("Starting Uvicorn server...")
    # Run the server on all network interfaces (0.0.0.0)
    uvicorn.run(app, host="0.0.0.0", port=8000)
