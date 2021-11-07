import React from 'react'
import { View, ActivityIndicator } from 'react-native'

import { styles } from '../styles/MainApp.style'

export default function Loader() {
    return (
        <View style={styles.viewContainer}>
         <ActivityIndicator color="#3498db" size="large"/>
        </View>
    )
}
