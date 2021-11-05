import { base } from '../../../services/base'

/**
 * for get api
 * 
 * @returns {Object} - Object JSON 
 */
export const getCrypto = async () => {
  try {
    const response = await base.get('/currentprice.json', {})
    return Promise.resolve(response.data)
  } catch (error) {
    return Promise.reject(error)
  }
}
