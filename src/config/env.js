import { Platform } from 'react-native';
import { DEFAULT_API_URL } from '@env';

// Default fallback URL if env variable is not set
// const DEFAULT_API_URL = 'http://10.192.49.72:8000';
// const DEFAULT_API_URL = 'https://e386-2001-d08-2181-6ce3-8bc1-d41c-2d33-1f65.ngrok-free.app';

// Get the API URL from environment variables
export const API_URL = DEFAULT_API_URL ;

// Export other environment variables here as needed 