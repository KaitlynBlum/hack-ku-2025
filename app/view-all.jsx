import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, SafeAreaView, Alert, TouchableOpacity } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

export default function ViewAll() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('http://10.104.117.117:5050/all-items');
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
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
              await fetch(`http://10.104.117.117:5050/delete-item?name=${itemName}`, {
                method: 'DELETE',
              });
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

  const renderItem = ({ item }) => (
    <Swipeable renderRightActions={() => renderRightActions(item.name)}>
      <View style={styles.card}>
        <Text style={styles.itemName}>{item.name}</Text>
        {item.photo && <Image source={{ uri: item.photo }} style={styles.image} />}
        {item.locations.length > 0 ? (
          item.locations.map((loc, idx) => (
            <Text key={idx} style={styles.location}>• {loc}</Text>
          ))
        ) : (
          <Text style={styles.locationEmpty}>No saved locations</Text>
        )}
      </View>
    </Swipeable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>📦 All Stored Items</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#1fc485" />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item, index) => item.name + index}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1fc485',
    textAlign: 'center',
    marginBottom: 10,
  },
  list: {
    padding: 20,
  },
  card: {
    backgroundColor: '#f0fdf6',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  itemName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#222',
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  location: {
    fontSize: 16,
    color: '#555',
  },
  locationEmpty: {
    fontSize: 16,
    color: 'gray',
    fontStyle: 'italic',
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
});
