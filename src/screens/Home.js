import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, Modal } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/HomeStyle';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const DriverHome = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [driverDetails, setDriverDetails] = useState({});
  const [driverIds, setDriverIds] = useState(null);
  const [limit, setLimit] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  const [ratingCount, setRatingCount] = useState({});
  const [error, setError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const allowedLocations = ['Yuxarı Tala', 'Aşağı Tala', 'Göyəm', 'Car', 'Kebeloba', 'Zilban', 'Muxax', 'Axax Dərə'];
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const navigations = useNavigation();
  const [orderPrices, setOrderPrices] = useState(false);
  

  const toggleAtWork = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const driverId = driverDetails._id;

      // Toggle atWork property
      const newAtWorkStatus = !driverDetails.atWork; // Flip the current status

      // Update the driver's state on the server
      await axios.put(`http://192.168.100.43:3000/api/drivers/${driverId}`, { atWork: newAtWorkStatus }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // Update state locally
      setDriverDetails(prevState => ({ ...prevState, atWork: newAtWorkStatus }));

    } catch (error) {
      Alert.alert('Hata', 'Atwork durumu güncellenirken bir hata oluştu.');
      console.error("Error toggling atWork:", error);
    }
  };


  useEffect(() => {
    fetchDriverDetails();
  }, []);

  useEffect(() => {
    fetchOrders();

    const intervalId = setInterval(fetchOrders, 8000);
    return () => clearInterval(intervalId);
  }, [selectedLocation]);

  useEffect(() => {
    if (driverIds) {
      fetchLimit();
      fetchRating();
    }
  }, [driverIds]);

  const fetchDriverDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const driverId = await AsyncStorage.getItem('driverId');

      if (driverId) {
        const response = await axios.get(`http://192.168.100.43:3000/api/drivers/profile/${driverId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setDriverDetails(response.data);
        setDriverIds(driverId);
      }
    } catch (error) {
      console.error("Error fetching driver details: ", error);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get('http://192.168.100.43:3000/api/taxis/requests', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const availableOrders = response.data.filter(order => !order.isTaken);
      const filteredOrders = selectedLocation
        ? availableOrders.filter(order =>
          order.currentAddress &&
          order.currentAddress.toLowerCase().includes(selectedLocation.toLowerCase())
        )
        : availableOrders;

      setOrders(filteredOrders);
      // fetchLimit();

    } catch (error) {
      Alert.alert('Hata', 'Sifarişler alınırken bir hata oluştu.');
      console.error("Error fetching orders: ", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLimit = async () => {
    try {
      const response = await fetch(`http://192.168.100.43:3000/api/drivers/${driverIds}/limit`);
      const data = await response.json();
      if (data.limit !== undefined) {
        setLimit(data.limit);
        // console.log(data.limit)
      } else {
        setError('Limit bilgisi bulunamadı');
      }

      if (data.limit < 0.15) {
        navigations.navigate('Members');

      }
    } catch (err) {
      setError('Sunucu hatası: ' + err.message);
    }
  };

  const fetchRating = async () => {
    try {
      const response = await fetch(`http://192.168.100.43:3000/api/drivers/${driverIds}/rate`);
      const data = await response.json();
      if (data.averageRating !== undefined) {
        setAverageRating(data.averageRating);
        setRatingCount(data.ratingCount || {});
      } else {
        setError('Puan bilgisi bulunamadı');
      }
    } catch (err) {
      setError('Sunucu hatası: ' + err.message);
    }
  };

  const renderRatings = () => {
    return (
      <View style={styles.ratingContainer}>
        {Object.keys(ratingCount).map((rating) => (
          <Text key={rating} style={styles.ratingText}>
            <Icon name="star" size={18} color="#f8c291" /> {rating} Ulduz: {ratingCount[rating]}
          </Text>
        ))}
        {averageRating && <Text style={{ borderWidth: 1, borderColor: 'white', }}>Ortalama Xal: {averageRating}</Text>}
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  };

  const handleSelectOrder = (order) => {
    Alert.alert(
      "Sipariş Seçimi",
      `Sifarişi almaq istəyirsən?\nQiymet: ${order.price.toFixed(2)} AZN`,
      [
        {
          text: "Xeyr",
          onPress: () => console.log("İptal edildi"),
          style: "cancel"
        },
        {
          text: "Hə",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              const driverId = driverDetails._id;
  
              // Set onOrder to true
              await axios.put(`http://192.168.100.43:3000/api/drivers/${driverId}`, { onOrder: true }, {
                headers: { 'Authorization': `Bearer ${token}` }
              });
  
              // Take the order
              const takeOrderResponse = await axios.post('http://192.168.100.43:3000/api/taxis/takeOrder', {
                requestId: order._id,
                tel: order.tel,
                name: order.name,
                driverId: driverId
              }, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                }
              });
  
              await updateDriverLimit(driverId, order.price);
              await updateDriverDailyEarnings(driverId, order.price);
              await updateDriverDailyOrderCount(driverId)
              fetchDriverDetails();
              fetchLimit();
              setOrders(orders.filter(o => o._id !== order._id));
              navigation.navigate('OrderDetails', { order });
            } catch (error) {
              Alert.alert('Hata', 'Sipariş alınırken bir hata oluştu.');
              console.error("Error taking order: ", error);
            }
          }
        }
      ],
      { cancelable: false }
    );
  };

  // Update driver's balance based on the order price
  const updateDriverLimit = async (driverId, orderPrice) => {
    try {
      const token = await AsyncStorage.getItem('token');

      // Get the integer part of the order price
      const integerPart = Math.floor(orderPrice);

      // Calculate deduction amount based on the integer part of the price
      const deductionAmount = integerPart * 0.15;

      // Calculate new limit 
      const newLimit = driverDetails.limit - deductionAmount;
      newLimit.toFixed(2)

      const response = await axios.put(`http://192.168.100.43:3000/api/drivers/${driverId}/updateLimit`, { limit: newLimit }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      // Update driver details in state
      setDriverDetails(prevState => ({ ...prevState, limit: newLimit }));
    } catch (error) {
      Alert.alert('Hata', 'Sürücü bakiyesi güncellenirken bir hata oluştu.');
      console.error("Limit Update Error: ", error.message);
    }
  };

  const updateDriverDailyEarnings = async (driverId, orderPrice) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(`http://192.168.100.43:3000/api/drivers/${driverId}/updateDailyEarnings`, { earnings: orderPrice }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (error) {
      Alert.alert('Hata', 'Sürücü günlük kazanç güncellenirken bir hata oluştu.');
      console.error("Update Daily Earnings Error: ", error.message);
    }
  };

  const updateDriverDailyOrderCount = async (driverId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(`http://192.168.100.43:3000/api/drivers/${driverId}/updateOrderCount`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (error) {
      Alert.alert('Hata', 'Sürücü sipariş sayısını güncellerken bir hata oluştu.');
      console.error("Update Error: ", error.message);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleSelectOrder(item)} style={styles.orderCard}>
      <View style={styles.orderContent}>
        <View style={styles.addressDetails}>
          <Text style={styles.addressText}>Müştəri Adresi:</Text>
          <Text style={styles.destinationText}>{item.currentAddress}</Text>
        </View>
      </View>
      <View style={styles.orderContent}>
        <View style={styles.addressDetails}>
          <Text style={styles.addressText}>Gedilecek Adres:</Text>
          <Text style={styles.destinationText}>{item.destinationAddress}</Text>
        </View>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.priceText}>Qiymet: {item.price.toFixed(1)} AZN</Text>
      </View>
    </TouchableOpacity>
  );

  // if (loading) {
  //   return <ActivityIndicator size="small" color="#0000ff" />;
  // }

  const handleSelect = (location) => {
    setSelectedLocation(location);
    fetchOrders();
    setDropdownOpen(false);
  };

  return (
    <View style={styles.container}>
      {/* Header Component */}
      <View style={styles.headerContainer}>
        <View style={styles.infoDrivers}>
          <Text style={styles.headerName}>{driverDetails.firstName}</Text>
          <Text style={styles.headerSubtitle}>
            Balans: {limit ? `${limit.toFixed(2)} ₼` : '0'}
          </Text>

        </View>
        <View style={styles.infoDrivers}>
          <Text style={styles.averageRatingText}>Günlük Sifariş: {driverDetails.dailyOrderCount}</Text>
          <Text style={styles.averageRatingText}>Qazanc: {driverDetails.dailyEarnings ? `${driverDetails.dailyEarnings.toFixed(1)} ₼` : '0'}</Text>
          <Text onPress={() => setModalVisible(true)} style={styles.averageRatingText}>Ortalama Xal: {averageRating}</Text>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Xal Məlumatı</Text>
            {renderRatings()}
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Bağla</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>



      <View style={styles.locationSelector}>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setDropdownOpen(!dropdownOpen)}
        >
          <Text style={styles.dropdownButtonText}>
            {selectedLocation ? selectedLocation : 'Mənə Yaxın Ərazi'}
          </Text>
        </TouchableOpacity>

        {dropdownOpen && (
          <View style={styles.dropdownContainer}>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => handleSelect(null)}
            >
              <Text style={styles.dropdownItemText}>Bütün Sifarişler</Text>
            </TouchableOpacity>

            {allowedLocations.map(location => (
              <TouchableOpacity
                key={location}
                style={styles.dropdownItem}
                onPress={() => handleSelect(location)}
              >
                <Text style={styles.dropdownItemText}>{location}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      <TouchableOpacity onPress={toggleAtWork} style={styles.toggleButton}>
        <Text style={styles.toggleButtonText}>{driverDetails.atWork ? 'İşdə' : 'İşdə Değil'}</Text>
      </TouchableOpacity>

      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default DriverHome;