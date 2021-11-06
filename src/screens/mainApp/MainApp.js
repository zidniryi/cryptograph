import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions
} from 'react-native';
import moment from 'moment';
import {LineChart} from 'react-native-chart-kit';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {getCrypto} from './service';
import {localItem} from '../../constants/CONSTANT';

export default function MainApp() {
  const [cryptoData, setCryptoData] = useState({});
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState({});
  const [locationStatus, setLocationStatus] = useState('');
  const [currentLocalData, setCurrentLocalData] = useState([]);

  const getOneTimeLocation = () => {
    setLocationStatus('Getting Location ...');
    Geolocation.watchPosition(
      position => {
        setLocationStatus('You are Here');

        //getting the Longitude from the location json
        const currentLocation = position;

        //Setting Longitude state
        setLocation(currentLocation);
      },
      error => {
        setLocationStatus(error.message);
        Alert.alert('Fail get location, make sure your location');
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
      },
    );
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      getOneTimeLocation();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Required',
            message: 'Cryptograph needs to Access your location',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getOneTimeLocation();
        } else {
          setLocationStatus('Permission Denied');
          Alert.alert('Permission Denied', locationStatus);
        }
      } catch (err) {
        Alert.alert('Fail get location, make sure your location');
      }
    }
  };

  /**
   * Get Api
   */
  const getCryptoApi = async () => {
    setIsLoading(true);

    try {
      const response = await getCrypto();

      setCryptoData(response);
      setIsLoading(false);
      setIsError(false);
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
    }
  };
  const cryptoDataWithLocation = {
    cryptoData,
    location,
  };

  /**
   * Save To Local Data
   * if user refetch
   * @returns {Promise} for saving data
   */
  const saveToLocalData = async () => {
    const value = await AsyncStorage.getItem(localItem);

    try {
      let arr = JSON.parse(value) || [];
      const checkingData =
        cryptoDataWithLocation.cryptoData && cryptoDataWithLocation.location
          ? cryptoDataWithLocation
          : arr[arr.length - 1];
      arr.push(checkingData);
      await AsyncStorage.setItem(localItem, JSON.stringify(arr));
      getData();
    } catch (e) {
      Alert.alert('Device error save data, please reopen app');
    }
  };

  /**
   * If user alredy have 5 latest data
   * Then index array[0] will delete
   * At the same time will recursion @function getData
   * Like linked list will update from the Head
   * @returns {Promise} for deleting old data
   */
  const deleteOldData = async () => {
    const value = await AsyncStorage.getItem(localItem);

    try {
      let arr = JSON.parse(value) || [];
      const checkingData =
        cryptoDataWithLocation.cryptoData && cryptoDataWithLocation.location
          ? cryptoDataWithLocation
          : arr[arr.length - 1];
      arr.shift(checkingData);
      await AsyncStorage.setItem(localItem, JSON.stringify(arr));
      getData();
    } catch (e) {
      // saving error
    }
  };

  /**
   * Checking current data if less than 5 || empty
   * @returns {Promise} for check old data and new data
   */
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem(localItem);
      const localData = JSON.parse(value);
      setCurrentLocalData(localData);
      getCryptoApi();

      if (localData) {
        if (localData.length > 5) {
          deleteOldData();
        }
      } else {
        saveToLocalData();
      }
    } catch (error) {
      // error reading value
   Alert.alert(error)
    }
  };

  useEffect(() => {
    getCryptoApi();
    requestLocationPermission();
    getData();
  }, []);

  /**
   * Find data array for chart
   *
   * @param {string} option - option
   * @returns {Array} - Data array
   */
  const forDataChart = option => {
    let arrayChart = [];
    if (option === 'price') {
      const resultChart =
        currentLocalData?.length > 0 &&
        currentLocalData?.map((data, index) => data?.cryptoData?.bpi?.USD?.rate_float);

      return resultChart ? resultChart : [61];
    } else {
      const resultChart =
        currentLocalData?.length > 0 &&
        currentLocalData?.map((data, index) =>
        // console.log(data, "Saya")
          moment(data?.cryptoData.time?.updatedISO).format('HH:mm'),
        );
      return resultChart
    }
  };

  console.log()
  console.log()
  const _renderChart = () => {
    let arrayLabels = []
    let arrayPrice = []
    const oldPrice = parseFloat(cryptoData?.bpi?.USD?.rate_float.toFixed(2))
    arrayLabels.push(forDataChart('time'))
    console.log([forDataChart('price')], "Price")


    if (cryptoData || currentLocalData)
      return (
  <LineChart
    data={{
      labels: forDataChart('time'),
      datasets: [
        {
          data: forDataChart('price'),
        
        },
      ]
    }}
    width={Dimensions.get("window").width} // from react-native
    height={220}
    yAxisLabel="$"
    yAxisInterval={2} // optional, defaults to 1
    chartConfig={{
      backgroundColor: "#e26a00",
      backgroundGradientFrom: "#fb8c00",
      backgroundGradientTo: "#ffa726",
      decimalPlaces: 2, // optional, defaults to 2dp
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      style: {
        borderRadius: 16
      },
      propsForHorizontalLabels:{
        fontSize:9,
      },
      propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: "#ffa726"
      }
    }}
    bezier
    style={{
      marginVertical: 8,
      borderRadius: 16
    }}
  />
      );
    return <Text>Loading</Text>;
  };

  if (isLoading) return <Text>Loading</Text>;
  else if (!currentLocalData && !cryptoData)
    return <Text>Data Can't Be Fetch</Text>;
  else if (isError) return <Text>Something is error</Text>;
  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.viewContainer}>
        <Text style={styles.textHeading}>Bitcoin Price Index</Text>
        <Text style={styles.textHeading}>
          {moment(cryptoData?.time?.updated).format('llll')}
        </Text>
        <View style={styles.viewChart}>{_renderChart()}</View>
        {currentLocalData &&
          currentLocalData.map((data, index) => {
            return (
              <View key={index}>
                <View style={styles.viewData}>
                  <Text style={styles.textBold}>
                    Time:{' '}
                    {moment(data?.cryptoData?.time?.updatedISO).format(
                      'HH: mm',
                    )}
                  </Text>
                  <Text>USD: {data?.cryptoData?.bpi?.USD?.rate}</Text>
                  <Text>Latitude: {data?.location?.coords?.latitude}</Text>
                  <Text>Longitude: {data?.location?.coords?.longitude}</Text>
                </View>
                <View style={styles.divider} />
              </View>
            );
          })}
        <View style={styles.viewButton}>
          <TouchableOpacity activeOpacity={0.6} onPress={saveToLocalData}>
            <View style={styles.button}>
              <Text style={styles.textButton}>REFRESH</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: '#FFFFFF',
  },
  viewContainer: {
    flex: 1,
    justifyContent: 'center',
    marginTop: responsiveHeight(10),
    backgroundColor: '#FFFFFF',
  },
  textHeading: {
    fontSize: responsiveFontSize(2.2),
    color: '#000000',
    marginLeft: responsiveWidth(4),
  },
  viewChart: {
    marginLeft: responsiveWidth(4),
    marginRight: responsiveWidth(4),
    marginVertical: responsiveHeight(2.2),
  },
  viewData: {
    marginLeft: responsiveWidth(4),
    marginRight: responsiveWidth(4),
    marginTop: responsiveHeight(1),
    marginBottom: responsiveHeight(2),
  },
  textBold: {
    fontWeight: 'bold',
  },
  divider: {
    height: responsiveHeight(0.5),
    width: responsiveScreenWidth(92),
    paddingHorizontal: responsiveWidth(16),
    backgroundColor: '#DDDDDD',
    alignSelf: 'center',
  },
  viewButton: {
    alignItems: 'center',
    marginTop: responsiveHeight(2.2),
  },
  button: {
    width: responsiveWidth(80),
    height: responsiveHeight(8),
    backgroundColor: '#3498db',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: responsiveScreenHeight(4),
  },
  textButton: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
