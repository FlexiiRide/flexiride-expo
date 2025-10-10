import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL


interface CustomFetchOptions extends RequestInit {
    // You can add custom options here if needed
}

export const authenticatedFetch = async (
    input: RequestInfo,
    token: string | null,
    options?: CustomFetchOptions
) => {
    const headers = new Headers(options?.headers);

    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(`${API_BASE_URL}${input}`, { ...options, headers });

    if (response.status === 401) {
        console.warn('Unauthorized request. Token might be expired.');
    }

    return response;
};