import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const Add = () => {
  const [itemAdded, setItemAdded] = useState(false);
  const [itemName, setItemName] = useState('');
  const [location, setLocation] = useState('');
  const [imageUri, setImageUri] = useState(null);

  const handleTakePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Camera access is required to take a photo.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.6,
      base64: true,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleAddItem = async (action = 'check') => {
    if (!itemName || !location) {
      Alert.alert('Error', 'Please enter both item name and location.');
      return;
    }

    const body = {
      name: itemName,
      location: location,
      action: action,
    };

    if (imageUri) {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const formData = new FormData();

      formData.append('image', {
        uri: imageUri,
        name: `${itemName}_${Date.now()}.jpg`,
        type: 'image/jpeg',
      });

      try {
        const uploadRes = await fetch('http://10.104.117.117:5050/upload-image', {
          method: 'POST',
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (uploadData.imageUrl) {
          body.imageUrl = uploadData.imageUrl;
        }
      } catch (error) {
        console.error('Image upload failed:', error);
      }
    }

    try {
      const response = await fetch('http://10.104.117.117:5050/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.duplicate) {
        Alert.alert(
          'Duplicate Item',
          data.message,
          [
            { text: 'Overwrite', onPress: () => handleAddItem('overwrite'), style: 'destructive' },
            { text: 'Create New', onPress: () => handleAddItem('createNew') },
            { text: 'Cancel', style: 'cancel' },
          ],
          { cancelable: true }
        );
      } else {
        setItemAdded(true);
        Alert.alert('Success', data.message);
        setItemName('');
        setLocation('');
        setImageUri(null);
      }
    } catch (error) {
      console.error("Error while sending:", error);
      Alert.alert('Error', 'Could not connect to server');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter item name"
        value={itemName}
        onChangeText={setItemName}
        style={styles.input}
      />
      <TextInput
        placeholder="Enter location"
        value={location}
        onChangeText={setLocation}
        style={styles.input}
      />

      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
      )}

      <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
        <Text style={styles.buttonText}>Take Photo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => handleAddItem('check')}>
        <Text style={styles.buttonText}>Add Item to Database</Text>
      </TouchableOpacity>

      {itemAdded && (
        <Text style={styles.successMessage}>Item added successfully!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20,
  },
  input: {
    width: '100%', borderBottomWidth: 1, borderColor: '#ccc',
    fontSize: 18, marginBottom: 20, padding: 10,
  },
  imagePreview: {
    width: 200, height: 200, marginBottom: 20, borderRadius: 10,
  },
  button: {
    backgroundColor: '#1fc485', paddingVertical: 15, paddingHorizontal: 40,
    borderRadius: 20, marginTop: 10, alignItems: 'center', justifyContent: 'center',
  },
  buttonText: {
    color: 'white', fontSize: 18, fontWeight: 'bold',
  },
  successMessage: {
    fontSize: 16, fontWeight: 'bold', color: 'green', marginTop: 20,
  },
});

export default Add;
