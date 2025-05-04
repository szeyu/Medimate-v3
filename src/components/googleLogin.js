// GoogleLogin.js
import React, { useEffect } from "react";
import { 
    View, 
    Text, 
    StyleSheet,  
    TouchableOpacity,
    TextInput,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    Keyboard,
    TouchableWithoutFeedback,
    Platform,
    Dimensions,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { EXPO_CLIENT_ID, IOS_CLIENT_ID } from "@env";

WebBrowser.maybeCompleteAuthSession();

export default function GoogleLogin({ handleLogin}) {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: EXPO_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    redirectUri: "com.googleusercontent.apps.336819940127-bcshejqgf9kian7u8o1l2761kc1uikb3:/oauthredirect"
  });

  useEffect(() => { 
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(user => {
            console.log("User signed in!", user);
            handleLogin();
        })
        .catch(error => console.error("Auth error", error));
    }
  }, [response]);


    return <TouchableOpacity 
        style={styles.socialButton} 
        onPress={() => promptAsync()}
    >
        <Image 
            source={require('../../assets/google-icon.png')} 
            style={styles.socialIcon} 
        />
    </TouchableOpacity>
}

const styles = StyleSheet.create({
    socialButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '70%',
    },
    socialButton: {
        width: 60,
        height: 60,
        borderRadius: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
    },
    socialIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    }
});
