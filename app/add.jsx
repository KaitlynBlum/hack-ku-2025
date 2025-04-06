import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const Add = () => {
  const [itemAdded, setItemAdded] = useState(false);
  const [itemName, setItemName] = useState('');
  const [location, setLocation] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleTakePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('🚫 Permission required', 'Camera access is required to take a photo.');
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
      Alert.alert('⚠️ Error', 'Please enter both item name and location.');
      return;
    }

    const body = {
      name: itemName,
      location: location,
      action: action,
    };

    if (imageUri) {
      setUploading(true);
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
        Alert.alert('❌ Error', 'Image upload failed.');
      } finally {
        setUploading(false);
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
          '⚠️ Duplicate Item',
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
        Alert.alert('✅ Success', data.message);
        setItemName('');
        setLocation('');
        setImageUri(null);
      }
    } catch (error) {
      console.error("Error while sending:", error);
      Alert.alert('❌ Error', 'Could not connect to server');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.glassCard}>
        <Text style={styles.header}>📝 Add New Item</Text>

        <TextInput
          placeholder="Enter item name 🏷️"
          placeholderTextColor="gray"
          value={itemName}
          onChangeText={setItemName}
          style={styles.input}
        />
        <TextInput
          placeholder="Enter location 📍"
          placeholderTextColor="gray"
          value={location}
          onChangeText={setLocation}
          style={styles.input}
        />

        {imageUri && (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        )}

        {uploading && <ActivityIndicator size="large" color="#00ffd5" style={styles.loader} />}

        <TouchableOpacity style={styles.glassButton} onPress={handleTakePhoto}>
          <Text style={styles.buttonText}>📸 Take Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.glassButton} onPress={() => handleAddItem('check')}>
          <Text style={styles.buttonText}>✅ Add Item</Text>
        </TouchableOpacity>

        {itemAdded && (
          <Text style={styles.successMessage}>🎉 Item added successfully!</Text>
        )}
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
    paddingHorizontal: 20,
  },
  glassCard: {
    width: '100%',
    padding: 30,
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
  header: {
    fontSize: 28,
    fontWeight: '800',
    fontFamily: 'SpaceMono',
    color: '#00ffd5',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#00ffd5',
    fontSize: 18,
    marginBottom: 20,
    padding: 10,
    fontFamily: 'SpaceMono',
    color: '#00ffd5',
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
    borderColor: '#00ffd5',
    borderWidth: 2,
  },
  loader: {
    marginBottom: 20,
  },
  glassButton: {
    backgroundColor: 'rgba(0, 255, 213, 0.15)',
    borderColor: 'rgba(0, 255, 213, 0.4)',
    borderWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#00ffd5',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'SpaceMono',
  },
  successMessage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00ffd5',
    marginTop: 20,
    fontFamily: 'SpaceMono',
  },
});

export default Add;