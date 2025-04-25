import os
import shutil
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uuid
from OCRScanner import OCRScanner
import logging
import base64
from io import BytesIO

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI
app = FastAPI(title="MediMate OCR API", 
              description="API for processing medication labels using OCR")

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
                special_instructions=result.get("Special Instructions", "Not specified")
            )
            
            return response
            
        except Exception as e:
            logger.error(f"Error processing image: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")
        
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
            special_instructions=result.get("Special Instructions", "Not specified")
        )
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing text: {str(e)}")

@app.get("/")
async def root():
    return {"message": "MediMate OCR API is running. Use /docs for API documentation."}

if __name__ == "__main__":
    import uvicorn
    # Run the server on all network interfaces (0.0.0.0) instead of just localhost
    uvicorn.run(app, host="0.0.0.0", port=8000)
