import React, {useEffect, useState} from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { getCrypto } from './service'

export default function MainApp() {

const [cryptoData, setCryptoData] = useState({})
const [isError, setIsError] = useState(false)
const [isLoading, setIsLoading] = useState(false)

/**
 * 
 */
const getCryptoApi = async () => {
  setIsLoading(true)

 try {
    const response = await getCrypto()
    setCryptoData(response)
    setIsLoading(false)
    setIsError(false)

    alert(JSON.stringify(response))
    console.log(response, "Hello")
 } catch (error) {
    setIsLoading(false)
    setIsError(true)
 }
}

useEffect(() => {
    getCryptoApi()
}, [])

    return (
        <View>
            <Text>Hello</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    
})