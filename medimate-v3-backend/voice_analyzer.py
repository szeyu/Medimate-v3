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
        # Create a simple Sequential model
        model = tf.keras.Sequential([
            tf.keras.layers.Dense(64, activation='relu', input_shape=(14,)),
            tf.keras.layers.Dropout(0.2),
            tf.keras.layers.Dense(32, activation='relu'),
            tf.keras.layers.Dropout(0.2),
            tf.keras.layers.Dense(1)  # Output layer for glucose level prediction
        ])
        
        model.compile(optimizer='adam',
                     loss='mse',
                     metrics=['mae'])
        
        self.model = model

    def extract_voice_features(self, voice_wav_path, f0min=75, f0max=500): # Renamed parameter
        """Extract acoustic features from a WAV voice file"""
        logger.info(f"Extracting features directly from WAV: {voice_wav_path}")

        # --- Add validation that input is WAV ---
        if not isinstance(voice_wav_path, str) or not voice_wav_path.lower().endswith('.wav'):
             logger.error(f"Input to extract_voice_features is not a valid WAV file path: {voice_wav_path}")
             raise ValueError("extract_voice_features expects a .wav file path.")
        # -----------------------------------------

        try:
            # Load the audio file (expects WAV)
            try:
                sound = parselmouth.Sound(voice_wav_path)
            except Exception as ps_load_err:
                 logger.error(f"Parselmouth failed to load sound from '{voice_wav_path}'. Check WAV file integrity.", exc_info=True)
                 raise Exception(f"Failed to load audio using parselmouth: {ps_load_err}") from ps_load_err

            # --- Add Validation ---
            duration = sound.get_total_duration()
            if duration <= 0.1: # Example threshold
                logger.warning(f"Audio duration is very short ({duration:.2f}s). Feature extraction might be unreliable or fail.")
            # --------------------

            # Extract features using parselmouth calls
            try:
                pitch = sound.to_pitch(pitch_floor=f0min, pitch_ceiling=f0max)
                point_process = call(sound, "To PointProcess (periodic, cc)", f0min, f0max)

                # Fundamental frequency
                pitch_values = pitch.selected_array['frequency']
                pitch_values = pitch_values[pitch_values != 0]
                meanF0 = np.mean(pitch_values) if len(pitch_values) > 0 else 0
                stdevF0 = np.std(pitch_values) if len(pitch_values) > 1 else 0

                # Intensity
                intensity = sound.to_intensity(minimum_pitch=f0min)
                intensity_values = intensity.values[0]
                meanI = np.mean(intensity_values) if len(intensity_values) > 0 else 0
                stdevI = np.std(intensity_values) if len(intensity_values) > 1 else 0

                # Harmonicity
                harmonicity = sound.to_harmonicity()
                hnr_values = harmonicity.values[harmonicity.values != -200] # Praat uses -200 for undefined
                meanHNR = np.mean(hnr_values) if len(hnr_values) > 0 else 0

                # Jitter
                localJitter = call(point_process, "Get jitter (local)", 0.0, 0.0, 0.0001, 0.02, 1.3)
                localabsoluteJitter = call(point_process, "Get jitter (local, absolute)", 0.0, 0.0, 0.0001, 0.02, 1.3)
                rapJitter = call(point_process, "Get jitter (rap)", 0.0, 0.0, 0.0001, 0.02, 1.3)
                ppq5Jitter = call(point_process, "Get jitter (ppq5)", 0.0, 0.0, 0.0001, 0.02, 1.3)

                # Shimmer
                localShimmer = call([sound, point_process], "Get shimmer (local)", 0.0, 0.0, 0.0001, 0.02, 1.3, 1.6)
                localdbShimmer = call([sound, point_process], "Get shimmer (local_dB)", 0.0, 0.0, 0.0001, 0.02, 1.3, 1.6)
                apq3Shimmer = call([sound, point_process], "Get shimmer (apq3)", 0.0, 0.0, 0.0001, 0.02, 1.3, 1.6)
                aqpq5Shimmer = call([sound, point_process], "Get shimmer (apq5)", 0.0, 0.0, 0.0001, 0.02, 1.3, 1.6)
                apq11Shimmer = call([sound, point_process], "Get shimmer (apq11)", 0.0, 0.0, 0.0001, 0.02, 1.3, 1.6)

            except Exception as praat_err:
                 logger.error(f"Error during Praat feature calculation via parselmouth on '{voice_wav_path}': {praat_err}", exc_info=True)
                 raise Exception(f"Failed during acoustic feature calculation: {praat_err}") from praat_err

            features = [
                meanF0, stdevF0, meanI, stdevI, meanHNR,
                localJitter, localabsoluteJitter, rapJitter, ppq5Jitter,
                localShimmer, localdbShimmer, apq3Shimmer, aqpq5Shimmer, apq11Shimmer
            ]

            # Check for NaN or infinite values and replace with 0
            features = np.nan_to_num(np.array(features), nan=0.0, posinf=0.0, neginf=0.0)
            if np.any(np.isnan(features)) or np.any(np.isinf(features)):
                 # This should ideally not happen after nan_to_num
                 logger.error(f"Invalid feature values (NaN/Inf) detected AFTER nan_to_num: {features}")
                 raise ValueError("Invalid feature values detected (NaN or infinite) after processing.")

            logger.info(f"Successfully extracted features from {voice_wav_path}")
            return features

        except Exception as e:
            logger.error(f"Error in feature extraction pipeline for '{voice_wav_path}': {e}", exc_info=True)
            logger.error(traceback.format_exc())
            # Re-raise the exception so it's caught by the endpoint handler
            raise Exception(f"Error extracting voice features from WAV: {e}") from e

    def train_model(self, X_train, y_train, epochs=50):
        """Train the model with voice features and glucose levels"""
        self.model.fit(X_train, y_train, epochs=epochs, validation_split=0.2)

    def normalize_prediction(self, raw_prediction):
        """
        Normalize the raw prediction to a realistic glucose range
        Returns the normalized prediction and a confidence score
        """
        # If the raw prediction is already in a reasonable glucose range, use it directly
        if self.min_glucose <= raw_prediction <= self.max_glucose:
            glucose = raw_prediction
        else:
            # Calculate relative position of prediction in the output range
            min_pred = -10  # approximate minimum prediction from model
            max_pred = 10   # approximate maximum prediction from model
            
            # Normalize to 0-1 range
            normalized = (raw_prediction - min_pred) / (max_pred - min_pred)
            
            # Map to glucose range
            glucose = normalized * (self.max_glucose - self.min_glucose) + self.min_glucose
        
        # Clip to ensure prediction stays within realistic bounds
        glucose = np.clip(glucose, self.min_glucose, self.max_glucose)
        
        # Calculate confidence score based on distance from normal range
        if self.normal_range[0] <= glucose <= self.normal_range[1]:
            confidence = 0.9  # High confidence for normal range
        else:
            # Lower confidence for values further from normal range
            distance = min(abs(glucose - self.normal_range[0]), 
                         abs(glucose - self.normal_range[1]))
            confidence = max(0.5, 0.9 - (distance / 100))
        
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