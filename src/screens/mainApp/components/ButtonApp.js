import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

import { styles } from '../styles/MainApp.style';

export default function ButtonApp({buttonText, onPress}) {
  return (
    <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
      <View style={styles.button}>
        <Text style={styles.textButton}>{buttonText}</Text>
      </View>
    </TouchableOpacity>
  );
}
