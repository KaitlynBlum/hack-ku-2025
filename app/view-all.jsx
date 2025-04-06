import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, SafeAreaView, Alert, TouchableOpacity } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

export default function ViewAll() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('http://10.104.117.117:5050/all-items');
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format');
      }
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
      setError('Failed to load items. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemName) => {
    Alert.alert(
      "Delete Item",
      `Are you sure you want to delete '${itemName}'?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive', onPress: async () => {
            try {
              const response = await fetch(`http://10.104.117.117:5050/delete-item?name=${itemName}`, {
                method: 'DELETE',
              });
              if (!response.ok) {
                throw new Error('Failed to delete item');
              }
              setItems(prev => prev.filter(item => item.name !== itemName));
            } catch (error) {
              console.error("Delete error:", error);
              Alert.alert('Error', 'Failed to delete item.');
            }
          }
        }
      ]
    );
  };

  const renderRightActions = (itemName) => (
    <TouchableOpacity style={styles.deleteBox} onPress={() => handleDelete(itemName)}>
      <Text style={styles.deleteText}>Delete</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => {
    if (!item || !item.name) return null;

    return (
      <Swipeable renderRightActions={() => renderRightActions(item.name)}>
        <View style={styles.card}>
          <Text style={styles.itemName}>{item.name}</Text>
          {item.photo && <Image source={{ uri: item.photo }} style={styles.image} />}
          {item.locations && item.locations.length > 0 ? (
            item.locations.map((loc, idx) => (
              <Text key={idx} style={styles.location}>• {loc}</Text>
            ))
          ) : (
            <Text style={styles.locationEmpty}>No saved locations</Text>
          )}
        </View>
      </Swipeable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.glassCard}>
        <Text style={styles.title}>📦 All Stored Items</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#00ffd5" />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item, index) => (item.name || 'unknown') + index}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  glassCard: {
    width: '100%',
    padding: 20,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 255, 213, 0.1)',
    borderColor: 'rgba(0, 255, 213, 0.4)',
    borderWidth: 1,
    shadowColor: '#00ffd5',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    fontFamily: 'SpaceMono',
    color: '#00ffd5',
    textAlign: 'center',
    marginBottom: 20,
  },
  list: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: 'rgba(0,255,213,0.1)',
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#00ffd5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  itemName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#00ffd5',
    fontFamily: 'SpaceMono',
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  location: {
    fontSize: 16,
    color: '#ffffff',
    fontFamily: 'SpaceMono',
  },
  locationEmpty: {
    fontSize: 16,
    color: 'gray',
    fontStyle: 'italic',
    fontFamily: 'SpaceMono',
  },
  deleteBox: {
    backgroundColor: '#ff4d4d',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 12,
    marginBottom: 15,
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  },
  error: {
    fontSize: 16,
    color: '#ff4d4d',
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'SpaceMono',
  },
});
