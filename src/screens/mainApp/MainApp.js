import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import moment from 'moment';
import {LineChart} from 'react-native-chart-kit';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

import {getCrypto} from './service';

export default function MainApp() {
  const [cryptoData, setCryptoData] = useState({});
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /**
   *
   */
  const getCryptoApi = async () => {
    setIsLoading(true);

    try {
      const response = await getCrypto();
      setCryptoData(response);
      setIsLoading(false);
      setIsError(false);

      console.log(response, 'Hello');
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
    }
  };

  useEffect(() => {
    getCryptoApi();
  }, []);

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.viewContainer}>
        <Text style={styles.textHeading}>Bitcoin Price Index</Text>
        <Text style={styles.textHeading}>
          {moment(cryptoData?.time?.updated).format('ll')}
        </Text>
        <View style={styles.viewChart}>
          <LineChart
            data={{
              labels: ['January', 'February', 'March', 'April', 'May'],
              datasets: [
                {
                  data: [
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                  ],
                },
              ],
            }}
            width={responsiveWidth(92)} // from react-native
            height={220}
            yAxisLabel="$"
            yAxisSuffix="k"
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              backgroundColor: '#e26a00',
              //   backgroundGradientFrom: "#fb8c00",
              //   backgroundGradientTo: "#ffa726",
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              propsForDots: {
                r: '5',
                strokeWidth: '2',
                stroke: '#ffa726',
              },
            }}
            bezier
          />
        </View>
        <View style={styles.viewData}>
          <Text>Time: 11: 00</Text>
          <Text>USD: 11: 00</Text>
          <Text>Latitude: 11: 00</Text>
          <Text>longitude: 11: 00</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.viewData}>
          <Text>Time: 11: 00</Text>
          <Text>USD: 11: 00</Text>
          <Text>Latitude: 11: 00</Text>
          <Text>longitude: 11: 00</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.viewData}>
          <Text>Time: 11: 00</Text>
          <Text>USD: 11: 00</Text>
          <Text>Latitude: 11: 00</Text>
          <Text>longitude: 11: 00</Text>
        </View>
        <View style={styles.divider} />
      </View>
      <View style={styles.viewButton}>
        <View style={styles.button}>
          <Text style={styles.textButton}>REFRESH</Text>
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
  },
  textButton: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
