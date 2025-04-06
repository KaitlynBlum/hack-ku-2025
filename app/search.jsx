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
      <Text style={styles.title}>🔍 Search Items</Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchInput}
          onChangeText={setSearchInput}
          placeholder="Type item name here..."
          placeholderTextColor="gray"
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Loading Indicator */}
      {loading && <ActivityIndicator size="large" color="#1fc485" style={styles.loader} />}

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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#1fc485',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  searchInput: {
    width: '75%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    fontSize: 16,
    color: 'black',
  },
  searchButton: {
    backgroundColor: '#1fc485',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 20,
  },
  results: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 5,
    color: 'green',
  },
  location: {
    fontSize: 16,
    color: '#333',
  },
  error: {
    color: 'red',
    marginTop: 20,
    fontSize: 16,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#1fc485',
  },
  resultContainer: {
    alignItems: 'center',
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0fdf6',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
});

export default Search;
