import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, TextInput, StyleSheet, ScrollView, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import haversine from 'haversine';

const LastOrder = ({ route, navigation }) => {
    const { orderId } = route.params;
    const [orderData, setOrderData] = useState(null);
    const [time, setTime] = useState('');
    const [distance, setDistance] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [coordinates, setCoordinates] = useState(null);
    const [isConfirmed, setIsConfirmed] = useState(false);

    const fetchOrders = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get('http://192.168.100.43:3000/api/taxis/requests', {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            const data = response.data;
            const foundOrder = data.find(item => item._id === orderId);

            if (foundOrder) {
                setOrderData(foundOrder);
            } else {
                console.log('Sipariş bulunamadı');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            Alert.alert('Hata', 'Siparişler alınırken hata oluştu');
        }
    };

    useEffect(() => {
        if (orderId) fetchOrders();
    }, [orderId]);


    const handleCompleteOrder = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const driverId = await AsyncStorage.getItem('driverId');

            // Calling the endpoint to set onOrder to false
            const response = await axios.put(`http://192.168.100.43:3000/api/drivers/${driverId}`, { onOrder: false }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            updateDriverDailyEarnings(driverId, order.price);
            updateDriverDailyOrderCount(driverId);

            Alert.alert('Başarılı', 'Sifariş tamamlandı.');
            navigation.goBack(); // Optionally navigate back to the previous screen

        } catch (error) {
            console.error('Sipariş tamamlama hatası:', error);
            Alert.alert('Hata', 'Sipariş tamamlarken bir hata oluştu.');
        }
    };

    const handleUpdatePrice = async () => {
        if (!time || isNaN(time)) {
            return;
        }

        try {
            const token = await AsyncStorage.getItem('token');
            const driverId = await AsyncStorage.getItem('driverId');

            const payload = {
                requestId: order._id,
                time: parseFloat(time),
                driverId,
            };

            const response = await axios.post('http://192.168.100.43:3000/api/taxis/updatePrice', payload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            setTime('');
        } catch (error) {
            console.error('Güncelleme hatası:', error);
            const errorMessage = error.response ? error.response.data.message : 'Qiymət güncellenirken bir hata oluşdu.';
            Alert.alert('Hata', errorMessage);
        }
    };

    const handleOpenMap = (address) => {
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
        Linking.openURL(url).catch((err) => {
            console.error('Error opening maps:', err);
            Alert.alert('Hata', 'Harita açarken bir hata oluştu.');
        });
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <Text style={styles.header}>Sifariş Detalları</Text>

                {orderData ? (
                    <>
                        <TouchableOpacity style={styles.orderInfos} onPress={() => handleOpenMap(orderData.currentAddress)}>
                            <InfoContainer icon="location-on" title="Müştəri ünvanı" value={orderData.currentAddress} />
                            <InfoContainer title="Müştəri Kordinatı" value={`${orderData.coordinates.latitude},${orderData.coordinates.longitude}`} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.orderInfos} onPress={() => handleOpenMap(orderData.destinationAddress)}>
                            <InfoContainer title="Varış Noktası" value={orderData.destinationAddress} />
                        </TouchableOpacity>

                        <InfoContainer title="Saat" value={orderData.time || 'Bilinmiyor'} />
                        <InfoContainer title="Alındı mı?" value={orderData.isTaken ? 'Evet' : 'Hayır'} />
                        <InfoContainer title="Onaylandı mı?" value={orderData.isConfirmed ? 'Evet' : 'Hayır'} />

                        <InfoContainer title="Ek Bilgi" value={orderData.additionalInfo || 'Yok'} />
                        <InfoContainer title="Müşteri Adı" value={orderData.name || 'Yok'} />
                        <InfoContainer title="Müşteri Telefonu" value={orderData.tel || 'Yok'} />

                        <InfoContainer title="Fiyat" value={`${orderData.price.toFixed(1) + ' ₼'}`} />

                        <View style={styles.timeOptionsContainer}>
                            {[1, 3, 5, 10, 15, 20].map((minute) => (
                                <TouchableOpacity
                                    key={minute}
                                    style={[
                                        styles.timeOptionButton,
                                        time === minute.toString() && styles.timeOptionButtonSelected
                                    ]}
                                    onPress={() => {
                                        setTime(minute.toString());
                                        handleUpdatePrice(minute.toString());
                                    }}
                                >
                                    <Text style={styles.timeOptionText}>{minute} {'\n'}Dəq</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity style={styles.completeOrderButton} onPress={handleCompleteOrder}>
                            <Text style={styles.completeOrderButtonText}>Sifarişi Tamamla</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <Text style={styles.infoText}>Yüklənir...</Text>
                )}
            </ScrollView>
            {/* <Text style={styles.dateText}>📅 Tarih: {new Date(orderData.date).toLocaleString()}</Text> */}

        </View>
    );
};

const InfoContainer = ({ icon, title, value }) => {
    return (
        <View style={styles.infoContainer}>
            <Icon name={icon} size={28} color="#4A90E2" />
            <View style={styles.textContainer}>
                <Text style={styles.infoTitle}>{title}:</Text>
                <Text style={styles.infoValue}>{value}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        padding: 16,
    },
    scrollViewContent: {
        paddingBottom: 100,
    },
    completeOrderButton: {
        backgroundColor: '#4CAF50', // Green color for the button
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    completeOrderButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    timeOptionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 20,
        paddingHorizontal: 1,
    },
    timeOptionButton: {
        backgroundColor: '#222', // Normal düymə rengi
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 12,
        margin: 5,
        borderWidth: 1,
        borderColor: '#4CAF50', // Yaşıl kontur
    },
    timeOptionButtonSelected: {
        backgroundColor: '#4CAF50', // Seçilən düymənin arxa fonu (yaşıl)
    },
    timeOptionText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },

    header: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FCD34D',
        textAlign: 'center',
        marginVertical: 16,
    },
    circle: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginRight: 8,
    },
    statusText: {
        fontSize: 16,
        color: 'white',
        paddingVertical: 12,
        paddingHorizontal: 8,
    },
    orderInfos: {
        backgroundColor: '#1F1F1F',
        borderRadius: 12,
        padding: 12,
        marginVertical: 8,
    },
    orderInfos2: {
        backgroundColor: '#1F1F1F',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#262626',
        borderRadius: 12,
        padding: 12,
        marginVertical: 6,
    },
    textContainer: {
        marginLeft: 12,
        flex: 1,
    },
    infoTitle: {
        fontSize: 14,
        color: '#A1A1AA',
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#F4F4F5',
    },
    priceInput: {
        backgroundColor: '#1F2937',
        color: '#FFF',
        padding: 12,
        borderRadius: 10,
        fontSize: 16,
        marginVertical: 12,
    },
    button: {
        flexDirection: 'row',
        backgroundColor: '#22C55E',
        paddingVertical: 14,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginTop: 10,
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    infoText: {
        color: '#FFF',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
});

export default LastOrder;