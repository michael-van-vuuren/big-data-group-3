
// backend api URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// generic fetcher (specific fetchers at bottom) that calls the backend
async function fetchApi(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultOptions: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options.headers,
        },
        credentials: 'include',
        ...options,
    };

    try {
        const response = await fetch(url, defaultOptions);

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {
                errorData = { message: response.statusText };
            }
            console.error("API Error:", response.status, errorData);
            throw new Error(errorData.message || `Request failed with status ${response.status}`);
        }

         const contentType = response.headers.get("content-type");
         if (contentType && contentType.indexOf("application/json") !== -1) {
             return await response.json();
         } else {
             return await response.text();
         }

    } catch (error) {
        console.error('API Fetch Error:', error);
        throw error;
    }
}

// api callers

// check authentication status
export const getMe = () => fetchApi('/auth/me', {
    method: 'GET',
});

export const loginUser = (credentials: any) => fetchApi('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
});
export const registerUser = (userData: any) => fetchApi('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
});
export const logoutUser = () => fetchApi('/auth/logout', {
    method: 'POST',
});


