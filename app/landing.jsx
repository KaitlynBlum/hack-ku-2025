import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Animated, PanResponder } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LandingScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const flipAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleTouch = () => {
    Animated.timing(flipAnim, {
      toValue: 180,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      navigation.navigate('index');
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 20 || Math.abs(gestureState.dy) > 20;
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx < -50 || gestureState.dy < -50) {
          handleTouch();
        }
      },
    })
  ).current;

  const flip = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <Animated.View style={[styles.container, { transform: [{ rotateY: flip }] }]} {...panResponder.panHandlers}>
      <Animated.Image
        source={require('../assets/images/landing.png')}
        style={[styles.image, { opacity: fadeAnim }]}
        resizeMode="cover"
      />
      <Text style={styles.swipeText}>TOUCH OR SWIPE TO START</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    backfaceVisibility: 'hidden',
  },
  image: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  swipeText: {
    position: 'absolute',
    bottom: 40,
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default LandingScreen;
