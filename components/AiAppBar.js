import React from 'react';
import { View, Text, Image, TouchableOpacity, StatusBar, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import IconBackgroundAppBar from './IconBackgroundAppBar';

const AiAppBar = ({ navigation }) => {
  return (
    <>
      <View style={styles.appBar}>
        {/* Background Decorations */}
        <IconBackgroundAppBar />
        {/* Header Content */}
        <View style={styles.content}>
          {/* Back Button */}
          {/* <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color="white" />
          </TouchableOpacity> */}

          {/* Title */}
          <Text style={styles.title}>AI Health Tools</Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  appBar: {
    backgroundColor: '#1167FE',
    height: 180,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    overflow: 'hidden',
    position: 'relative',
  },
  pillImage1: {
    position: 'absolute',
    right: 40,
    top: -30,
    width: 150,
    height: 130,
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
    marginTop: 60,
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default AiAppBar;
