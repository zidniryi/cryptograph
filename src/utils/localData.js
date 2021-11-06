import AsyncStorage from '@react-native-async-storage/async-storage';

import {localItem} from '../constants/CONSTANT';

/**
 * Save item from api and check it
 *
 * @param {Object} data from item storage mapping to array
 */
export const localData = async (data) => {
  try {
    let itemData = [];
    // Parse the serialized data back into an aray of objects
    itemData = JSON.parse(await AsyncStorage.getItem(localItem)) || [];
    console.log(JSON.parse(itemData), 'Data Me');
    itemData.push({data:1});
    // Re-serialize the array back into itemData string and store it in localStorage
    await AsyncStorage.setItem(localItem, JSON.stringify(itemData));
  } catch (error) {
    // alert('Failed To Save Data', error);
    console.log(error, "Saving")
  }
};
