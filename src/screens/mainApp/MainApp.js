import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, Alert, Dimensions} from 'react-native';
import moment from 'moment';
import {LineChart} from 'react-native-chart-kit';
import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {getCrypto} from './service';
import {localItem} from '../../constants/CONSTANT';
import {styles} from './styles/MainApp.style';
import ButtonApp from './components/ButtonApp';
import Loader from './components/Loader';

export default function MainApp() {
  const [cryptoData, setCryptoData] = useState({});
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState({});
  const [locationStatus, setLocationStatus] = useState(false);
  const [currentLocalData, setCurrentLocalData] = useState([]);

  const getOneTimeLocation = () => {
    setLocationStatus('LOADING');
    Geolocation.watchPosition(
      position => {
        //getting the Longitude from the location json
        const currentLocation = position;
        //Setting Longitude state
        setLocation(currentLocation);
        setLocationStatus('ENABLED');
      },
      error => {
        setLocationStatus('FAIL');

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
          setLocationStatus(false);
          alert('Permission Denied');
        }
      } catch (err) {
        alert('Fail get location, make sure your location');
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
      alert('Device error save data, please reopen app');
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
   * Data will updated everyday if today !=  first date in array
   */
  const removeToken = async () => {
    try {
      await AsyncStorage.removeItem(localItem);
      saveToLocalData();
    } catch (exception) {
      alert("Data can't be fetch");
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
      const firstDataTime = moment(
        localData[0]?.cryptoData?.time?.updatedISO,
      ).format('DD');
      const dateToday = moment().format('DD');
      const compareDate = firstDataTime === dateToday;

      if (localData) {
        if (localData.length > 5 && compareDate) {
          deleteOldData();
        }
      } else if (!compareDate) {
        removeToken();
      } else {
        saveToLocalData();
      }
    } catch (error) {
      // error reading value
      alert('Faoil get location');
    }
  };

  useEffect(() => {
    requestLocationPermission();
    getCryptoApi();
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
        currentLocalData?.map(
          (data, index) => data?.cryptoData?.bpi?.USD?.rate_float,
        );

      return resultChart ? resultChart : [61];
    } else {
      const resultChart =
        currentLocalData?.length > 0 &&
        currentLocalData?.map((data, index) =>
          moment(data?.cryptoData.time?.updatedISO).format('HH:mm'),
        );
      return resultChart ? resultChart : [moment().format('HH')];
    }
  };

  const _renderChart = () => {
    if (cryptoData || currentLocalData)
      return (
        <LineChart
          data={{
            labels: forDataChart('time'),
            datasets: [
              {
                data: forDataChart('price'),
              },
            ],
          }}
          width={Dimensions.get('window').width} // from react-native
          height={220}
          yAxisLabel="$"
          yAxisInterval={2} // optional, defaults to 1
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForHorizontalLabels: {
              fontSize: 9,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#ffa726',
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      );
    return <Text>Loading</Text>;
  };

  if (isLoading) return <Loader />;
  else if (!currentLocalData && !cryptoData)
    return (
      <View style={styles.viewContainer}>
        <Text>Data Can't Be Fetch</Text>
      </View>
    );
  else if (isError)
    return (
      <View style={styles.viewContainer}>
        <Text>Something went wrong</Text>
      </View>
    );
  else if (locationStatus === 'FAIL')
    <View style={styles.viewContainer}>
      <Text>Please activeated your location and reopen app again</Text>
    </View>;
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
                  <Text style={styles.textData}>
                    USD: {data?.cryptoData?.bpi?.USD?.rate || ayam}
                  </Text>
                  <Text style={styles.textData}>
                    Latitude: {data?.location?.coords?.latitude}
                  </Text>
                  <Text style={styles.textData}>
                    Longitude: {data?.location?.coords?.longitude}
                  </Text>
                </View>
                <View style={styles.divider} />
              </View>
            );
          })}
        <View style={styles.viewButton}>
          <ButtonApp buttonText="REFRESH" onPress={saveToLocalData} />
        </View>
      </View>
    </ScrollView>
  );
}
