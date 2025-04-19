import { ProductPayload } from "@/app/business/dashboard/productValidator";
import { Product } from "@/app/flavors/[...path]/types";
import { ProductSearchQuery } from "@/context/ProductSearchContext";

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
            let errorMessage = response.statusText;
            try {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    errorData = await response.json();
                    errorMessage = errorData?.message || JSON.stringify(errorData);
                } else {
                    errorMessage = await response.text() || response.statusText;
                }

            } catch (e) {
                console.error("Could not parse error response:", e);
            }
            console.error("API Error:", response.status, errorMessage);
            const error = new Error(errorMessage) as any;
            error.status = response.status;
            throw error;
        }
        const contentType = response.headers.get("content-type");
        if (response.status === 204) {
            return undefined;
        }
        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        } else {
            return await response.text();
        }

    } catch (error) {
        console.error('API Fetch Error:', error);
        throw error;
    }
}

/* --- Frontend API --- */

/* --- Authentication routes --- */
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

/* --- Product routes --- */
// fetch coffee bean products by flavors
export const getProductsByFlavors = (flavors: string[], searchStrictnessFlag?: boolean): Promise<Product[]> => {
    const params = new URLSearchParams();
    flavors.forEach(flavor => params.append('flavors', flavor));

    if (searchStrictnessFlag === true) {
        params.append('strict', 'true');
    }

    return fetchApi(`/products/by-flavors?${params.toString()}`, {
        method: 'GET',
    }) as Promise<Product[]>;
};
// fetch coffee bean products by roaster name
export const getProductsByRoaster = (roasterName: string): Promise<Product[]> => {
    const params = new URLSearchParams();
    params.append('roasterName', roasterName);

    return fetchApi(`/products/by-roaster?${params.toString()}`, {
        method: 'GET',
    }) as Promise<Product[]>;
};
// fetch coffee bean products by roaster country
export const getProductsByRoasterCountry = (roasterCountry: string): Promise<Product[]> => {
    const params = new URLSearchParams();
    params.append('countryName', roasterCountry);

    return fetchApi(`/products/by-roaster-country?${params.toString()}`, {
        method: 'GET',
    }) as Promise<Product[]>;
};
// query router
export const searchProducts = (query: ProductSearchQuery): Promise<Product[]> => {
    console.log(query);

    switch (query.type) {
        case 'flavor':
            return getProductsByFlavors(query.values, query.strict);
        case 'roaster':
            return getProductsByRoaster(query.value);
        case 'roaster-country':
            return getProductsByRoasterCountry(query.value);
        default:
            console.warn("Unsupported search query type:", query);
            return Promise.resolve([]);
    }
};

/* --- Favorite routes --- */
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

/* --- Business routes --- */
// import products
export const importProducts = (productPayloads: ProductPayload[]) => {
    return fetchApi('/products/import', {
        method: 'POST',
        body: JSON.stringify(productPayloads),
    });
};

// delete product
export const deleteProductById = async (productId: number | string): Promise<boolean> => {
    try {
        await fetchApi(`/products/${productId}`, {
            method: 'DELETE',
        });

        console.log(`Product ${productId} deleted successfully.`);
        return true;

    } catch (error: any) {
        console.error(`Failed to delete product ${productId}. Status: ${error?.status}. Reason:`, error?.message || error);

        return false;
    }
};
