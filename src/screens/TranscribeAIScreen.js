import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
  Animated,
  Easing,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Audio } from "expo-av";
import {
  transcribeAudio,
  processTranscriptionData,
  analyzeTranscriptionWithGeminiAI,
} from "../services/TranscriptionService";
// import * as Clipboard from 'expo-clipboard';

const TranscribeAIScreen = ({ navigation, route }) => {
  // Audio recording states
  const [recording, setRecording] = useState(null);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const [stage, setStage] = useState("initial"); // initial, recording, processing, result, saving
  const [transcription, setTranscription] = useState("");
  const [displayedTranscription, setDisplayedTranscription] = useState("");
  const [summary, setSummary] = useState({
    title: "",
    keyPoints: [],
    medications: [],
    followUp: "",
  });
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date());
  const [isCopied, setIsCopied] = useState(false);
  const [isStoppingRecording, setIsStoppingRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioPermission, setAudioPermission] = useState(false);
  const [recordingUri, setRecordingUri] = useState(null);
  const [transcriptionError, setTranscriptionError] = useState(null);

  // Ref for recording timer
  const recordingTimerRef = useRef(null);

  // Refs for ScrollViews
  const recordingScrollViewRef = useRef(null);
  const resultScrollViewRef = useRef(null);

  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveAnim1 = useRef(new Animated.Value(0)).current;
  const waveAnim2 = useRef(new Animated.Value(0)).current;
  const waveAnim3 = useRef(new Animated.Value(0)).current;

  // Request audio recording permission when component mounts
  useEffect(() => {
    const requestPermission = async () => {
      try {
        const { status } = await Audio.requestPermissionsAsync();
        setAudioPermission(status === "granted");

        if (status !== "granted") {
          Alert.alert(
            "Permission Required",
            "To use this feature, please allow access to your microphone.",
            [{ text: "OK" }]
          );
        } else {
          // Configure audio mode for recording
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
            staysActiveInBackground: false,
            shouldDuckAndroid: true,
          });
        }
      } catch (error) {
        console.error("Error requesting microphone permission:", error);
        Alert.alert("Error", "Could not request microphone permission");
      }
    };

    requestPermission();

    // Cleanup function for audio mode
    return () => {
      Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: false,
      });
    };
  }, []);

  // Clean up timeouts and audio objects when component unmounts
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }

      // Also make sure to stop any ongoing recording
      if (recording) {
        recording.stopAndUnloadAsync();
      }

      // Unload any playing audio
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [recording, sound]);

  // Auto-scroll to bottom when transcription updates during recording
  useEffect(() => {
    if (recordingScrollViewRef.current && stage === "recording") {
      setTimeout(() => {
        recordingScrollViewRef.current.scrollToEnd({ animated: true });
      }, 50);
    }
  }, [displayedTranscription, stage]);

  // Start recording animations
  useEffect(() => {
    let pulseAnimation;

    if (stage === "recording") {
      // Pulse animation
      pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );

      // Sound wave animations - using only transform properties
      Animated.loop(
        Animated.sequence([
          Animated.timing(waveAnim1, {
            toValue: 1,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(waveAnim1, {
            toValue: 0,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(waveAnim2, {
            toValue: 1,
            duration: 900,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(waveAnim2, {
            toValue: 0,
            duration: 900,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(waveAnim3, {
            toValue: 1,
            duration: 700,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(waveAnim3, {
            toValue: 0,
            duration: 700,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();

      pulseAnimation.start();

      // Timer for recording duration
      let seconds = 0;
      recordingTimerRef.current = setInterval(() => {
        seconds++;
        setRecordingDuration(seconds);
      }, 1000);

      return () => {
        pulseAnimation && pulseAnimation.stop();
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
          recordingTimerRef.current = null;
        }
      };
    }
  }, [stage]);

  // Format seconds to MM:SS format
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const handleStartRecording = async () => {
    if (!audioPermission) {
      Alert.alert(
        "Permission Required",
        "To use this feature, please allow access to your microphone.",
        [{ text: "OK" }]
      );
      return;
    }

    try {
      // Create new recording instance
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(newRecording);

      setStage("recording");
      setDisplayedTranscription("");
      setIsStoppingRecording(false);
      setRecordingDuration(0);
    } catch (error) {
      console.error("Error starting recording:", error);
      Alert.alert(
        "Recording Error",
        "Could not start recording. Please try again."
      );
    }
  };

  const handleStopRecording = async () => {
    // Prevent multiple calls to stop recording
    if (isStoppingRecording || !recording) return;

    // Clear the timer interval
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    setIsStoppingRecording(true);

    try {
      // Stop the recording
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log("Recording saved at:", uri);
      setRecordingUri(uri);
      setRecording(null);

      // Move to processing stage
      setStage("processing");
      setIsTranscribing(true);
      setTranscriptionError(null);

      // Send the audio file to AssemblyAI for transcription
      try {
        const transcriptResult = await transcribeAudio(uri);
        console.log("Transcription result:", transcriptResult);

        const processedTranscription =
          processTranscriptionData(transcriptResult);

        // Update the UI with the transcription results
        setTranscription(processedTranscription.text);

        // Process the transcription with Gemini AI
        if (processedTranscription.text) {
          // Set initial summary values with a title
          setSummary({
            title: "Medical Consultation Summary",
            keyPoints: [],
            medications: [],
            followUp: "",
          });

          // Call Gemini AI to analyze the transcription
          await analyzeTranscriptionWithAI(processedTranscription.text);
        }

        setStage("result");
        setIsTranscribing(false);
      } catch (error) {
        console.error("Transcription error:", error);
        setTranscriptionError("Failed to transcribe audio. Please try again.");
        Alert.alert(
          "Transcription Error",
          "Could not transcribe the recording. Please try again."
        );
        setStage("result"); // Still go to result to show the error
        setIsTranscribing(false);
      }
    } catch (error) {
      console.error("Error stopping recording:", error);
      Alert.alert(
        "Recording Error",
        "Could not save the recording. Please try again."
      );
      setIsStoppingRecording(false);
      setStage("initial");
      setRecording(null);
    }
  };

  // Helper function to generate a basic summary from transcription text
  const generateBasicSummary = (text) => {
    // Basic extraction of medication names (this would be replaced by actual AI processing)
    const medicationPatterns = [
      /\b(?:advil|tylenol|aspirin|ibuprofen|paracetamol|acetaminophen)\b/gi,
      /\b\d+\s*mg\b/g,
    ];

    let medications = [];

    // Extract potential medications
    for (const pattern of medicationPatterns) {
      const matches = text.match(pattern);
      if (matches) {
        medications = [...medications, ...matches];
      }
    }

    // Find sentences that might be important (containing key medical terms)
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const keyPoints = sentences
      .filter((sentence) =>
        /pain|symptom|test|recommend|treatment|diagnosis|condition/i.test(
          sentence
        )
      )
      .slice(0, 3)
      .map((s) => s.trim());

    // Extract potential follow-up instructions
    const followUpInfo = text.match(
      /(?:follow[\s-]up|come back|return|next appointment).{3,50}/i
    );

    setSummary({
      title: "Medical Consultation Summary",
      keyPoints: keyPoints.length > 0 ? keyPoints : [],
      medications: medications.length > 0 ? [...new Set(medications)] : [],
      followUp: followUpInfo ? followUpInfo[0].trim() : "",
    });
  };

  // Helper function to analyze the transcription using Gemini AI
  const analyzeTranscriptionWithAI = async (text) => {
    try {
      console.log("Sending transcription to Gemini AI for analysis...");

      // Call the Gemini AI API via our backend, explicitly avoiding mock data
      const analysisResult = await analyzeTranscriptionWithGeminiAI(
        text,
        false
      ); // false = don't use mock data

      console.log("Received Gemini AI analysis:", analysisResult);

      // Update the summary with AI-generated key points
      if (analysisResult && analysisResult.key_points) {
        // Just use the exact output from Gemini AI without modification
        setSummary((prevSummary) => ({
          ...prevSummary,
          keyPoints: [analysisResult.key_points], // Wrap in array to preserve formatting
        }));
      } else {
        console.warn("No key_points found in Gemini AI response");
        // If response doesn't contain expected data, fall back to basic generation
        generateBasicSummary(text);
      }
    } catch (error) {
      console.error("Error analyzing transcription with AI:", error);
      // If AI analysis fails, fall back to basic summary generation
      generateBasicSummary(text);
    }
  };

  const handlePlayRecording = async () => {
    try {
      // Unload any existing sound first
      if (sound) {
        await sound.unloadAsync();
      }

      // Check if we have a recording URI
      if (!recordingUri) {
        Alert.alert("Error", "No recording available to play");
        return;
      }

      console.log("Loading sound from:", recordingUri);

      // Load the recording
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: recordingUri },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );

      setSound(newSound);
      setIsPlaying(true);

      // Play the sound
      await newSound.playAsync();
    } catch (error) {
      console.error("Error playing audio:", error);
      Alert.alert("Playback Error", "Could not play the recording");
      setIsPlaying(false);
    }
  };

  const handleStopPlayback = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
  };

  // Handle audio playback status updates
  const onPlaybackStatusUpdate = (status) => {
    if (status.didJustFinish) {
      setIsPlaying(false);
    }
  };

  const handleSave = () => {
    setStage("saving");
  };

  const handleConfirmSave = () => {
    if (!title) {
      Alert.alert("Error", "Please enter a title for this transcription");
      return;
    }

    // Here you would typically save the data to your backend or local storage
    Alert.alert("Success", "Your transcription has been saved successfully!", [
      {
        text: "OK",
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  const handleNewRecording = () => {
    setStage("initial");
    setDisplayedTranscription("");
    setTranscription("");
    setSummary({
      title: "",
      keyPoints: [],
      medications: [],
      followUp: "",
    });
    setTitle("");
    setIsCopied(false);
    setIsStoppingRecording(false);
    setRecordingUri(null);
  };

  const handleCopyToClipboard = async () => {
    const summaryText = `
      ${summary.title}
      
      Key Points:
      ${summary.keyPoints.map((point) => `• ${point}`).join("\n")}
      
      Medications:
      ${summary.medications.map((med) => `• ${med}`).join("\n")}
      
      Follow-up:
      ${summary.followUp}
    `;

    // In a real implementation, you would use Clipboard.setStringAsync(summaryText)
    // await Clipboard.setStringAsync(summaryText);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  // Custom App Bar component
  const CustomAppBar = ({ navigation, title }) => (
    <View style={styles.appBar}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>
      <Text style={styles.appBarTitle}>{title}</Text>
      <View style={styles.appBarRight}>
        {/* You can add right-side icons here if needed */}
      </View>
    </View>
  );

  // Render the initial screen with start recording button
  const renderInitialScreen = () => (
    <View style={styles.initialContainer}>
      <View style={styles.initialContent}>
        <Text style={styles.initialTitle}>
          Transcribe Medical Conversations
        </Text>
        <Text style={styles.initialDescription}>
          Record and transcribe your medical conversations to get AI-powered
          summaries and key points.
        </Text>
      </View>

      <View style={styles.buttonSafeArea}>
        <TouchableOpacity
          style={styles.startRecordingButton}
          onPress={handleStartRecording}
        >
          <Icon name="mic" size={24} color="#FFFFFF" />
          <Text style={styles.startRecordingText}>Start Recording</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render the recording screen with waveform animation
  const renderRecordingScreen = () => (
    <View style={styles.recordingContainer}>
      <View style={styles.recordingHeader}>
        <Text style={styles.recordingTitle}>Recording...</Text>
        <Text style={styles.recordingTimer}>
          {formatTime(recordingDuration)}
        </Text>
      </View>

      <View style={styles.waveformContainer}>
        <Animated.View
          style={[
            styles.recordingCircle,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <Icon name="mic" size={32} color="#FFFFFF" />
        </Animated.View>

        <View style={styles.waveformWrapper}>
          <Animated.View
            style={[
              styles.waveformBar,
              {
                transform: [{ scaleY: waveAnim1 }, { translateY: 0 }],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.waveformBar,
              {
                transform: [{ scaleY: waveAnim2 }, { translateY: 0 }],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.waveformBar,
              {
                transform: [{ scaleY: waveAnim3 }, { translateY: 0 }],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.waveformBar,
              {
                transform: [{ scaleY: waveAnim1 }, { translateY: 0 }],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.waveformBar,
              {
                transform: [{ scaleY: waveAnim2 }, { translateY: 0 }],
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.transcriptionPreviewContainer}>
        <Text style={styles.transcriptionPreviewTitle}>
          Transcription Preview
        </Text>
        <ScrollView
          ref={recordingScrollViewRef}
          style={styles.transcriptionPreviewContent}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <Text style={styles.transcriptionPreviewText}>
            {displayedTranscription ||
              "The transcription will appear here while recording..."}
          </Text>
        </ScrollView>
      </View>

      <View style={styles.buttonSafeArea}>
        <TouchableOpacity
          style={styles.stopRecordingButton}
          onPress={handleStopRecording}
          disabled={isStoppingRecording}
        >
          <Icon name="stop" size={24} color="#FFFFFF" />
          <Text style={styles.stopRecordingText}>Stop Recording</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render the processing screen with loading indicator
  const renderProcessingScreen = () => (
    <View style={styles.processingContainer}>
      <ActivityIndicator size="large" color="#1167FE" />
      <Text style={styles.processingText}>
        {isTranscribing
          ? "Transcribing your audio... This may take a minute."
          : "Processing your recording..."}
      </Text>
    </View>
  );

  // Render the result screen with summary and transcription
  const renderResultScreen = () => (
    <ScrollView
      ref={resultScrollViewRef}
      style={styles.resultContainer}
      showsVerticalScrollIndicator={true}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      {/* Improved header arrangement with title */}
      <View style={styles.resultHeader}>
        <Text style={styles.resultTitle}>
          {summary.title || "Transcription Result"}
        </Text>
      </View>

      {/* Controls in a row */}
      <View style={styles.controlsContainer}>
        {/* Audio playback control - shorter button */}
        <TouchableOpacity
          style={styles.playButton}
          onPress={isPlaying ? handleStopPlayback : handlePlayRecording}
        >
          <Icon
            name={isPlaying ? "stop" : "play-arrow"}
            size={20}
            color="#FFFFFF"
          />
          <Text style={styles.playButtonText}>
            {isPlaying ? "Stop" : "Play"}
          </Text>
        </TouchableOpacity>

        {/* Copy button */}
        <TouchableOpacity
          style={[styles.copyButton, isCopied ? styles.copiedButton : null]}
          onPress={handleCopyToClipboard}
        >
          <Icon
            name={isCopied ? "check" : "content-copy"}
            size={16}
            color={isCopied ? "#FFFFFF" : "#1167FE"}
          />
          <Text
            style={[
              styles.copyButtonText,
              isCopied ? styles.copiedButtonText : null,
            ]}
          >
            {isCopied ? "Copied!" : "Copy Summary"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Key Points Section with proper box */}
      <View style={styles.summarySection}>
        <Text style={styles.sectionTitle}>Key Points</Text>
        {summary.keyPoints && summary.keyPoints.length > 0 ? (
          summary.keyPoints.map((point, index) => (
            <View key={index} style={styles.keyPointItem}>
              <Icon
                name="check-circle"
                size={16}
                color="#4CAF50"
                style={styles.keyPointIcon}
              />
              <Text style={styles.keyPointText}>{point}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No key points available yet.</Text>
        )}
      </View>

      {/* Full Transcription Section */}
      <View style={styles.transcriptionSection}>
        <View style={styles.transcriptionHeader}>
          <Text style={styles.transcriptionTitle}>Full Transcription</Text>
        </View>
        <ScrollView
          style={styles.transcriptionContent}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={true}
        >
          {transcription ? (
            <Text style={styles.transcriptionFullText}>{transcription}</Text>
          ) : transcriptionError ? (
            <Text style={styles.errorText}>{transcriptionError}</Text>
          ) : (
            <Text style={styles.emptyText}>
              Transcription will appear here when available.
            </Text>
          )}
        </ScrollView>
      </View>

      <View style={styles.buttonSafeArea}>
        <View style={styles.resultActions}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Icon name="save" size={24} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>Save Transcription</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.newRecordingButton}
            onPress={handleNewRecording}
          >
            <Icon name="mic" size={24} color="#666666" />
            <Text style={styles.newRecordingText}>New Recording</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  // Render the saving screen with form
  const renderSavingScreen = () => (
    <View style={styles.savingContainer}>
      <View style={styles.saveForm}>
        <Text style={styles.saveTitle}>Save Transcription</Text>

        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Title</Text>
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter a title for this transcription"
          />
        </View>

        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Date</Text>
          <View style={styles.dateField}>
            <Icon name="event" size={20} color="#666666" />
            <Text style={styles.dateText}>
              {date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonSafeArea}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirmSave}
        >
          <Text style={styles.confirmButtonText}>Save Transcription</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <CustomAppBar navigation={navigation} title="Transcribe AI" />

      {stage === "initial" && renderInitialScreen()}
      {stage === "recording" && renderRecordingScreen()}
      {stage === "processing" && renderProcessingScreen()}
      {stage === "result" && renderResultScreen()}
      {stage === "saving" && renderSavingScreen()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // ... existing styles ...

  // Add a new style for empty state messages
  emptyText: {
    fontSize: 14,
    color: "#999999",
    fontStyle: "italic",
    marginVertical: 8,
  },

  // Add a new style for error text
  errorText: {
    fontSize: 14,
    color: "#FF5252",
    marginVertical: 8,
  },

  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  appBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    height: 56,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  backButton: {
    padding: 8,
  },
  appBarTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
  appBarRight: {
    width: 40,
  },
  initialContainer: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
    paddingBottom: 100,
  },
  initialContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  illustration: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
  initialTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 16,
    textAlign: "center",
  },
  initialDescription: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 24,
  },
  buttonSafeArea: {
    marginBottom: 30,
  },
  startRecordingButton: {
    backgroundColor: "#1167FE",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 8,
  },
  startRecordingText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  recordingContainer: {
    flex: 1,
    padding: 16,
    paddingBottom: 100,
  },
  recordingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  recordingTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
  },
  recordingTimer: {
    fontSize: 16,
    color: "#FF5252",
    fontWeight: "600",
  },
  waveformContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  recordingCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1167FE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  waveformWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 60,
  },
  waveformBar: {
    width: 4,
    height: 40,
    backgroundColor: "#1167FE",
    borderRadius: 2,
    marginHorizontal: 4,
  },
  transcriptionPreviewContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  transcriptionPreviewTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 12,
  },
  transcriptionPreviewContent: {
    flex: 1,
  },
  transcriptionPreviewText: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
  stopRecordingButton: {
    backgroundColor: "#FF5252",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 8,
  },
  stopRecordingText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  processingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  processingText: {
    fontSize: 16,
    color: "#666666",
    marginTop: 16,
  },
  resultContainer: {
    flex: 1,
    padding: 16,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    flex: 1,
    marginRight: 16,
  },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#1167FE",
    marginTop: 4,
    alignSelf: "flex-start",
  },
  copyButtonText: {
    color: "#1167FE",
    fontSize: 14,
    marginLeft: 8,
  },
  copiedButton: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  copiedButtonText: {
    color: "#FFFFFF",
  },
  audioPlayerContainer: {
    marginBottom: 16,
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  playButton: {
    backgroundColor: "#1167FE",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  playButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 12,
  },
  keyPointItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  keyPointIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  keyPointText: {
    fontSize: 14,
    color: "#666666",
    flex: 1,
  },
  medicationsContainer: {
    marginBottom: 16,
  },
  medicationItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  medicationIcon: {
    marginRight: 8,
  },
  medicationText: {
    fontSize: 14,
    color: "#666666",
  },
  followUpContainer: {
    marginBottom: 8,
  },
  followUpText: {
    fontSize: 14,
    color: "#666666",
  },
  transcriptionSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  summarySection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  transcriptionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  transcriptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  transcriptionContent: {
    maxHeight: 200,
  },
  transcriptionFullText: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
  resultActions: {
    marginBottom: 0,
  },
  saveButton: {
    backgroundColor: "#1167FE",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  newRecordingButton: {
    backgroundColor: "#F5F5F5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 8,
  },
  newRecordingText: {
    color: "#666666",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  savingContainer: {
    flex: 1,
    padding: 16,
    paddingBottom: 100,
    justifyContent: "space-between",
  },
  saveForm: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    marginBottom: 20,
  },
  saveTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 16,
  },
  formField: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 8,
  },
  dateField: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  dateText: {
    fontSize: 16,
    color: "#333333",
    marginLeft: 8,
  },
  titleInput: {
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333333",
  },
  confirmButton: {
    backgroundColor: "#1167FE",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default TranscribeAIScreen;
