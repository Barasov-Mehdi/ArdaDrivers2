// Sidebar.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Sidebar = ({ isVisible, onClose }) => {
  if (!isVisible) return null; // Don't render if not visible

  return (
    <View style={styles.sidebar}>
      <Text style={styles.header}>Menu</Text>
      <TouchableOpacity onPress={onClose}>
        <Text style={styles.option}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onClose}>
        <Text style={styles.option}>Orders</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onClose}>
        <Text style={styles.option}>Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onClose}>
        <Text style={styles.option}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '80%',
    height: '100%',
    backgroundColor: '#fff',
    padding: 20,
    zIndex: 10,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowOffset: { width: -2, height: 0 },
    elevation: 5
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  option: {
    fontSize: 18,
    marginVertical: 10,
  },
});

export default Sidebar;