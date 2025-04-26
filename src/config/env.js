import { Platform } from 'react-native';
import { API_URL as ENV_API_URL } from '@env';

// Default fallback URL if env variable is not set
const DEFAULT_API_URL = 'http://172.20.10.4:8000';

// Get the API URL from environment variables
export const API_URL = ENV_API_URL ;

// Export other environment variables here as needed 