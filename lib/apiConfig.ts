/**
 * Simple API URL configuration utility
 * This ensures we have a working API URL regardless of environment variable loading issues
 */

import Constants from 'expo-constants';

// Primary URL from environment/config
const CONFIG_API_URL = Constants.expoConfig?.extra?.API_BASE_URL;

// Fallback URL (your actual backend)
const FALLBACK_API_URL = "https://flexiride-backend-hdoc.onrender.com/";

// Environment variable fallback
const ENV_API_URL = process.env.API_BASE_URL;

// Choose the best available URL
export const API_BASE_URL = CONFIG_API_URL || ENV_API_URL || FALLBACK_API_URL;

console.log("🔧 API URL Configuration:");
console.log("  - CONFIG_API_URL:", CONFIG_API_URL);
console.log("  - ENV_API_URL:", ENV_API_URL);
console.log("  - FALLBACK_API_URL:", FALLBACK_API_URL);
console.log("  - FINAL API_BASE_URL:", API_BASE_URL);

export default API_BASE_URL;