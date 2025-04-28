import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C2C2C',
    paddingHorizontal: 1,
    paddingTop: 5,
  },
  toggleButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    marginTop: 10,
  },

  toggleButtonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 20,
  },
  orderCard: {
    backgroundColor: '#3B3B3B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#00ff99',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 6,
  },
  orderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  addressDetails: {
    flex: 1,
  },
  addressText: {
    color: '#B0BEC5',
    fontSize: 14,
    fontWeight: '600',
  },
  destinationText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4,
  },
  priceContainer: {
    marginTop: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  priceText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  headerContainer: {
    backgroundColor: '#1A1A1A',
    elevation: 4,
    marginBottom: 5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  infoDrivers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 2,
    width: '100%',
    // borderBlockColor: '#4CAF50',
    // borderBottomWidth: 1,
    marginBottom: 10
  },
  menuBar: {
    backgroundColor: '#1A1A1A',
    height: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  headerName: {
    color: '#EEEEEE',
    fontSize: 17,
    marginBottom: 4,
    marginLeft: 5,
    marginRight: 5,
    padding: 5,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: 'white',
    fontSize: 16,
    marginBottom: 4,
    marginLeft: 5,
    marginRight: 5,
    fontWeight: '800',
  },
  averageRatingText: {
    // borderWidth: 1,
    // borderColor: 'white',
    color: 'white',
    paddingHorizontal: 7,
    paddingVertical: 5,
    fontWeight: '800',
  },
  locationSelector: {
    position: 'relative',
    marginVertical: 10,
  },
  dropdownButton: {
    padding: 15,
    backgroundColor: '#4A4A4A',
    borderRadius: 5,
    width: '100%',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  dropdownContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    zIndex: 1,
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'black',
    width: '80%',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#ECD3B4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 2,
    color: 'black'
  },
  closeButton: {
    backgroundColor: '#FF5C5C',
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
  },
  closeButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
  },

});

export default styles;