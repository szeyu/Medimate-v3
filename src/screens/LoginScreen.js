import React, { useState, useCallback, useRef }from "react";
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
import Icon from "react-native-vector-icons/MaterialIcons";
import AnimatedBackground from "../../components/AnimatedBackground";
import GoogleLogin from "../components/googleLogin";

const LoginScreen = ({ navigation, handleLogin }) => {

    const scrollViewRef = useRef(null);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    // Validate email format
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Handle login attempt
    const handleLoginAttempt = useCallback(() => {
        Keyboard.dismiss();

        // Reset errors
        setEmailError('');
        setPasswordError('');
        
        // Validate inputs
        let isValid = true;
        
        if (!email) {
            setEmailError('Email is required');
            isValid = false;
        } else if (!validateEmail(email)) {
            setEmailError('Please enter a valid email');
            isValid = false;
        }
        
        if (!password) {
            setPasswordError('Password is required');
            isValid = false;
        } else if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            isValid = false;
        }
        
        if (isValid) {
            // For now, just navigate to HomeScreen
            // In a real app, you would authenticate with your backend here
            // navigation.navigate('HomeScreen');

            // No need to navigate here, App.js will re-render with MainTabs
            if (typeof handleLogin === 'function') {
                handleLogin();
            } else {
                // Fallback behavior if handleLogin is not provided
                console.log('handleLogin function not provided!');
                // navigation.navigate('HomeScreen'); // Fallback navigation
            }
            
        }
    }, [email, password, handleLogin, navigation]);

    // // Handle social sign-in
    // const handleSocialSignIn = useCallback((provider) => {
    //     console.log(`Signing in with ${provider}`);
    //     // In a real app, implement OAuth authentication with the selected provider
    //     // For now, just navigate to HomeScreen
    //     // navigation.navigate('HomeScreen ');
    //     if (typeof handleLogin === 'function') {
    //         handleLogin(); // This updates the state in App.js
    //     } else {
    //         console.error('handleLogin function not provided!');
    //     }
    // }, [handleLogin]);

    const navigateToSignUp = useCallback(() => {
        navigation.navigate('SignUpScreen');
    }, [navigation]);

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
            <AnimatedBackground> 
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.innerContainer}>
                        <ScrollView 
                            ref={scrollViewRef}
                            contentContainerStyle={styles.scrollContainer}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                            bounces={false}
                        >
                            <View style={styles.formWrapper}>  
                                <View style={styles.contentContainer}>
                                    <Text style={styles.title}>Welcome to Medimate</Text>
                                    <Text style={styles.subtitle}>Your personal healthcare assistant</Text>

                                    {/* Email Input */}
                                    <View style={styles.inputContainer}>
                                        <Icon name="email" size={20} color="#1167FE" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Email"
                                            placeholderTextColor="#888"
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            value={email}
                                            onChangeText={(text) => {
                                                setEmail(text);
                                                if (emailError) setEmailError('');
                                            }}
                                        />
                                    </View>
                                    {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

                                    {/* Password Input */}
                                    <View style={styles.inputContainer}>
                                        <Icon name="lock" size={20} color="#1167FE" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Password"
                                            placeholderTextColor="#888"
                                            secureTextEntry={!showPassword}
                                            value={password}
                                            onChangeText={(text) => {
                                                setPassword(text);
                                                if (passwordError) setPasswordError('');
                                            }}
                                        />
                                        <TouchableOpacity 
                                            style={styles.passwordVisibilityButton}
                                            onPress={() => setShowPassword(!showPassword)}
                                        >
                                            <Icon 
                                                name={showPassword ? "visibility" : "visibility-off"} 
                                                size={20} 
                                                color="#888" 
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                                    {/* Forgot Password Link */}
                                    <TouchableOpacity style={styles.forgotPasswordContainer}>
                                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                                    </TouchableOpacity>
                                    
                                    <TouchableOpacity 
                                        style={styles.loginButton}
                                        // onPress={() => navigation.navigate('HomeScreen')}
                                        onPress={handleLoginAttempt}
                                    >
                                        <Text style={styles.buttonText}>Login</Text>
                                    </TouchableOpacity>

                                    {/* Social Login Section */}
                                    <View style={styles.socialLoginContainer}>
                                        <View style={styles.dividerContainer}>
                                            <View style={styles.divider} />
                                            <Text style={styles.orText}>Or continue with</Text>
                                            <View style={styles.divider} />
                                        </View>

                                        <View style={styles.socialButtonsContainer}>
                                            <GoogleLogin handleLogin={handleLogin}/>
                                            
                                            <TouchableOpacity 
                                                style={styles.socialButton} 
                                                onPress={() => handleSocialSignIn('Apple')}
                                            >
                                                <Image 
                                                    source={require('../../assets/apple-icon.png')} 
                                                    style={styles.socialIcon} 
                                                />
                                            </TouchableOpacity>
                                            
                                            <TouchableOpacity 
                                                style={styles.socialButton} 
                                                onPress={() => handleSocialSignIn('Facebook')}
                                            >
                                                <Image 
                                                    source={require('../../assets/facebook-icon.png')} 
                                                    style={styles.socialIcon} 
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    {/* Registration Link */}
                                    <View style={styles.registrationContainer}>
                                        <Text style={styles.noAccountText}>Don't have an account? </Text>
                                        <TouchableOpacity onPress={navigateToSignUp}>
                                            <Text style={styles.registerText}>Register now</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </TouchableWithoutFeedback>
            </AnimatedBackground>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: Platform.OS === 'ios' ? 40 : 20,
        paddingBottom: 20,
    },
    formWrapper: {
        width: '100%',
        maxWidth: 350,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        overflow: 'hidden',
        maxHeight: window.height * 0.85, // Limit height to 85% of screen
    },
    contentContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    formContainer: {
        width: '100%',
        maxWidth: 350,
        padding: 20,
        borderRadius: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: '#000333',
        marginBottom: 40,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 12,
        backgroundColor: '#f7f7f7',
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 50,
        color: '#333',
        fontSize: 16,
    },
    passwordVisibilityButton: {
        padding: 8,
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 12,
        alignSelf: 'flex-start',
        marginBottom: 8,
        marginTop: -8,
    },
    forgotPasswordContainer: {
        alignSelf: 'flex-end',
        marginBottom: 20,
    },
    forgotPasswordText: {
        color: '#1167FE',
        fontSize: 14,
    },
    loginButton: {
        backgroundColor: '#1167FE',
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 30,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        marginTop: 20,
        width: 320,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    socialLoginContainer: {
        width: '100%',
        marginTop: 30,
        alignItems: 'center',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#666',
    },
    orText: {
        marginHorizontal: 10,
        fontSize: 14,
        color: '#666',
    },
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
    },
    registrationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30,
    },
    noAccountText: {
        fontSize: 14,
        color: '#666',
    },
    registerText: {
        fontSize: 14,
        color: '#1167FE',
        fontWeight: 'bold',
    }
});

export default LoginScreen;