import React , { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StatusBar, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { FontAwesome5 } from '@expo/vector-icons';

const NutritionGuidanceAppBar = ({ 
    navigation, 
    AISuggestions = "Nutrition Guidance", 
    resources = 52,
    model = "gpt-4",}) => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#242E49" />
      <View style={styles.appBar}>
        {/* Background Decorations */}

        {/* Header Content */}
        <View style={styles.content}>
          {/* Back Button */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color="white" />
          </TouchableOpacity>

          {/* Title */}
          <Text style={styles.title}>{AISuggestions}</Text>

          {/* Medication Info */}
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Icon name="info-outline" size={18} color="white" style={styles.infoIcon} />
              <Text style={styles.infoText}>{resources} Total</Text>
            </View>
            
            <Text style={styles.infoDivider}></Text>
            
            <View style={styles.infoItem}>
              <FontAwesome5 name="robot" size={18} color="white" style={styles.infoIcon} />
              <Text style={styles.infoText}>{model}</Text>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  appBar: {
    backgroundColor: '#1167FE',
    height: 220,
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
    marginTop: 16,
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: 6,
  },
  infoText: {
    color: 'white',
    fontSize: 16,
    opacity: 0.8,
    fontWeight: 500,
  },
  infoDivider: {
    color: 'white',
    opacity: 0.5,
    marginHorizontal: 12,
  },
});

export default NutritionGuidanceAppBar;
