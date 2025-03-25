import React, { useState } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';

const { width } = Dimensions.get('window');

const MyCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

//   const renderItem = ({ item }) => (
//     <View>
//       <Text>{item}</Text>
//     </View>
//   );

    const data = [];
    for (let i = 0; i < 10; i++) {
        data.push({
            id: i,
            title: `Card ${i + 1}`,
            image: require('../assets/welcome-illustration.jpg'),
            color: i % 2 === 0 ? '#FF5733' : '#33FF57',
        });
    }

    return (
        <View>
        </View>
    );
};

export default MyCarousel;
