
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

// fetch coffee bean products by flavors
export const getProductsByFlavors = (flavors: string[], searchStrictnessFlag?: boolean) => {
    const params = new URLSearchParams();
    flavors.forEach(flavor => params.append('flavors', flavor));

    if (searchStrictnessFlag === true) {
        params.append('strict', 'true');
    }

    return fetchApi(`/products/by-flavors?${params.toString()}`, {
        method: 'GET',
    });
};

// post favorited product
export const addFavoriteProduct = (productId: number) => {
    return fetchApi('/account/favorites', {
        method: 'POST',
        body: JSON.stringify({ productId: productId }),
    });
};

// get favorited products
export const getFavoriteProducts = () => {
    return fetchApi('/account/favorites', {
        method: 'GET',
    });
};

// remove favorited product
export const removeFavoriteProduct = (productId: number) => {
    return fetchApi(`/account/favorites/${productId}`, {
        method: 'DELETE',
    });
};
