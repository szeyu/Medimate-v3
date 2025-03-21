"use dom";
import { useCallback } from "react";
import { useConversation } from "@11labs/react";
import { View, Pressable, StyleSheet } from "react-native";
import { Mic } from "lucide-react-native";

async function requestMicrophonePermission() {
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    return true;
  } catch (error) {
    console.error("Microphone permission denied", error);
    return false;
  }
}

export default function ConversationalAI({
  platform,
  onMessage,
  userHealthData,
}) {
  const conversation = useConversation({
    onConnect: () => console.log("Connected"),
    onDisconnect: () => console.log("Disconnected"),
    onMessage: message => {
      console.log("Message received:", message);
      onMessage(message);
    },
    onError: error => console.error("Error:", error),
  });

  const startConversation = useCallback(async () => {
    try {
      // Request microphone permission
      const hasPermission = await requestMicrophonePermission();
      if (!hasPermission) {
        alert("Microphone permission is required for voice interaction");
        return;
      }

      // Start the conversation with your agent
      await conversation.startSession({
        agentId: "D574jhuFhdExdZwkruAU", // Your agent ID
        apiKey: "sk_72f043a0ee5de43c5fdd839fbf34d8606b5566bdfb64e892", // Your API key
        dynamicVariables: {
          platform,
          userHealthData: JSON.stringify(userHealthData),
        },
        clientTools: {
          get_health_data: async ({ metric }) => {
            console.log("Getting health data for:", metric);
            if (metric === "blood_pressure") {
              return userHealthData.metrics.bloodPressure;
            } else if (metric === "glucose") {
              return userHealthData.metrics.glucose;
            } else if (metric === "weight") {
              return userHealthData.metrics.weight;
            } else if (metric === "bmi") {
              return userHealthData.metrics.bmi;
            } else {
              return "Data not available";
            }
          },
          get_medication_schedule: async () => {
            return "Metformin 500mg twice daily with meals, and Lisinopril 10mg once daily in the morning.";
          }
        },
      });
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  }, [conversation, platform, userHealthData, onMessage]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  return (
    <Pressable
      style={[
        styles.callButton,
        conversation.status === "connected" && styles.callButtonActive,
      ]}
      onPress={
        conversation.status === "disconnected"
          ? startConversation
          : stopConversation
      }
    >
      <View
        style={[
          styles.buttonInner,
          conversation.status === "connected" && styles.buttonInnerActive,
        ]}
      >
        <Mic
          size={32}
          color="#FFFFFF"
          strokeWidth={1.5}
          style={styles.buttonIcon}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  callButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  callButtonActive: {
    backgroundColor: "rgba(239, 68, 68, 0.2)",
  },
  buttonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#1167FE",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1167FE",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 5,
  },
  buttonInnerActive: {
    backgroundColor: "#F44336",
    shadowColor: "#F44336",
  },
  buttonIcon: {
    transform: [{ translateY: 2 }],
  },
}); 