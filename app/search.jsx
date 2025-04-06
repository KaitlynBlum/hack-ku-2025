import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ActivityIndicator, Animated } from 'react-native';
import { useRouter } from 'expo-router';

const Search = () => {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const handleSearch = async () => {
    if (!searchInput) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch(`http://10.104.117.117:5050/retrieve?name=${searchInput}`);
      const data = await response.json();

      if (response.ok) {
        setResult(data);
        setError(null);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      } else {
        setError(data.error);
        setResult(null);
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.glassCard}>
        <Text style={styles.title}>🔍 Search Items</Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            value={searchInput}
            onChangeText={setSearchInput}
            placeholder="Type item name here..."
            placeholderTextColor="#00ffd5"
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>

        {/* Loading Indicator */}
        {loading && <ActivityIndicator size="large" color="#00ffd5" style={styles.loader} />}

        {/* Results */}
        {result && (
          <Animated.View style={[styles.resultContainer, { opacity: fadeAnim }]}>
            <Text style={styles.results}>📍 Found {result.locations.length} location(s) for "{result.name}":</Text>
            {result.locations.map((loc, index) => (
              <Text key={index} style={styles.location}>• {loc}</Text>
            ))}

            {result.photo && (
              <Image source={{ uri: result.photo }} style={styles.image} />
            )}
          </Animated.View>
        )}

        {/* Error Message */}
        {error && <Text style={styles.error}>❌ {error}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f0f',
    padding: 20,
  },
  glassCard: {
    width: '100%',
    padding: 25,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 255, 213, 0.1)',
    borderColor: 'rgba(0, 255, 213, 0.4)',
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#00ffd5',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    fontFamily: 'SpaceMono',
    color: '#00ffd5',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 44,
    borderColor: 'rgba(0, 255, 213, 0.4)',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: 'rgba(0, 255, 213, 0.1)',
    color: '#00ffd5',
    fontFamily: 'SpaceMono',
  },
  searchButton: {
    backgroundColor: '#00ffd5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#0f0f0f',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'SpaceMono',
  },
  loader: {
    marginTop: 20,
  },
  results: {
    fontSize: 18,
    fontWeight: '600',
    color: '#00ffd5',
    fontFamily: 'SpaceMono',
    marginBottom: 10,
  },
  location: {
    fontSize: 16,
    color: '#ffffff',
    fontFamily: 'SpaceMono',
  },
  error: {
    color: '#ff4d4d',
    marginTop: 20,
    fontSize: 16,
    fontFamily: 'SpaceMono',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#00ffd5',
  },
  resultContainer: {
    alignItems: 'center',
    marginTop: 20,
    padding: 20,
    backgroundColor: 'rgba(0,255,213,0.1)',
    borderRadius: 20,
    shadowColor: '#00ffd5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
});

export default Search;
