import axios from "axios";
import * as FileSystem from "expo-file-system";
import { ASSEMBLYAI_API_KEY } from "@env";

// AssemblyAI API key - Using environment variable for security
const API_KEY = ASSEMBLYAI_API_KEY;

// Backend API URL - Should match your backend server
const BACKEND_API_URL = "http://0.0.0.0:8000"; // Update this to your backend URL or IP address

/**
 * Uploads an audio file to AssemblyAI for transcription
 * @param {string} audioUri - The local URI of the audio file to transcribe
 * @returns {Promise<object>} - The transcription result
 */
export const transcribeAudio = async (audioUri) => {
  try {
    console.log("Starting transcription for:", audioUri);

    // Step 1: Upload the audio file to AssemblyAI
    const uploadUrl = await uploadAudioFile(audioUri);
    if (!uploadUrl) {
      throw new Error("Failed to upload audio file");
    }

    // Step 2: Submit the transcription request and poll for results
    const transcription = await createAndWaitForTranscription(uploadUrl);
    return transcription;
  } catch (error) {
    console.error("Transcription error:", error);
    throw error;
  }
};

/**
 * Uploads an audio file to AssemblyAI's temporary storage
 * @param {string} audioUri - The local URI of the audio file
 * @returns {Promise<string>} - The upload URL
 */
const uploadAudioFile = async (audioUri) => {
  try {
    // Check if file exists
    const fileInfo = await FileSystem.getInfoAsync(audioUri);
    if (!fileInfo.exists) {
      throw new Error("Audio file does not exist");
    }

    // Upload directly using FileSystem.uploadAsync
    const response = await FileSystem.uploadAsync(
      "https://api.assemblyai.com/v2/upload",
      audioUri,
      {
        fieldName: "file",
        httpMethod: "POST",
        uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
        headers: {
          authorization: API_KEY,
        },
      }
    );

    if (response.status >= 300) {
      console.error("Upload response:", response);
      throw new Error(`Upload failed with status ${response.status}`);
    }

    const responseData = JSON.parse(response.body);
    console.log("Upload successful:", responseData);
    return responseData.upload_url;
  } catch (error) {
    console.error("Error uploading audio file:", error);

    // For development: simulate success to test the flow
    if (__DEV__) {
      console.log("DEV MODE: Simulating successful upload");
      return "https://example-upload-url.assemblyai.com/audio.m4a";
    }

    throw error;
  }
};

/**
 * Creates a transcription request and waits for it to complete
 * @param {string} audioUrl - The URL of the uploaded audio file
 * @returns {Promise<object>} - The completed transcription
 */
const createAndWaitForTranscription = async (audioUrl) => {
  try {
    // Submit transcription request with updated parameters based on latest API docs
    const response = await axios.post(
      "https://api.assemblyai.com/v2/transcript",
      {
        audio_url: audioUrl,
        speaker_labels: true, // Enable speaker diarization for medical conversations
      },
      {
        headers: {
          authorization: API_KEY,
          "content-type": "application/json",
        },
      }
    );

    console.log("Transcription request submitted:", response.data);
    const transcriptId = response.data.id;

    if (!transcriptId) {
      throw new Error("No transcript ID returned from API");
    }

    // Poll for the transcription result
    return await pollForTranscriptionResult(transcriptId);
  } catch (error) {
    console.error("Error in transcription process:", error);

    // Log more details about the error for debugging
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
    }

    // For development: simulate success to test the flow
    if (__DEV__) {
      console.log("DEV MODE: Simulating successful transcription");
      return {
        status: "completed",
        text: "Doctor: Good morning. How are you feeling today?\n\nPatient: I've been having some pain in my joints especially in the morning. It's been getting worse over the past few weeks.\n\nDoctor: I see. Let's talk about your symptoms in more detail. Are you experiencing any swelling or redness around the painful joints?\n\nPatient: Yes especially in my fingers and wrists. They feel stiff for about an hour after I wake up.\n\nDoctor: That could indicate inflammatory arthritis. I'm going to recommend some blood tests to check for markers of inflammation and autoimmune conditions.",
        utterances: [
          { speaker: "A", text: "Good morning. How are you feeling today?" },
          {
            speaker: "B",
            text: "I've been having some pain in my joints especially in the morning. It's been getting worse over the past few weeks.",
          },
          {
            speaker: "A",
            text: "I see. Let's talk about your symptoms in more detail. Are you experiencing any swelling or redness around the painful joints?",
          },
          {
            speaker: "B",
            text: "Yes especially in my fingers and wrists. They feel stiff for about an hour after I wake up.",
          },
          {
            speaker: "A",
            text: "That could indicate inflammatory arthritis. I'm going to recommend some blood tests to check for markers of inflammation and autoimmune conditions.",
          },
        ],
      };
    }

    throw error;
  }
};

/**
 * Polls for the transcription result
 * @param {string} transcriptId - The ID of the transcription to poll for
 * @returns {Promise<object>} - The transcription result
 */
const pollForTranscriptionResult = async (transcriptId) => {
  const pollingEndpoint = `https://api.assemblyai.com/v2/transcript/${transcriptId}`;
  const maxRetries = 30; // Maximum number of retries
  const pollingInterval = 3000; // 3 seconds

  let transcript = null;
  let retries = 0;

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  while (retries < maxRetries) {
    try {
      const response = await axios.get(pollingEndpoint, {
        headers: {
          authorization: API_KEY,
        },
      });

      transcript = response.data;

      if (["completed", "error"].includes(transcript.status)) {
        break;
      }

      // If not complete, wait and try again
      console.log(`Transcription status: ${transcript.status}, waiting...`);
      await delay(pollingInterval);
      retries++;
    } catch (error) {
      console.error("Error polling for transcription result:", error);
      throw error;
    }
  }

  if (transcript.status === "error") {
    throw new Error(`Transcription failed: ${transcript.error}`);
  }

  if (!transcript || transcript.status !== "completed") {
    throw new Error("Transcription timed out");
  }

  console.log("Transcription completed successfully");
  return transcript;
};

/**
 * Process the transcription data to extract useful information
 * @param {object} transcription - The transcription result from AssemblyAI
 * @returns {object} - Processed transcription data with text and speakers
 */
export const processTranscriptionData = (transcription) => {
  if (!transcription || !transcription.text) {
    return {
      text: "",
      utterances: [],
    };
  }

  // Format the transcription with speaker labels if available
  let formattedText = transcription.text;
  let utterances = [];

  if (transcription.utterances && transcription.utterances.length > 0) {
    utterances = transcription.utterances.map((utterance) => ({
      speaker: utterance.speaker === "A" ? "Doctor" : "Patient",
      text: utterance.text,
    }));

    // Create a formatted text with speaker labels
    formattedText = utterances
      .map((u) => `${u.speaker}: ${u.text}`)
      .join("\n\n");
  }

  return {
    text: formattedText,
    utterances,
  };
};

/**
 * Analyzes a transcription using Gemini AI via the backend API
 * @param {string} transcriptionText - The text to analyze
 * @returns {Promise<object>} - The analysis results with key points
 */
export const analyzeTranscriptionWithGeminiAI = async (transcriptionText) => {
  try {
    console.log("Analyzing transcription with Gemini AI");

    const response = await axios.post(
      `${BACKEND_API_URL}/analyze-transcription`,
      {
        transcription: transcriptionText,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error analyzing transcription with Gemini AI:", error);

    // For development: provide a fallback for testing
    if (__DEV__) {
      console.log("DEV MODE: Returning mock Gemini AI analysis");
      return {
        key_points:
          "• Patient reports joint pain, especially in the morning\n• Symptoms include swelling and stiffness in fingers and wrists\n• Doctor suspects inflammatory arthritis\n• Blood tests recommended to check for inflammation markers",
      };
    }

    throw error;
  }
};
