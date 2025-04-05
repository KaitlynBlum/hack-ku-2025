import React, { useState } from 'react'; 
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native'; 
import { useRouter } from 'expo-router'; 
import Add from './add'; // Import the Add component 

const Index = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);  // State for modal visibility

  const handleItemAdded = () => {
    setIsModalVisible(true);  // Show the pop-up when the item is added
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);  // Close the pop-up
  };

  return (
    <View style={styles.container}>
      {/* Add Item Button */}
      <Add onItemAdded={handleItemAdded} />

      {/* Pop-up Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Item has been added to the database!</Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleCloseModal}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#1fc485',
    padding: 10,
    borderRadius: 20,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Index;
