import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Animated, PanResponder, Vibration } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const LandingScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const flipAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.05,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  }, []);

  const handleTouch = () => {
    Vibration.vibrate(50);
    Animated.timing(flipAnim, {
      toValue: 180,
      duration: 500,
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
    <Animated.View
      style={[styles.container, { transform: [{ rotateY: flip }] }]}
      {...panResponder.panHandlers}
    >
      <Animated.Image
        source={require('../assets/images/landing.png')}
        style={[styles.image, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}
        resizeMode="cover"
      />

      {/* Frosted Glass Effect */}
      <View style={styles.glassCard}>
        <Text style={styles.title}>Welcome to Tracked</Text>
        <Text style={styles.swipeText}>⬅️ Swipe or Tap to Begin</Text>
      </View>

      {/* Animated Glow Gradient */}
      <LinearGradient
        colors={["rgba(255,255,255,0.05)", "rgba(31,196,133,0.1)", "rgba(255,255,255,0.05)"]}
        style={styles.gradient}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
      />

      <View style={styles.overlay} />
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  glassCard: {
    position: 'absolute',
    top: '35%',
    paddingVertical: 30,
    paddingHorizontal: 24,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
    backdropFilter: 'blur(10px)',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 38,
    fontWeight: '900',
    color: '#ffffff',
    textShadowColor: '#1fc485',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  swipeText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    letterSpacing: 0.8,
  },
});

export default LandingScreen;
