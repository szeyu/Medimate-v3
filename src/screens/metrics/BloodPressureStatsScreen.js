import React, { useState,} from 'react';
import {   
    View, 
    Text, 
    TouchableOpacity, 
    ScrollView, 
    StyleSheet, 
    Image, 
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BarChart } from 'react-native-gifted-charts';

const { width } = Dimensions.get('window');

const BloodPressureStatsScreen = ({ navigation }) => {
    const [selectedPeriod, setSelectedPeriod] = useState('1  Week');
    
    // Data for the chart formatted for gifted-charts
    const barData = [
        // First group - Monday
        {
          value: 120, // Systolic value
          label: 'Mon',
          frontColor: '#2D6BFF',
          topLabelComponent: () => (
            <View style={styles.currentMarker}>
              <View style={styles.markerInner} />
            </View>
          ),
          topLabelComponentHeight: 20,
          spacing: 2,
          labelTextStyle: styles.dayLabel,
          capRadius: 0,
        },
        {
          value: 80, // Diastolic value
          frontColor: '#D6E4FF',
          spacing: 12,
          capRadius: 0,
        },
        
        // Second group - Tuesday
        {
          value: 118, // Systolic value
          label: 'Tue',
          frontColor: '#2D6BFF',
          topLabelComponent: () => (
            <View style={styles.currentMarker}>
              <View style={styles.markerInner} />
            </View>
          ),
          topLabelComponentHeight: 20,
          spacing: 2,
          labelTextStyle: styles.dayLabel,
          capRadius: 0,
        },
        {
          value: 75, // Diastolic value
          frontColor: '#D6E4FF',
          spacing: 12,
          capRadius: 0,
        },
        
        // Third group - Wednesday
        {
          value: 125, // Systolic value
          label: 'Wed',
          frontColor: '#2D6BFF',
          topLabelComponent: () => (
            <View style={styles.currentMarker}>
              <View style={styles.markerInner} />
            </View>
          ),
          topLabelComponentHeight: 20,
          spacing: 2,
          labelTextStyle: styles.dayLabel,
          capRadius: 0,
        },
        {
          value: 82, // Diastolic value
          frontColor: '#D6E4FF',
          spacing: 12,
          capRadius: 0,
        },
        
        // Fourth group - Thursday
        {
          value: 115, // Systolic value
          label: 'Thu',
          frontColor: '#2D6BFF',
          topLabelComponent: () => (
            <View style={styles.currentMarker}>
              <View style={styles.markerInner} />
            </View>
          ),
          topLabelComponentHeight: 20,
          spacing: 2,
          labelTextStyle: styles.dayLabel,
          capRadius: 0,
        },
        {
          value: 78, // Diastolic value
          frontColor: '#D6E4FF',
          spacing: 12,
          capRadius: 0,
        },
        
        // Fifth group - Friday
        {
          value: 122, // Systolic value
          label: 'Fri',
          frontColor: '#2D6BFF',
          topLabelComponent: () => (
            <View style={styles.currentMarker}>
              <View style={styles.markerInner} />
            </View>
          ),
          topLabelComponentHeight: 20,
          spacing: 2,
          labelTextStyle: styles.dayLabel,
          capRadius: 0,
        },
        {
          value: 80, // Diastolic value
          frontColor: '#D6E4FF',
          spacing: 12,
          capRadius: 0,
        },
        
        // Sixth group - Saturday
        {
          value: 119, // Systolic value
          label: 'Sat',
          frontColor: '#2D6BFF',
          topLabelComponent: () => (
            <View style={styles.currentMarker}>
              <View style={styles.markerInner} />
            </View>
          ),
          topLabelComponentHeight: 20,
          spacing: 2,
          labelTextStyle: styles.dayLabel,
          capRadius: 0,
        },
        {
          value: 76, // Diastolic value
          frontColor: '#D6E4FF',
          spacing: 12,
          capRadius: 0,
        },
        
        // Seventh group - Sunday
        {
          value: 121, // Systolic value
          label: 'Sun',
          frontColor: '#2D6BFF',
          topLabelComponent: () => (
            <View style={styles.currentMarker}>
              <View style={styles.markerInner} />
            </View>
          ),
          topLabelComponentHeight: 20,
          spacing: 2,
          labelTextStyle: styles.dayLabel,
          capRadius: 0,
        },
        {
          value: 79, // Diastolic value
          frontColor: '#D6E4FF',
          spacing: 12,
          capRadius: 0,
        },
      ];
    
    const periods = ['1  Day', '1  Week', '1 Month', '1  Year', 'All'];

    return (
    <>
        <ScrollView style={styles.appBar}>
            {/* Background Decorations */}
            <View style={styles.content}>
                {/* Back Button */}
                <View style={styles.headerTop}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={20} color="black" />
                    </TouchableOpacity>
                        <View style={styles.headerTopTitle}>
                            <Text style={styles.headerTitle}>Blood Pressure Stats</Text>
                            <Icon name="more-horiz" size={24} color="#9E9E9E" />
                        </View>
                </View>
                {/* Stats Card */}
                <View style={styles.statsCard}>
                    {/* Time Period Selector */}
                    <View style={styles.periodSelector}>
                        {periods.map(period => (
                            <TouchableOpacity 
                                key={period}
                                style={[
                                    styles.periodButton,
                                    selectedPeriod === period && styles.selectedPeriodButton
                                ]}
                                onPress={() => setSelectedPeriod(period)}
                            >
                                <Text 
                                    style={[
                                        styles.periodText,
                                        selectedPeriod === period && styles.selectedPeriodText
                                    ]}
                                >
                                    {period}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    
                    {/* Chart */}
                    <View style={styles.chartContainer}>
                        {/* Y-axis labels */}
                        <View style={styles.yAxisLabels}>
                            <Text style={styles.axisLabel}>140</Text>
                            <Text style={styles.axisLabel}>120</Text>
                            <Text style={styles.axisLabel}>100</Text>
                            <Text style={styles.axisLabel}>80</Text>
                            <Text style={styles.axisLabel}>60</Text>
                        </View>
                        
                        {/* Gifted Charts Bar Chart */}
                        <View style={styles.barChartContainer}>
                        <BarChart
                            data={barData}
                            width={width - 100}
                            height={200}
                            barWidth={24} // Narrower bars to fit two side by side
                            noOfSections={5}
                            maxValue={140} // Increased to accommodate systolic values
                            yAxisThickness={0}
                            xAxisThickness={0}
                            hideRules
                            hideYAxisText
                            disablePress
                            renderTooltip={() => null}
                            yAxisTextStyle={styles.axisLabel}
                            yAxisLabelWidth={0}
                            xAxisLabelTextStyle={styles.dayLabel}
                            showGradient={false}
                            barBorderRadius={5}
                            isAnimated
                            grouped // Enable grouped bar chart
                            xAxisLabelsHeight={30} 
                            xAxisLabelsVerticalShift={15} 
                            spacing={5} 
                            xAxisTextNumberOfLines={1} 
                            xAxisLabelWidth={48}
                            />
                        </View>
                    </View>
                    
                    {/* Legend */}
                    <View style={styles.legend}>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendColor, styles.systolicLegend]} />
                            <Text style={styles.legendText}>Systolic</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendColor, styles.diastolicLegend]} />
                            <Text style={styles.legendText}>Diastolic</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Disease Risks</Text>
                <Icon name="more-horiz" size={24} color="#9E9E9E" />
            </View>
            <View style={styles.riskAssessmentContainer}>
              {/* Heart Failure Risk Card */}
              <View style={styles.riskCard}>
                <View style={[styles.iconContainer, { backgroundColor: '#FFF1F1' }]}>
                  <Ionicons name="heart" size={24} color="#FF5757" />
                </View>
                <View style={styles.riskInfoContainer}>
                  <Text style={styles.riskTitle}>Heart Failure</Text>
                  <Text style={styles.riskDescription}>High Risk. Consult Doctor.</Text>
                </View>
                <View style={[styles.riskBadge, { backgroundColor: '#FF5757' }]}>
                  <Text style={styles.riskBadgeText}>High</Text>
                </View>
              </View>
              
              {/* Liver Failure Risk Card */}
              <View style={styles.riskCard}>
                <View style={[styles.iconContainer, { backgroundColor: '#E6FAFA' }]}>
                  <Image source={require('../../../assets/liver.png')} style={styles.liverIcon} />
                </View>
                <View style={styles.riskInfoContainer}>
                  <Text style={styles.riskTitle}>Liver Failure</Text>
                  <Text style={styles.riskDescription}>Low Risk. Do Prevention.</Text>
                </View>
                <View style={[styles.riskBadge, { backgroundColor: '#00BFB3' }]}>
                  <Text style={styles.riskBadgeText}>Low</Text>
                </View>
              </View>
              
              {/* Kidney Disease Risk Card */}
              <View style={styles.riskCard}>
                <View style={[styles.iconContainer, { backgroundColor: '#F5F0FF' }]}>
                  <Image source={require('../../../assets/kidney.png')} style={styles.kidneyIcon} />
                </View>
                <View style={styles.riskInfoContainer}>
                  <Text style={styles.riskTitle}>Kidney Disease</Text>
                  <Text style={styles.riskDescription}>Medium Risk. Call Doctor.</Text>
                </View>
                <View style={[styles.riskBadge, { backgroundColor: '#9747FF' }]}>
                  <Text style={styles.riskBadgeText}>Medium</Text>
                </View>
              </View>
              
              {/* Bone Disease Risk Card */}
              <View style={styles.riskCard}>
                <View style={[styles.iconContainer, { backgroundColor: '#E6FAFA' }]}>
                  <MaterialCommunityIcons name="bone" size={24} color="#00BFB3"/>
                </View>
                <View style={styles.riskInfoContainer}>
                  <Text style={styles.riskTitle}>Kidney Disease</Text>
                  <Text style={styles.riskDescription}>Low Risk. Be Preventive.</Text>
                </View>
                <View style={[styles.riskBadge, { backgroundColor: '#00BFB3' }]}>
                  <Text style={styles.riskBadgeText}>Low</Text>
                </View>
              </View>
            </View>
        </ScrollView>
    </>
    )
}

const styles = StyleSheet.create({
    appBar: {
        flex: 1,
        backgroundColor: '#F3F5F9',
    },
    content: {
        paddingTop: 40,
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
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
        marginTop: 10,
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
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        marginTop: 10,
      },
      sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
      },
    statsCard: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    periodSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#F5F6FA',
        borderRadius: 20,
        padding: 5,
        marginBottom: 20,
        width: '100%',
    },
    periodButton: {
        paddingVertical: 10,
        paddingHorizontal: 8,
        borderRadius: 15,
        flex: 1,
        alignItems: 'center',
    },
    selectedPeriodButton: {
        backgroundColor: '#1E2A47',
    },
    periodText: {
        color: '#8A8D9F',
        fontWeight: 'bold',
        fontSize: 11,
    },
    selectedPeriodText: {
        color: 'white',
        fontWeight: 'bold',
    },
    chartContainer: {
        flexDirection: 'row',
        height: 250,
        marginBottom: 20,
    },
    yAxisLabels: {
        justifyContent: 'space-between',
        paddingRight: 10,
        height: 200,
    },
    axisLabel: {
        color: '#8A8D9F',
        fontSize: 12,
        fontWeight: 'bold',
    },
    barChartContainer: {
        flex: 1,
        paddingLeft: 3,
    },
    dayLabel: {
        color: '#8A8D9F',
        fontSize: 11,
        fontWeight: 'bold',
        marginTop: 8,
        textAlign: 'center',
    },
    innerBar: {
        width: '100%',
        backgroundColor: '#2D6BFF',
        borderRadius: 3,
    },
    currentMarker: {
        width: 16,
        height: 16,
        borderRadius: 3,
        borderWidth: 2,
        borderColor: 'white',
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    markerInner: {
        width: 10,
        height: 10,
        backgroundColor: 'white',
        borderRadius: 1,
    },
    legend: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 15,
    },
    legendColor: {
        width: 12,
        height: 12,
        borderRadius: 2,
        marginRight: 5,
    },
    targetLegend: {
        backgroundColor: '#2D6BFF',
    },
    reachedLegend: {
        backgroundColor: '#D6E4FF',
    },
    currentLegend: {
        borderWidth: 2,
        borderColor: '#CCCCCC',
        backgroundColor: 'transparent',
    },
    legendText: {
        color: '#8A8D9F',
        fontSize: 14,
    },
    systolicLegend: {
        backgroundColor: '#2D6BFF',
    },
    diastolicLegend: {
        backgroundColor: '#D6E4FF',
    },
    riskAssessmentContainer: {
      marginHorizontal: 20,
      marginBottom: 10,
    },
    riskAssessmentTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 15,
    },
    riskCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'white',
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 5,
      elevation: 1,
    },
    iconContainer: {
      width: 50,
      height: 50,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    riskInfoContainer: {
      flex: 1,
    },
    riskTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 4,
    },
    riskDescription: {
      fontSize: 14,
      color: '#666',
    },
    riskBadge: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 16,
    },
    riskBadgeText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 12,
    },
    liverIcon: {
      width: 18,
      height: 18,
      resizeMode: 'contain',
    },
    kidneyIcon: {
      width: 18,
      height: 18,
      resizeMode: 'contain',
    },
})

export default BloodPressureStatsScreen;