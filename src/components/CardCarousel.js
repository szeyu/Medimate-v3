import React, { useRef } from "react";
import { View, Text, FlatList, Dimensions, Animated, StyleSheet, Image, Button, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width; // 80% of screen width
const CARD_SPACING = 20;
const ITEM_SIZE = CARD_WIDTH; // Full item size including spacing

const styles = StyleSheet.create({
    container: {
      // flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#FFFFFF",
      paddingTop: 100,
      height: 1000,
    },
    card: {
      width: CARD_WIDTH,
      height: 600,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 0,
      overflow: "hidden",
    },
    cardContent: {
      flexDirection: "columns",
      alignItems: "center",
    },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      textAlign: "center",
      marginTop: 20,
    },
    subtitle: {
      fontSize: 16,
      textAlign: "center",
      color: "gray",
      marginTop: 10,
      paddingHorizontal: 50,
    },
    cardText: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#fff",
    },
    image: {
        flex: 4,
        width: CARD_WIDTH * 0.9, // Adjust width to fit within card
        height: 250, // Fixed height
        borderRadius: 10, // Optional for styling
        paddingTop: 60,
      },
    customText: {
      fontWeight: "bold",
      textAlign: "center",
      backgroundColor: "black",
      borderRadius: 10,
      fontFamily: "Poppins",
      paddingVertical: 20,
      fontSize: 16,
      color: "#fff",
    },
    squareBox: {
      width: 60,
      height: 60,
      backgroundColor: "black",
      borderRadius: 10,
      shadowColor: "#000",
      shadowOffset: { width: 2, height: 5 },
      shadowOpacity: 0.6,
      shadowRadius: 5,
      elevation: 5,
    },
  });

const data = (navigation, handleLogin) => [
    {
      id: "1", 
      title: "Card 1", 
      color: "white",
      content: 
      <View style={styles.cardContent}>
        <Image
            source={require("../../assets/Manager Desk 2.png")}
            style={styles.image}
            resizeMode="contain"
            onError={(e) => console.log("Image load error:", e.nativeEvent.error)}
        />
        <View style={{ flex: 2, justifyContent: "flex-start", alignItems: "centre"}}>
          <Text style={styles.title}>What the Doctor Says?</Text>
          <Text style={styles.subtitle}>
          With our AI-powered transcriber, {"\n"}you never miss a word.
          </Text>
        </View>
        <View style={{ flex: 1, justifyContent: "flex-start", alignItems: "centre"}}/>
      </View>
    },
    { 
      id: "2", 
      title: "Card 2", 
      color: "white",
      content:
      <View style={styles.cardContent}>
        <Image
            source={require("../../assets/Approval 1.png")}
            style={styles.image}
            resizeMode="contain"
            onError={(e) => console.log("Image load error:", e.nativeEvent.error)}
        />
        <View style={{ flex: 2, justifyContent: "flex-start", alignItems: "centre"}}>
          <Text style={styles.title}>No Missed Meds</Text>
          <Text style={styles.subtitle}>
          Always forgetting when to take meds?{"\n"} Fred not, we got you covered.
          </Text>
        </View>
        <View style={{ flex: 1, justifyContent: "flex-start", alignItems: "centre"}}/>
    </View>
    },
    { 
      id: "3", 
      title: "Card 3", 
      color: "white",
      content:
      <View style={styles.cardContent}>
        <Image
            source={require("../../assets/Speaking AI.png")}
            style={styles.image}
            resizeMode="contain"
            onError={(e) => console.log("Image load error:", e.nativeEvent.error)}
        />
      <View style={{ flex: 2, justifyContent: "flex-start", alignItems: "centre"}}>
        <Text style={styles.title}>Talk, Instead of Typing</Text>
        <Text style={styles.subtitle}>
        Realize the power of your voice.{"\n"} Gather insights about your health with speech AI.
        </Text>
      </View>
      <View style={{ flex: 1, justifyContent: "flex-start", alignItems: "centre"}}>
          <TouchableOpacity style={styles.squareBox} onPress={() => navigation.navigate('LoginScreen')}>
            <Text style={styles.customText}>GO!</Text>
          </TouchableOpacity>
      </View>
    </View>
    },
  ];

const CardCarousel = ({ navigation, handleLogin }) => {
  const scrollX = useRef(new Animated.Value(0)).current;

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={data(navigation, handleLogin)}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_SIZE} // Snaps to each card
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: (width - CARD_WIDTH) / 2 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * ITEM_SIZE,
            index * ITEM_SIZE,
            (index + 1) * ITEM_SIZE,
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1, 0.8], // Scale effect on center card
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              style={[
                styles.card,
                { backgroundColor: item.color, transform: [{ scale }] },
              ]}
            >
              {item.content}
            </Animated.View>
          );
        }}
      />
    </View>
  );
};

export default CardCarousel;
