import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const IconBackgroundAppBar = () => {
  return (
    <>
      <View style={[styles.iconBackground, { top: 40, left: 30 }]}>
          <FontAwesome5 name="heartbeat" size={40} color="rgba(255, 255, 255, 0.15)" />
        </View>
        <View style={[styles.iconBackground, { top: 120, left: 80 }]}>
          <FontAwesome5 name="pills" size={40} color="rgba(255, 255, 255, 0.15)" />
        </View>
        <View style={[styles.iconBackground, { top: 60, right: 40 }]}>
          <FontAwesome5 name="notes-medical" size={40} color="rgba(255, 255, 255, 0.15)" />
        </View>
        <View style={[styles.iconBackground, { top: 180, right: 70 }]}>
          <FontAwesome5 name="hospital" size={40} color="rgba(255, 255, 255, 0.15)" />
        </View>
        <View style={[styles.iconBackground, { top: 220, left: 50 }]}>
          <FontAwesome5 name="stethoscope" size={40} color="rgba(255, 255, 255, 0.15)" />
        </View>
        <View style={[styles.iconBackground, { top: 150, left: 200 }]}>
          <FontAwesome5 name="prescription-bottle-alt" size={40} color="rgba(255, 255, 255, 0.15)" />
        </View>
        <View style={[styles.iconBackground, { top: 100, left: 240 }]}>
          <FontAwesome5 name="biking" size={40} color="rgba(255, 255, 255, 0.15)" />
        </View>
        <View style={[styles.iconBackground, { top: 30, left: 170 }]}>
          <FontAwesome5 name="flask" size={40} color="rgba(255, 255, 255, 0.15)" />
        </View>
    </>
  )
}

const styles = StyleSheet.create({
    iconBackground: {
        position: 'absolute',
        zIndex: 1,
        opacity: 1,
        transform: [{ rotate: '10deg' }],
    },
})

export default IconBackgroundAppBar;