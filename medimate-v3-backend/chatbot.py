import google.generativeai as genai
from typing import AsyncGenerator
import os
from dotenv import load_dotenv
import json
from typing import Dict, List, Optional

# Load environment variables
load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))

class ChatBot:
    def __init__(self):
        # Initialize the model
        generation_config = {
            "temperature": 0.7,
            "top_p": 0.8,
            "top_k": 40,
        }
        
        safety_settings = [
            {
                "category": "HARM_CATEGORY_HARASSMENT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_HATE_SPEECH",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
        ]
        
        self.model = genai.GenerativeModel(
            model_name="gemini-2.0-flash",
            generation_config=generation_config,
            safety_settings=safety_settings
        )
        
        # Initialize chat history
        self.chat = self.model.start_chat(history=[])
        self.user_profile = None
        
    def set_user_profile(self, profile: Dict):
        """Set the user profile for personalized responses."""
        self.user_profile = profile
        
    def _get_system_prompt(self) -> str:
        """Generate the system prompt including user context if available."""
        base_prompt = """You are Dexter AI, a highly intelligent, empathetic, and detail-oriented AI Health Expert, trained with expert-level medical knowledge, especially in integrative and functional medicine, nutrition, pharmacology, chronic illness management, and preventive care.

You do not provide diagnosis or replace a healthcare provider, but you offer high-quality guidance with insights people normally miss — such as nutrient interactions, supplement timing, side effects, or the deeper mechanisms behind health decisions.

Always:
1. Go deeper than generic chatbots by providing detailed, scientifically-backed information
2. Point out commonly overlooked risks or benefits (e.g., nutrient competition, bioavailability tips)
3. Recommend practical actions (e.g., food timing, dosage forms, lifestyle factors)
4. Use natural, friendly language while staying medically informative
5. Include relevant disclaimers when discussing medical topics
6. Encourage consultation with healthcare providers for medical decisions

Important: Never diagnose conditions or prescribe treatments. Always emphasize that your advice is informational and should be verified with healthcare providers."""

        if self.user_profile:
            user_context = f"""
Current User Profile:
- Age: {self.user_profile.get('age', 'Not specified')}
- Gender: {self.user_profile.get('gender', 'Not specified')}
- Health Goals: {', '.join(self.user_profile.get('health_goals', ['Not specified']))}
- Current Supplements: {', '.join(self.user_profile.get('supplements_taken', ['None']))}
- Health Knowledge Level: {self.user_profile.get('health_knowledge_level', 'Not specified')}
- Diet: {self.user_profile.get('diet', 'Not specified')}"""
            return base_prompt + "\n\n" + user_context
        
        return base_prompt
    
    def _chunk_response(self, text: str, chunk_size: int = 4) -> list[str]:
        """Split response into chunks of specified size."""
        return [text[i:i + chunk_size] for i in range(0, len(text), chunk_size)]
    
    async def get_response(self, message: str) -> AsyncGenerator[str, None]:
        """Get streaming response from Gemini."""
        try:
            # Get the full system prompt with user context
            system_prompt = self._get_system_prompt()
            
            # Generate response
            response = self.chat.send_message(
                f"{system_prompt}\n\nUser message: {message}",
                stream=True
            )
            
            # Process the streaming response
            accumulated_text = ""
            
            # Process each chunk in the response
            for chunk in response:
                if hasattr(chunk, 'text') and chunk.text:
                    accumulated_text += chunk.text
                    text_chunks = self._chunk_response(accumulated_text)
                    for text_chunk in text_chunks:
                        yield json.dumps({"text": text_chunk, "done": False}) + "\n"
                    accumulated_text = accumulated_text[len(text_chunks) * 4:]
            
            # Send any remaining text
            if accumulated_text:
                yield json.dumps({"text": accumulated_text, "done": False}) + "\n"
            
            # Send completion signal
            yield json.dumps({"text": "", "done": True}) + "\n"
            
        except Exception as e:
            print(f"Error in get_response: {str(e)}")  # Debug print
            yield json.dumps({"error": str(e), "done": True}) + "\n" 