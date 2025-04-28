import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LastOrder = ({ navigation }) => {
    const [lastOrder, setLastOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchLastOrder();
    }, []);

    const fetchLastOrder = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const driverId = await AsyncStorage.getItem('driverId');

            const response = await axios.get(`http://192.168.100.43:3000/api/drivers/${driverId}/last-order`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setLastOrder(response.data);
        } catch (error) {
            setError('Son sipariş alınırken bir hata oluştu.');
            console.error("Son sipariş hata: ", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Text style={styles.loadingText}>Yükleniyor...</Text>;
    if (error) return <Text style={styles.errorText}>{error}</Text>;

    if (!lastOrder) {
        return <Text style={styles.infoText}>Henüz bir sipariş yok.</Text>;
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Son Sipariş Detayları</Text>
            <InfoContainer title="Müştəri Adresi" value={lastOrder.currentAddress} />
            <InfoContainer title="Gedilecek Adres" value={lastOrder.destinationAddress} />
            <InfoContainer title="Ad" value={lastOrder.name} />
            <InfoContainer title="Telefon" value={lastOrder.tel} />
            <InfoContainer title="Qiymet" value={`${lastOrder.price.toFixed(2)} AZN`} />

            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.backButtonText}>Geri Dön</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const InfoContainer = ({ title, value }) => {
    return (
        <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>{title}:</Text>
            <Text style={styles.infoValue}>{value}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
        backgroundColor: '#f7f7f7',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    infoContainer: {
        marginBottom: 12,
        padding: 12,
        backgroundColor: 'black',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    infoTitle: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    infoValue: {
        fontSize: 14,
        marginTop: 4,
    },
    loadingText: {
        textAlign: 'center',
        marginTop: 20,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
    backButton: {
        marginTop: 20,
        padding: 12,
        backgroundColor: '#3498db',
        borderRadius: 8,
        alignItems: 'center',
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default LastOrder;