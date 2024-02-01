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
    console.log('get access token', accessToken);
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

// Set up response interceptor for handling token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        console.log('error', error);
        if (error.response && error.response.status === 401 && !error.config._isRetry) {
            error.config._isRetry = true;
            try {
                console.log('Refreshing access token...');
                console.log(Cookies.get('refresh_token'))
                const response = await refreshAccessToken();
                console.log({ response })
                // get cookies from response
                const cookies = response.headers['set-cookie'];

                if (response.data && response.data.success && response.data.accessToken) {
                    Cookies.remove('access_token');
                    Cookies.set('access_token', response.data.accessToken);
                    console.log('has set new',Cookies.get('access_token'));
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
