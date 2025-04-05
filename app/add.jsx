import React, { useState } from 'react';  
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const Add = () => {
  const [itemAdded, setItemAdded] = useState(false);
  const [itemName, setItemName] = useState('');  // Assuming you're taking item name from a TextInput
  const [location, setLocation] = useState('');  // Similarly for location

  // Simulate adding to the database and show the pop-up
  const handleAddItem = () => {
    if (!itemName || !location) {
      Alert.alert('Error', 'Please enter both item name and location.');
      return;
    }

    // Simulate adding to a database here.
    setItemAdded(true);

    // Show pop-up with success message
    Alert.alert('Success', 'The item has been added to the database', [
      { text: 'OK', onPress: () => console.log('Item added') },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Item Name */}
      <Text style={styles.text}>Item: {itemName}</Text>
      
      {/* Location */}
      <Text style={styles.text}>Location: {location}</Text>

      {/* Add Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleAddItem}
      >
        <Text style={styles.buttonText}>Add Item to Database</Text>
      </TouchableOpacity>

      {/* Show message once item is added */}
      {itemAdded && (
        <Text style={styles.successMessage}>Item added successfully!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#1fc485',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  successMessage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
    marginTop: 20,
  },
});

export default Add;
