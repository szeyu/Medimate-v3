import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const MentalStatusCard = () => {
const navigation = useNavigation();

  return (
    <>
        <View>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Mental Health</Text>
                <Icon name="more-horiz" size={24} color="#9E9E9E" />
            </View>
            <TouchableOpacity 
                style={styles.cardContainer}
                onPress={() => navigation.navigate('MentalGreat')}
            >
                    <Image
                        source={require('../../assets/mental-health-cover.png')}
                        style={styles.backgroundImage}
                    />
                    <View style={styles.overlay}/>
                    <View style={styles.cardContent}>
                        <View style={styles.textContent}>
                            <Text style={styles.cardSubtitle}>Here is your daily score</Text>
                            <Text style={styles.scoreText}>Great</Text>
                            <Text style={styles.scoreDescription}>
                                I always know I am{'\n'}the best !
                            </Text>
                        </View>
                        <Image
                            source={require('../../assets/GreatStatus.png')}
                            style={styles.statusImage}
                        />
                    </View>
            </TouchableOpacity>
        </View>
    </>
  )
}

const styles = StyleSheet.create({
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    cardContainer: {
        position: 'relative',
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    backgroundImage: {
        width: '100%',
        height: 200,
        borderRadius: 24,
        position: 'absolute',
        opacity: 1,
        resizeMode: 'cover',
    },
    cardContent: {
        padding: 24,
        height: 200,
        flexDirection: 'row', // Add this
        justifyContent: 'space-between', // Add this
        alignItems: 'center', // Add this
    },
    textContent: {
        flex: 1, // Add this
        paddingRight: 10, // Add spacing between text and image
    },
    statusImage: {
        width: 370,
        height: 370,
        resizeMode: 'contain',
        position: 'absolute', // Change from relative to absolute
        right: -140, // Position from the right edge
        bottom: -50, // Position from the bottom
        zIndex: 1, // Ensure it appears above other elements
    },
    cardSubtitle: {
        fontSize: 18,
        color: '#429D71',
        marginBottom: 34,
    },
    scoreText: {
        fontSize: 38,
        fontWeight: 'bold',
        color: '#429D71',
        marginBottom: 10,
    },
    scoreDescription: {
        fontSize: 20,
        color: '#429D71',
        lineHeight: 22,
        fontWeight: 'semi-bold',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // Adjust the last number (0.1) for transparency
    },
});

export default MentalStatusCard;