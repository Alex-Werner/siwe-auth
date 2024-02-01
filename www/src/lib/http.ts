import axios from 'axios';
import Cookies from 'js-cookie';

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
    baseURL: NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    withCredentials: true,
    validateStatus: (status) => status >= 200 && status <= 201,
});

// include access token in request headers
api.interceptors.request.use(async (config) => {
    const accessToken = Cookies.get('access_token');
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

// Set up response interceptor for handling token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401 && !error.config._isRetry) {
            error.config._isRetry = true;
            try {
                const response = await refreshAccessToken();
                // get cookies from response
                const cookies = response.headers['set-cookie'];

                if (response.data && response.data.success && response.data.accessToken) {
                    Cookies.remove('access_token');
                    Cookies.set('access_token', response.data.accessToken);
                    return api.request(error.config);
                }
            } catch (e) {
                console.error('Error refreshing access token:', e);
            }
        }
        throw error;
    }
);

// Function to refresh the access token
async function refreshAccessToken() {
    try {
        const response = await axios.get(`${NEXT_PUBLIC_API_URL}/user/refresh`, {
            withCredentials: true,
        });
        return response;
    } catch (e) {
        throw e;
    }
}

export default api;
