import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

// This component will render the DOM component in a WebView
export default function ConversationalAIDOMWrapper({ onMessage, platform, userHealthData }) {
  // Create HTML content with the ElevenLabs SDK
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://cdn.jsdelivr.net/npm/@11labs/react@latest/dist/index.umd.js"></script>
      <style>
        body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
        #mic-button {
          width: 60px;
          height: 60px;
          border-radius: 30px;
          background-color: #1167FE;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          box-shadow: 0 0 20px rgba(17, 103, 254, 0.5);
        }
        #mic-button.active {
          background-color: #F44336;
          box-shadow: 0 0 20px rgba(244, 67, 54, 0.5);
        }
        #mic-icon {
          color: white;
          font-size: 24px;
        }
      </style>
    </head>
    <body>
      <div id="mic-button">
        <span id="mic-icon">🎤</span>
      </div>

      <script>
        const button = document.getElementById('mic-button');
        const ElevenLabs = window.ElevenLabs;
        let conversation;

        async function requestMicrophonePermission() {
          try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
            return true;
          } catch (error) {
            console.error("Microphone permission denied", error);
            return false;
          }
        }

        async function setupConversation() {
          conversation = ElevenLabs.useConversation({
            onConnect: () => {
              console.log("Connected");
              button.classList.add('active');
            },
            onDisconnect: () => {
              console.log("Disconnected");
              button.classList.remove('active');
            },
            onMessage: (message) => {
              console.log("Message received:", message);
              window.ReactNativeWebView.postMessage(JSON.stringify(message));
            },
            onError: (error) => console.error("Error:", error)
          });
        }

        setupConversation();

        button.addEventListener('click', async () => {
          if (!conversation) return;
          
          if (button.classList.contains('active')) {
            // Stop conversation
            await conversation.endSession();
          } else {
            // Start conversation
            const hasPermission = await requestMicrophonePermission();
            if (!hasPermission) {
              alert("Microphone permission is required for voice interaction");
              return;
            }

            try {
              await conversation.startSession({
                agentId: "",
                apiKey: "",
                dynamicVariables: {
                  platform: "${platform}",
                  userHealthData: ${JSON.stringify(JSON.stringify(userHealthData))}
                },
                clientTools: {
                  get_health_data: async ({ metric }) => {
                    if (metric === "blood_pressure") {
                      return "${userHealthData.metrics.bloodPressure}";
                    } else if (metric === "glucose") {
                      return "${userHealthData.metrics.glucose}";
                    } else if (metric === "weight") {
                      return "${userHealthData.metrics.weight}";
                    } else if (metric === "bmi") {
                      return "${userHealthData.metrics.bmi}";
                    } else {
                      return "Data not available";
                    }
                  },
                  get_medication_schedule: async () => {
                    return "Metformin 500mg twice daily with meals, and Lisinopril 10mg once daily in the morning.";
                  }
                }
              });
            } catch (error) {
              console.error("Failed to start conversation:", error);
            }
          }
        });
      </script>
    </body>
    </html>
  `;

  // Handle messages from WebView
  const handleMessage = (event) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      onMessage(message);
    } catch (error) {
      console.error('Error parsing message from WebView:', error);
    }
  };

  return (
    <View style={{ width: 80, height: 80, borderRadius: 40, overflow: 'hidden' }}>
      <WebView
        source={{ html: htmlContent }}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        originWhitelist={['*']}
        style={{ backgroundColor: 'transparent' }}
      />
    </View>
  );
} 