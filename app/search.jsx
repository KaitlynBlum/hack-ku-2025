import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const Search = () => {
  const router = useRouter();
  const { searchItem } = router.query || {}; // Access passed search parameter, handle case when undefined
  const [searchInput, setSearchInput] = useState(''); // Local state for search input

  // Handle the search input change and update the router query
  const handleSearch = () => {
    router.push({
      pathname: '/search',
      query: { searchItem: searchInput }, // Pass updated search query
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search</Text>

      {/* Search Bar and Button */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchInput}
          onChangeText={setSearchInput} // Update the local state
          placeholder="Enter item to search"
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch} // Trigger the search functionality
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Display search results */}
      {searchItem ? (
        <Text style={styles.results}>Searching for: {searchItem}</Text>
      ) : (
        <Text style={styles.results}>No search item provided</Text>
      )}
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
  results: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
});

export default Search;
