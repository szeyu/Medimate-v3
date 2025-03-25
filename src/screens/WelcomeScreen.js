import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import CardCarousel from "../../components/CardCarousel";
import HomeScreen from "./HomeScreen";

const OnboardingScreen = () => {
  const navigation = useNavigation();

  return (
    <CardCarousel navigation={navigation}/>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#fff",
    paddingBottom: 0,
  },
  image: {
    width: "100%",
    height: 250,
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
    paddingHorizontal: 20,
  },
  pagination: {
    flexDirection: "row",
    marginVertical: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#3D5AFE",
  },
  button: {
    backgroundColor: "#3D5AFE",
    paddingVertical: 14,
    width: "90%",
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkText: {
    color: "#3D5AFE",
    marginTop: 15,
    fontSize: 14,
    fontWeight: "500",
  },
  carouselItem: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    marginHorizontal: 10,
  },
  cardCarousel: {
    width: "100%",
    height: 2000,
  },
});

export default OnboardingScreen;
