import os
from dotenv import load_dotenv
import google.generativeai as genai
import base64
from PIL import Image
from io import BytesIO

class OCRScanner:
    def __init__(self):
        # Load GEMINI_API_KEY from environment
        load_dotenv()
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found. Please set GEMINI_API_KEY in your environment or .env file.")
        
        # Configure Gemini
        genai.configure(api_key=api_key)
        # Use the latest model version
        self.model = genai.GenerativeModel("gemini-2.0-flash")

    def process_image(self, image_path: str) -> dict:
        """
        Process an image containing a medication label using Gemini Vision.
        
        Args:
            image_path: Path to the image file
            
        Returns:
            dict: Extracted medication information
        """
        try:
            # Read and prepare the image
            with Image.open(image_path) as img:
                # Convert to RGB if needed
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                # Create a BytesIO object to store the image data
                img_byte_arr = BytesIO()
                img.save(img_byte_arr, format='JPEG')
                img_byte_arr = img_byte_arr.getvalue()
            
            # Create the prompt for Gemini
            prompt = """
            You are a medical OCR expert. Please analyze this medication label image and extract the following information:
            - Medication Name
            - Description
            - Dosage
            - Frequency
            - Time of day
            - Start Date
            - Duration
            - Special Instructions

            For each field, extract only the relevant information if present.
            If information is not available for a field, return "Not specified".
            Format the response as a JSON object with these fields.
            Be precise and only include information that is clearly visible in the image.
            """

            # Generate content with Gemini Vision
            response = self.model.generate_content([
                prompt,
                {"mime_type": "image/jpeg", "data": img_byte_arr}
            ])
            
            # Process response to extract structured data
            try:
                # Try to extract JSON from the response if it's embedded in markdown
                response_text = response.text
                if "```json" in response_text:
                    json_str = response_text.split("```json")[1].split("```")[0].strip()
                    import json
                    result = json.loads(json_str)
                else:
                    # Try to parse the entire response as JSON
                    import json
                    result = json.loads(response_text)
                    
                # Ensure all expected fields are present
                expected_fields = [
                    "Medication Name", "Description", "Dosage", "Frequency", 
                    "Time of day", "Start Date", "Duration", "Special Instructions"
                ]
                
                for field in expected_fields:
                    if field not in result:
                        result[field] = "Not specified"
                        
                return result
                
            except Exception as e:
                return {
                    "Medication Name": "Parsing Error",
                    "Description": f"Could not parse model response: {str(e)}",
                    "Dosage": "Not specified",
                    "Frequency": "Not specified",
                    "Time of day": "Not specified",
                    "Start Date": "Not specified",
                    "Duration": "Not specified",
                    "Special Instructions": "Not specified",
                    "Raw Response": response_text
                }
                
        except Exception as e:
            return {
                "error": str(e),
                "Medication Name": "Error",
                "Description": f"Error processing image: {str(e)}",
                "Dosage": "Not specified",
                "Frequency": "Not specified",
                "Time of day": "Not specified",
                "Start Date": "Not specified",
                "Duration": "Not specified",
                "Special Instructions": "Not specified"
            }
