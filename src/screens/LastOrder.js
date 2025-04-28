import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LastOrder = ({ navigation }) => {
  const [lastOrder, setLastOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLastOrder = async () => {
      try {
        const token = await AsyncStorage.getItem('token'); 
        const driverId = await AsyncStorage.getItem('driverId'); 
  
        if (driverId) {
          const response = await axios.get(`http://192.168.100.43:3000/api/drivers/my-orders/${driverId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          if (response.data && response.data.length > 0) {
            setLastOrder(response.data[0]); 
          } else {
            setError('No orders found.');
          }
        }
      } catch (err) {
        setError('Failed to fetch the last order. Please try again.');
        console.error('Error fetching last order: ', err);
        // additional debugging information can be logged here
      } finally {
        setLoading(false);
      }
    };
  
    fetchLastOrder();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  if (!lastOrder) {
    return <Text>No last order available.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Last Order Details</Text>
      <View style={styles.orderDetails}>
        <Text style={styles.label}>Current Address:</Text>
        <Text style={styles.value}>{lastOrder.currentAddress}</Text>
        
        <Text style={styles.label}>Destination Address:</Text>
        <Text style={styles.value}>{lastOrder.destinationAddress}</Text>
        
        <Text style={styles.label}>Price:</Text>
        <Text style={styles.value}>{lastOrder.price.toFixed(2)} AZN</Text>
        
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  orderDetails: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#f8f8f8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  label: {
    fontWeight: 'bold',
  },
  value: {
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default LastOrder;