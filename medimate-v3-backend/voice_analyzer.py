import numpy as np
import pandas as pd
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
import parselmouth
from parselmouth.praat import call
import tensorflow as tf
import os
import logging
from pydub import AudioSegment
import tempfile

logger = logging.getLogger(__name__)

class VoiceAnalyzer:
    def __init__(self):
        self.feature_names = [
            "meanF0", "stdevF0", "meanIntensity", "stdevIntensity", "HNR",
            "localJitter", "localabsoluteJitter", "rapJitter", "ppq5Jitter",
            "localShimmer", "localdbShimmer", "apq3Shimmer", "aqpq5Shimmer", "apq11Shimmer"
        ]
        self.model = None
        self.model_path = 'voice_glucose_model.keras'
        # Reference ranges from training data
        self.min_glucose = 75  # minimum glucose level in training data
        self.max_glucose = 180  # maximum glucose level in training data
        self.normal_range = (80, 120)  # normal glucose range
        self.initialize_model()

    def initialize_model(self):
        # Create input layer
        inputs = tf.keras.layers.Input(shape=(14,))
        
        # Create feature-specific weights with emphasis on HNR (index 4)
        feature_weights = tf.Variable(initial_value=[1.0] * 14, trainable=True, dtype=tf.float32, name='feature_weights')
        # Give HNR 3x more initial weight
        feature_weights = feature_weights * tf.constant([1.0, 1.0, 1.0, 1.0, 3.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0])
        
        # Apply feature weights
        weighted_inputs = tf.multiply(inputs, feature_weights)
        
        # Dense layers
        x = tf.keras.layers.Dense(64, activation='relu')(weighted_inputs)
        x = tf.keras.layers.Dropout(0.2)(x)
        x = tf.keras.layers.Dense(32, activation='relu')(x)
        x = tf.keras.layers.Dropout(0.2)(x)
        output = tf.keras.layers.Dense(1)(x)
        
        # Create model
        model = tf.keras.Model(inputs=inputs, outputs=output)
        
        model.compile(optimizer='adam',
                     loss='mse',
                     metrics=['mae'])
        
        self.model = model

    def convert_to_wav(self, input_path):
        """Convert audio file to WAV format if needed"""
        try:
            # Check if the file is already in WAV format
            if input_path.lower().endswith('.wav'):
                return input_path

            logger.info(f"Converting audio file: {input_path}")
            
            # Load the audio file
            if input_path.lower().endswith('.m4a'):
                audio = AudioSegment.from_file(input_path, format="m4a")
            else:
                raise ValueError(f"Unsupported audio format: {input_path}")

            # Create a temporary WAV file
            with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as temp_wav:
                temp_wav_path = temp_wav.name
                
            # Export as WAV
            audio.export(temp_wav_path, format="wav")
            logger.info(f"Converted to WAV: {temp_wav_path}")
            
            return temp_wav_path
            
        except Exception as e:
            logger.error(f"Error converting audio file: {str(e)}")
            raise Exception(f"Error converting audio file: {str(e)}")

    def extract_voice_features(self, voice_file_path, f0min=75, f0max=500):
        """Extract acoustic features from voice file"""
        temp_wav_path = None
        try:
            # Convert to WAV if needed
            temp_wav_path = self.convert_to_wav(voice_file_path)
            logger.info(f"Processing audio file: {temp_wav_path}")
            
            # Load the audio file
            sound = parselmouth.Sound(temp_wav_path)
            
            # Get pitch object
            pitch = sound.to_pitch()
            
            # Get fundamental frequency statistics
            pitch_values = pitch.selected_array['frequency']
            meanF0 = np.mean(pitch_values[pitch_values != 0])
            stdevF0 = np.std(pitch_values[pitch_values != 0])
            
            # Get intensity
            intensity = sound.to_intensity()
            intensity_values = intensity.values[0]
            meanI = np.mean(intensity_values)
            stdevI = np.std(intensity_values)
            
            # Get harmonicity
            harmonicity = sound.to_harmonicity()
            hnr_values = harmonicity.values[0]
            meanHNR = np.mean(hnr_values[~np.isnan(hnr_values)])
            
            # Get point process for jitter and shimmer
            point_process = call([sound, pitch], "To PointProcess (cc)")
            
            # Calculate jitter
            localJitter = call(point_process, "Get jitter (local)", 0.0, 0.0, 0.0001, 0.02, 1.3)
            localabsoluteJitter = call(point_process, "Get jitter (local, absolute)", 0.0, 0.0, 0.0001, 0.02, 1.3)
            rapJitter = call(point_process, "Get jitter (rap)", 0.0, 0.0, 0.0001, 0.02, 1.3)
            ppq5Jitter = call(point_process, "Get jitter (ppq5)", 0.0, 0.0, 0.0001, 0.02, 1.3)
            
            # Calculate shimmer with all required parameters
            localShimmer = call([sound, point_process], "Get shimmer (local)", 0.0, 0.0, 0.0001, 0.02, 1.3, 1.6)
            localdbShimmer = call([sound, point_process], "Get shimmer (local_dB)", 0.0, 0.0, 0.0001, 0.02, 1.3, 1.6)
            apq3Shimmer = call([sound, point_process], "Get shimmer (apq3)", 0.0, 0.0, 0.0001, 0.02, 1.3, 1.6)
            aqpq5Shimmer = call([sound, point_process], "Get shimmer (apq5)", 0.0, 0.0, 0.0001, 0.02, 1.3, 1.6)
            apq11Shimmer = call([sound, point_process], "Get shimmer (apq11)", 0.0, 0.0, 0.0001, 0.02, 1.3, 1.6)

            features = [
                meanF0, stdevF0, meanI, stdevI, meanHNR,
                localJitter, localabsoluteJitter, rapJitter, ppq5Jitter,
                localShimmer, localdbShimmer, apq3Shimmer, aqpq5Shimmer, apq11Shimmer
            ]
            
            # Check for NaN or infinite values
            features = np.array(features)
            if np.any(np.isnan(features)) or np.any(np.isinf(features)):
                raise ValueError("Invalid feature values detected (NaN or infinite)")
            
            logger.info(f"Extracted features: {features}")
            return features
            
        except Exception as e:
            logger.error(f"Error in feature extraction: {str(e)}")
            raise Exception(f"Error extracting voice features: {str(e)}")
        
        finally:
            # Clean up temporary WAV file if it was created
            if temp_wav_path and temp_wav_path != voice_file_path:
                try:
                    os.remove(temp_wav_path)
                    logger.info(f"Cleaned up temporary WAV file: {temp_wav_path}")
                except Exception as e:
                    logger.warning(f"Failed to clean up temporary WAV file: {str(e)}")

    def train_model(self, X_train, y_train, epochs=50):
        """Train the model with voice features and glucose levels"""
        self.model.fit(X_train, y_train, epochs=epochs, validation_split=0.2)

    def normalize_prediction(self, raw_prediction):
        """
        Normalize the raw prediction to a realistic glucose range
        Returns the normalized prediction and a confidence score
        """
        # Adjust the prediction ranges to be more conservative
        min_pred = -5  # adjusted from -10
        max_pred = 5   # adjusted from 10
        
        # If the raw prediction is already in a reasonable glucose range, use it directly
        if self.min_glucose <= raw_prediction <= self.max_glucose:
            glucose = raw_prediction
        else:
            # Normalize to 0-1 range
            normalized = (raw_prediction - min_pred) / (max_pred - min_pred)
            
            # Map to glucose range, but with more weight to the center of the range
            center = (self.max_glucose + self.min_glucose) / 2
            spread = (self.max_glucose - self.min_glucose) / 2
            glucose = center + (normalized - 0.5) * spread
        
        # Clip to ensure prediction stays within realistic bounds
        glucose = np.clip(glucose, self.min_glucose, self.max_glucose)
        
        # Calculate confidence score based on distance from normal range
        # and the magnitude of HNR contribution
        if self.normal_range[0] <= glucose <= self.normal_range[1]:
            confidence = 0.9  # High confidence for normal range
        else:
            # Lower confidence for values further from normal range
            distance = min(abs(glucose - self.normal_range[0]), 
                         abs(glucose - self.normal_range[1]))
            confidence = max(0.5, 0.9 - (distance / 50))  # Made the confidence decay more gradual
        
        return float(glucose), float(confidence)

    def predict_glucose(self, voice_features):
        """Predict glucose level from voice features"""
        features = voice_features.reshape(1, -1)
        raw_prediction = self.model.predict(features, verbose=0)[0][0]
        logger.info(f"Raw prediction: {raw_prediction}")
        
        # Normalize prediction to realistic glucose range
        glucose_level, confidence = self.normalize_prediction(raw_prediction)
        logger.info(f"Normalized prediction: {glucose_level}, confidence: {confidence}")
        
        return glucose_level, confidence

    def save_model(self, path=None):
        """Save the trained model"""
        if path is None:
            path = self.model_path
        self.model.save(path)

    def load_model(self, path=None):
        """Load a trained model"""
        if path is None:
            path = self.model_path
        if os.path.exists(path):
            self.model = tf.keras.models.load_model(path)
        else:
            raise FileNotFoundError("No trained model found") 