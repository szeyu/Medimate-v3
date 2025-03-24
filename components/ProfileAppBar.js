import React from 'react';
import { View, Text, Image, TouchableOpacity, StatusBar, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProfileAppBar = ({ navigation }) => {
  return (
    <>
      <View style={styles.appBar}>
        {/* Background Decorations */}
        <Image source={require('../assets/CoverPhoto.png')} style={styles.pillImage1} />
        {/* Header Content */}
        <View style={styles.content}>
          {/* Back Button */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color="white" />
          </TouchableOpacity>

          {/* Title */}
          <Text style={styles.title}>My Account</Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  appBar: {
    backgroundColor: '#242E49',
    height: 180,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    overflow: 'hidden',
    position: 'relative',
  },
  pillImage1: {
    position: 'absolute',
    width: 400,
    height: 360,
    marginTop: -40,
  },
  pillImage2: {
    position: 'absolute',
    right: -50,
    top: 60,
    width: 150,
    height: 100,
  },
  content: {
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    width: 40,
    alignItems: 'center',
    marginTop: 12,
  },
  title: {
    marginTop: 16,
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  coverPhotoContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
});

export default ProfileAppBar;
