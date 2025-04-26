import axios from "axios";
import * as FileSystem from "expo-file-system";
import { ASSEMBLYAI_API_KEY } from "@env";
import { Platform } from "react-native";

// AssemblyAI API key - Using environment variable for security
const API_KEY = ASSEMBLYAI_API_KEY;

// Determine the correct backend URL based on platform and environment
// NOTE: Replace YOUR_LOCAL_IP with your actual IP address for physical device testing
const getBackendUrl = () => {
  return "http://172.20.10.4:8000"
  // if (Platform.OS === "android") {
  //   // 10.0.2.2 is the special IP for Android emulator to reach host localhost
  //   return "http://10.0.2.2:8000";
  // } else if (Platform.OS === "ios") {
  //   // For iOS simulator, localhost works
  //   return "http://localhost:8000";
  // } else {
  //   // For physical devices, you need to use your computer's actual local IP
  //   // You can also set a specific DEV_MACHINE_IP in your .env file
  //   return "http://172.20.10.4:8000"; // Replace with your actual IP!
  // }
};

const BACKEND_API_URL = getBackendUrl();
console.log(`Using backend URL: ${BACKEND_API_URL}`);

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
        text: "I've been having some pain in my joints especially in the morning. It's been getting worse over the past few weeks.\n\nGood morning. How are you feeling today?\n\nI see. Let's talk about your symptoms in more detail. Are you experiencing any swelling or redness around the painful joints?\n\nYes especially in my fingers and wrists. They feel stiff for about an hour after I wake up.\n\nThat could indicate inflammatory arthritis. I'm going to recommend some blood tests to check for markers of inflammation and autoimmune conditions.",
        utterances: [
          {
            speaker: "B",
            text: "I've been having some pain in my joints especially in the morning. It's been getting worse over the past few weeks.",
          },
          {
            speaker: "A",
            text: "Good morning. How are you feeling today?",
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

  // Just use the raw transcription text without speaker labels
  let formattedText = transcription.text;
  let utterances = [];

  if (transcription.utterances && transcription.utterances.length > 0) {
    // Store utterances without speaker labels
    utterances = transcription.utterances.map((utterance) => ({
      text: utterance.text,
    }));

    // Just join the text without speaker labels
    formattedText = utterances.map((u) => u.text).join("\n\n");
  }

  return {
    text: formattedText,
    utterances,
  };
};

/**
 * Analyzes a transcription using Gemini AI via the backend API
 * @param {string} transcriptionText - The text to analyze
 * @param {boolean} useMockData - Optional flag to force using mock data (for testing)
 * @returns {Promise<object>} - The analysis results with key points
 */
export const analyzeTranscriptionWithGeminiAI = async (
  transcriptionText,
  useMockData = false
) => {
  // If mock data is explicitly requested, return it immediately
  if (useMockData === true) {
    console.log("Using mock Gemini AI analysis as requested");
    return {
      key_points:
        "• Patient reports joint pain, especially in the morning\n• Symptoms include swelling and stiffness in fingers and wrists\n• Doctor suspects inflammatory arthritis\n• Blood tests recommended to check for inflammation markers",
    };
  }

  try {
    console.log("Analyzing transcription with Gemini AI at:", BACKEND_API_URL);

    const response = await axios.post(
      `${BACKEND_API_URL}/analyze-transcription`,
      {
        transcription: transcriptionText,
      },
      {
        // Add timeout to prevent hanging requests
        timeout: 30000,
        // Add more detailed headers for debugging
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    console.log("Received Gemini AI analysis response");
    return response.data;
  } catch (error) {
    console.error("Error analyzing transcription with Gemini AI:", error);

    // Log more detailed error information for debugging
    if (error.response) {
      // The server responded with a status code outside the 2xx range
      console.error("Error response status:", error.response.status);
      console.error("Error response data:", error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error(
        "No response received from server. Request:",
        error.request
      );
      console.error(
        "Check if the backend server is running at:",
        BACKEND_API_URL
      );
    } else {
      // Something happened in setting up the request
      console.error("Error setting up request:", error.message);
    }

    // Only use fallback data if explicitly requested or if fallbacks aren't disabled
    if (useMockData !== false && __DEV__) {
      console.log("DEV MODE: Returning mock Gemini AI analysis as fallback");
      return {
        key_points:
          "• Patient reports joint pain, especially in the morning\n• Symptoms include swelling and stiffness in fingers and wrists\n• Doctor suspects inflammatory arthritis\n• Blood tests recommended to check for inflammation markers",
      };
    }

    throw error;
  }
};
