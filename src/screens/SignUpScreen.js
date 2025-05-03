import React, { useCallback, useState, useRef, useEffect } from "react";
import { 
    View, 
    Text, 
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    TouchableWithoutFeedback,
    Animated,
    Dimensions,
    LayoutAnimation,
} from "react-native";
import AnimatedBackground from "../../components/AnimatedBackground";
import Icon from "react-native-vector-icons/MaterialIcons";

const window = Dimensions.get('window');

const SignUpScreen = ({ navigation, handleSignUp }) => {
    // Scroll reference for programmatic scrolling
    const scrollViewRef = useRef(null);

    // Configure layout animation for smooth transitions
    const configureLayoutAnimation = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    };

    // Form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Password field focus states
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);

    // Password strength criteria states
    const [hasUpperCase, setHasUpperCase] = useState(false);
    const [hasNumber, setHasNumber] = useState(false);
    const [hasSymbol, setHasSymbol] = useState(false);
    const [hasMinLength, setHasMinLength] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(false);
    
    // Form error state
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    // Animation value for password hint box
    const hintBoxOpacity = useRef(new Animated.Value(0)).current;

    // Check password strength whenever password changes
    useEffect(() => {
        // Check for uppercase
        setHasUpperCase(/[A-Z]/.test(password));
        
        // Check for number
        setHasNumber(/[0-9]/.test(password));
        
        // Check for symbol (not letter or number)
        setHasSymbol(/[^a-zA-Z0-9]/.test(password));
        
        // Check minimum length
        setHasMinLength(password.length >= 10);
        
        // Check if passwords match
        setPasswordsMatch(password === confirmPassword && password !== '');
    }, [password, confirmPassword]);

    // Show/hide password hint box based on focus state
    useEffect(() => {
        if (isPasswordFocused || isConfirmPasswordFocused) {
            Animated.timing(hintBoxOpacity, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true
            }).start();
        } else {
            Animated.timing(hintBoxOpacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true
            }).start();
        }
    }, [isPasswordFocused, isConfirmPasswordFocused, hintBoxOpacity]);

    // Show/hide password hint box based on focus state
    useEffect(() => {
        if (isPasswordFocused || isConfirmPasswordFocused) {
            // Apply layout animation before showing the hints
            configureLayoutAnimation();
            
            Animated.timing(hintBoxOpacity, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true
            }).start();
        } else {
            // Apply layout animation before hiding the hints
            configureLayoutAnimation();
            
            Animated.timing(hintBoxOpacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true
            }).start();
        }
    }, [isPasswordFocused, isConfirmPasswordFocused, hintBoxOpacity]);

    // Validate email format
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Handle sign up attempt
    const handleSignUpAttempt = useCallback(() => {
        Keyboard.dismiss();

        // Reset errors
        setEmailError('');
        setPasswordError('');
        setUsernameError('');
        setConfirmPasswordError('');
        
        // Validate inputs
        let isValid = true;

        // Username validation
        if (!username) {
            setUsernameError('Username is required');
            isValid = false;
        } else if (username.length < 3) {
            setUsernameError('Username must be at least 3 characters');
            isValid = false;
        }

        // Email validation
        if (!email) {
            setEmailError('Email is required');
            isValid = false;
        } else if (!validateEmail(email)) {
            setEmailError('Please enter a valid email');
            isValid = false;
        }
        
        // Password validation
        if (!password) {
            setPasswordError('Password is required');
            isValid = false;
        } else if (!hasUpperCase || !hasNumber || !hasSymbol || !hasMinLength) {
            setPasswordError('Your password does not meet the requirements');
            isValid = false;
        }

        // Confirm password validation
        if (!confirmPassword) {
            setConfirmPasswordError('Please confirm your password');
            isValid = false;
        } else if (confirmPassword !== password) {
            setConfirmPasswordError('Passwords do not match');
            isValid = false;
        }
        
        if (isValid) {
            // Call the handleSignUp function passed from App.js
            if (typeof handleSignUp === 'function') {
                handleSignUp(); // This updates the state in App.js
            } else {
                 console.error('handleSignUp function not provided!');
                 // Fallback or navigate to login?
                 // navigation.navigate('LoginScreen'); // Example fallback
            }
        }
    }, [username, email, password, confirmPassword, handleSignUp, navigation, validateEmail, hasUpperCase, hasNumber, hasSymbol, hasMinLength]);

    // Handle social sign-in
    const handleSocialSignIn = useCallback((provider) => {
        console.log(`Signing in with ${provider}`);
        // In a real app, implement OAuth authentication with the selected provider
        // For now, just navigate to HomeScreen
        if (typeof handleSignUp === 'function') {
            handleSignUp(); // Assumes social sign-in also logs the user in
        } else {
             console.error('handleSignUp function not provided!');
        }
    }, [handleSignUp, navigation]);

    // Navigate to login screen
    const navigateToLogin = useCallback(() => {
        navigation.navigate('LoginScreen');
    }, [navigation]);

     // Password requirement item component
     const PasswordRequirement = ({ isMet, label }) => (
        <View style={styles.requirementContainer}>
            <Icon 
                name={isMet ? "check-circle" : "cancel"} 
                size={16} 
                color={isMet ? "#4CAF50" : "#FF3B30"} 
            />
            <Text style={[
                styles.requirementText, 
                { color: isMet ? "#4CAF50" : "#FF3B30" }
            ]}>
                {label}
            </Text>
        </View>
    );

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
                                    <Text style={styles.title}>Sign Up</Text>
                                    <Text style={styles.subtitle}>Create Your Account</Text>

                                    {/* Username Input */}
                                    <View style={styles.inputContainer}>
                                        <Icon name="person" size={20} color="#1167FE" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Username"
                                            placeholderTextColor="#888"
                                            autoCapitalize="none"
                                            value={username}
                                            onChangeText={(text) => {
                                                setUsername(text);
                                                if (usernameError) setUsernameError('');
                                            }}
                                        />
                                    </View>
                                    {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}

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
                                            onFocus={() => setIsPasswordFocused(true)}
                                            onBlur={() => setIsPasswordFocused(false)}
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

                                    {/* Confirm Password Input */}
                                    <View style={styles.inputContainer}>
                                        <Icon name="lock" size={20} color="#1167FE" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Confirm Password"
                                            placeholderTextColor="#888"
                                            secureTextEntry={!showConfirmPassword}
                                            value={confirmPassword}
                                            onChangeText={(text) => {
                                                setConfirmPassword(text);
                                                if (passwordError) setConfirmPasswordError('');
                                            }}
                                            onFocus={() => setIsConfirmPasswordFocused(true)}
                                            onBlur={() => setIsConfirmPasswordFocused(false)}
                                        />
                                        <TouchableOpacity 
                                            style={styles.passwordVisibilityButton}
                                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            <Icon 
                                                name={showConfirmPassword ? "visibility" : "visibility-off"} 
                                                size={20} 
                                                color="#888" 
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

                                    {/* Password Requirements Hint Box - Only render when needed */}
                                    {(isPasswordFocused || isConfirmPasswordFocused) && (
                                        <Animated.View 
                                            style={[
                                                styles.passwordRequirementsContainer,
                                                { opacity: hintBoxOpacity }
                                            ]}
                                        >
                                            <Text style={styles.passwordHintTitle}>Password must include:</Text>
                                            <PasswordRequirement 
                                                isMet={hasUpperCase} 
                                                label="At least one uppercase letter" 
                                            />
                                            <PasswordRequirement 
                                                isMet={hasNumber} 
                                                label="At least one number" 
                                            />
                                            <PasswordRequirement 
                                                isMet={hasSymbol} 
                                                label="At least one symbol (!@#$%...)" 
                                            />
                                            <PasswordRequirement 
                                                isMet={hasMinLength} 
                                                label="Minimum 10 characters" 
                                            />
                                            {confirmPassword.length > 0 && (
                                                <PasswordRequirement 
                                                    isMet={passwordsMatch} 
                                                    label="Passwords match" 
                                                />
                                            )}
                                        </Animated.View>
                                    )}

                                    {/* <TouchableOpacity 
                                        style={styles.signUpButton}
                                        onPress={() => navigation.navigate('HomeScreen')}
                                    >
                                        <Text style={styles.buttonText}>Sign Up</Text>
                                    </TouchableOpacity> */}

                                    <TouchableOpacity 
                                        style={[
                                            styles.signUpButton,
                                            {
                                                backgroundColor: hasUpperCase && hasNumber && hasSymbol && 
                                                hasMinLength && passwordsMatch ? '#1167FE' : '#6FA1FE'
                                            }
                                        ]}
                                        onPress={handleSignUpAttempt}
                                        disabled={!(hasUpperCase && hasNumber && hasSymbol && hasMinLength && passwordsMatch)}
                                    >
                                        <Text style={styles.buttonText}>Sign Up</Text>
                                    </TouchableOpacity>
                                    
                                    {/* Social Login Section */}
                                    <View style={styles.socialLoginContainer}>
                                        <View style={styles.dividerContainer}>
                                            <View style={styles.divider} />
                                            <Text style={styles.orText}>Or continue with</Text>
                                            <View style={styles.divider} />
                                        </View>

                                        <View style={styles.socialButtonsContainer}>
                                            <TouchableOpacity 
                                                style={styles.socialButton} 
                                                onPress={() => handleSocialSignIn('Google')}
                                            >
                                                <Image 
                                                    source={require('../../assets/google-icon.png')} 
                                                    style={styles.socialIcon} 
                                                />
                                            </TouchableOpacity>
                                            
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

                                    {/* Already have account link */}
                                    <View style={styles.loginContainer}>
                                        <Text style={styles.accountText}>Already have an account? </Text>
                                        <TouchableOpacity onPress={navigateToLogin}>
                                            <Text style={styles.loginText}>Login here</Text>
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
    signUpButton: {
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
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30,
    },
    accountText: {
        fontSize: 14,
        color: '#666',
    },
    loginText: {
        fontSize: 14,
        color: '#1167FE',
        fontWeight: 'bold',
    },
    passwordRequirementsContainer: {
        width: '100%',
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        padding: 16,
        marginTop: 8,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    
    passwordHintTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    
    requirementContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
    },
    
    requirementText: {
        fontSize: 13,
        marginLeft: 8,
    },
});

export default SignUpScreen;