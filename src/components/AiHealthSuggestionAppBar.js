import React from 'react';
import { View, Text, TouchableOpacity, StatusBar, StyleSheet } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import IconBackgroundAppBar from './IconBackgroundAppBar';

const AiHealthSuggestionAppBar = ({ navigation }) => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#242E49" />
      <View style={styles.appBar}>
        {/* Background Decorations */}
        <IconBackgroundAppBar />
        {/* Header Content */}
        <View style={styles.content}>
          {/* Back Button */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color="white" />
          </TouchableOpacity>

          {/* Title */}
          <Text style={styles.title}>AI Health Suggestions</Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  appBar: {
    backgroundColor: '#242E49',
    height: 200,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    overflow: 'hidden',
    position: 'relative',
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
    marginTop: 24,
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },

});

export default AiHealthSuggestionAppBar;
