import os
import shutil
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uuid
from OCRScanner import OCRScanner
from voice_analyzer import VoiceAnalyzer
import logging
import base64
from io import BytesIO
import numpy as np
import pandas as pd
from geminiaiagent import generate as gemini_agent_generate

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI
app = FastAPI(
    title="MediMate OCR API",
    description="API for processing medication labels using OCR",
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

# Initialize OCR Scanner
ocr_scanner = OCRScanner()

# Initialize Voice Analyzer
voice_analyzer = VoiceAnalyzer()


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
    confidence_score: float
    status: str
    range_info: str


class TranscriptionAnalysisRequest(BaseModel):
    transcription: str  # The transcribed text to analyze


class TranscriptionAnalysisResponse(BaseModel):
    key_points: str  # The analysis from Gemini AI


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
async def upload_voice(file: UploadFile = File(...)):
    """
    Upload a voice file and predict glucose level
    """
    try:
        # Log incoming file details
        logger.info(f"Received file: {file.filename}")
        logger.info(f"Content type: {file.content_type}")

        # Verify file type
        if not file.filename.endswith((".wav", ".m4a")):
            logger.error(f"Invalid file extension: {file.filename}")
            raise HTTPException(
                status_code=400, detail="File must be .wav or .m4a format"
            )

        # Create a temporary file path with the correct extension
        extension = ".m4a" if file.filename.endswith(".m4a") else ".wav"
        temp_file_path = os.path.join(UPLOAD_DIR, f"{uuid.uuid4()}{extension}")

        try:
            # Save the uploaded file
            file_content = await file.read()
            logger.info(f"Read file content length: {len(file_content)} bytes")

            with open(temp_file_path, "wb") as buffer:
                buffer.write(file_content)

            logger.info(f"Saved audio file to: {temp_file_path}")
            logger.info(
                f"File size after save: {os.path.getsize(temp_file_path)} bytes"
            )

            # Log file details
            if os.path.exists(temp_file_path):
                logger.info(f"File exists at: {temp_file_path}")
                logger.info(
                    f"File permissions: {oct(os.stat(temp_file_path).st_mode)[-3:]}"
                )
            else:
                logger.error(f"File does not exist at: {temp_file_path}")

            try:
                # Extract features from the voice file
                logger.info("Starting feature extraction...")
                features = voice_analyzer.extract_voice_features(temp_file_path)
                logger.info("Feature extraction completed")

                # Predict glucose level
                logger.info("Starting glucose prediction...")
                glucose_level, confidence = voice_analyzer.predict_glucose(features)
                logger.info(
                    f"Prediction completed: level={glucose_level}, confidence={confidence}"
                )

                # Determine status and range info
                status = "Normal"
                if glucose_level < 80:
                    status = "Low"
                    range_info = "Below normal range (<80 mg/dL)"
                elif glucose_level > 120:
                    status = "High"
                    if glucose_level > 140:
                        range_info = "Diabetic range (>140 mg/dL)"
                    else:
                        range_info = "Pre-diabetic range (120-140 mg/dL)"
                else:
                    range_info = "Normal range (80-120 mg/dL)"

                response = VoiceAnalysisResponse(
                    glucose_level=float(glucose_level),
                    confidence_score=float(confidence),
                    status=status,
                    range_info=range_info,
                )

                logger.info(f"Analysis response: {response}")
                return response
            except Exception as feature_error:
                logger.error(
                    f"Error in feature extraction or prediction: {str(feature_error)}"
                )
                logger.error(f"Error type: {type(feature_error)}")
                import traceback

                logger.error(f"Traceback: {traceback.format_exc()}")
                raise HTTPException(
                    status_code=500,
                    detail=f"Error processing audio: {str(feature_error)}",
                )

        except Exception as e:
            logger.error(f"Error processing voice file: {str(e)}")
            logger.error(f"Error type: {type(e)}")
            import traceback

            logger.error(f"Traceback: {traceback.format_exc()}")
            raise HTTPException(
                status_code=500, detail=f"Error processing voice file: {str(e)}"
            )

    except Exception as e:
        logger.error(f"Error in request processing: {str(e)}")
        logger.error(f"Error type: {type(e)}")
        import traceback

        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=400, detail=f"Invalid request: {str(e)}")


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
    return {"message": "MediMate OCR API is running. Use /docs for API documentation."}


if __name__ == "__main__":
    import uvicorn

    # Run the server on all network interfaces (0.0.0.0) instead of just localhost
    uvicorn.run(app, host="0.0.0.0", port=8000)
