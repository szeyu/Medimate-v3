import React from 'react';
import { View, Text, TouchableOpacity, StatusBar, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import IconBackgroundAppBar from './IconBackgroundAppBar';

const HealthScoreAppBar = ({ navigation }) => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#242E49" />
      <View style={styles.appBar}>
        {/* Background Decorations */}
        <IconBackgroundAppBar/>
        <View style={[styles.iconBackground, { bottom: 40, right: 140 }]}>
          <FontAwesome5 name="volleyball-ball" size={40} color="rgba(255, 255, 255, 0.15)" />
        </View>

        {/* Header Content */}
        <View style={styles.content}>
          {/* Back Button */}
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={20} color="white" />
            </TouchableOpacity>
                <View style={styles.headerTopTitle}>
                    <Text style={styles.headerTitle}>Asklepios Score</Text>
                    <View style={styles.statusPill}>
                        <Text style={styles.statusText}>Normal</Text>
                    </View>
                </View>
          </View>
            
            {/* Score display */}
            <Text style={styles.scoreNumber}>88</Text>
            <Text style={styles.scoreDescription}>You are a healthy individual.</Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  appBar: {
    backgroundColor: '#1167FE',
    height: 320,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    overflow: 'hidden',
    position: 'relative',
  },
  content: {
    paddingTop: 50,
    paddingHorizontal: 20,
    alignItems: 'center',
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
  iconBackground: {
    position: 'absolute',
    zIndex: 1,
    opacity: 1,
    transform: [{ rotate: '10deg' }],
  },
  headerContainer: {
    backgroundColor: '#1167FE',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingBottom: 30,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  headerTopTitle:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width:'83%',
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  statusPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 10,
  },
  statusText: {
    color: 'white',
    fontWeight: '500',
  },
  scoreNumber: {
    fontSize: 100,
    fontWeight: 'bold',
    color: 'white',
    lineHeight: 110,
  },
  scoreDescription: {
    fontSize: 20,
    color: 'white',
    fontWeight: '500',
    marginTop: 10,
  },
});

export default HealthScoreAppBar;
