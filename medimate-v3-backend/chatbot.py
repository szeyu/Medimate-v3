import google.generativeai as genai
from typing import AsyncGenerator
import os
from dotenv import load_dotenv
import json

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
        
    def _chunk_response(self, text: str, chunk_size: int = 4) -> list[str]:
        """Split response into chunks of specified size."""
        return [text[i:i + chunk_size] for i in range(0, len(text), chunk_size)]
    
    def _extract_user_message(self, message: str) -> tuple[str, str]:
        """
        Extracts the user's actual message from the combined message with health context.
        Returns (user_health_context, user_message)
        """
        # Check if the message contains the user message pattern
        if "User message:" in message:
            # Split by the User message tag
            parts = message.split("User message:", 1)
            health_context = parts[0].strip()
            user_message = parts[1].strip()
            return health_context, user_message
        else:
            # If no pattern found, return empty context and the original message
            return "", message
    
    async def get_response(self, message: str) -> AsyncGenerator[str, None]:
        """Get streaming response from Gemini."""
        try:
            # Extract user health context if present
            health_context, user_message = self._extract_user_message(message)
            
            # Add AI assistant context
            ai_context = """You are a knowledgeable and empathetic wellness AI assistant. 
            You help users manage their health conditions, medications, and lifestyle choices.
            Keep responses focused on health and wellness topics.
            Be supportive but maintain professional medical boundaries.
            Always encourage users to consult healthcare providers for medical advice."""
            
            # Combine contexts for the model
            if health_context:
                context = f"{ai_context}\n\n{health_context}"
            else:
                context = ai_context
                
            # Generate response with the combined context
            response = self.chat.send_message(
                f"{context}\n\nUser message: {user_message}",
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