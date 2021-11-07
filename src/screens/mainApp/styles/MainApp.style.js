import { StyleSheet } from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

export const styles = StyleSheet.create({
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
