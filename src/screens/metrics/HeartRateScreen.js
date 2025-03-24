import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import HealthScoreAppBar from '../../../components/HealthScoreAppBar';
import { Ionicons } from '@expo/vector-icons';


const HeartRateScreen = ({ navigation }) => {
  return (
    <>
        <View style={styles.appBar}>
        {/* Background Decorations */}

        {/* Header Content */}
        <View style={styles.content}>
          {/* Back Button */}
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={20} color="black" />
            </TouchableOpacity>
                <View style={styles.headerTopTitle}>
                    <Text style={styles.headerTitle}>Heart Rate</Text>
                    <View style={styles.statusPill}>
                        <Text style={styles.statusText}>Normal</Text>
                    </View>
                </View>
          </View>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
    appBar: {
        backgroundColor: '#F3F5F9',
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
        borderColor: 'rgba(14, 2, 2, 0.3)',
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
        color: 'black',
      },
      statusPill: {
        backgroundColor: '#D0E4FF',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 10,
      },
      statusText: {
        color: '#1167FE',
        fontWeight: '500',
      },
});

export default HeartRateScreen;