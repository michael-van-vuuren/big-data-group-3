import { fetchApi, Product } from './core';

// Add a favorite to a user's account
export const addFavoriteProduct = (productId: number): Promise<any> => {
    return fetchApi('/account/favorites', {
        method: 'POST',
        body: JSON.stringify({ productId: productId }),
    });
};

// Get a user's favorites
export const getFavoriteProducts = async (): Promise<Product[]> => {
    const data = await fetchApi<Product[]>('/account/favorites', {
        method: 'GET',
    });
    return data || [];
};


// Remove a favorite from a user's account
export const removeFavoriteProduct = (productId: number): Promise<void> => {
    return fetchApi<void>(`/account/favorites/${productId}`, {
        method: 'DELETE',
    })
};

// Get only the count of favorite products
export const getFavoriteCount = async (): Promise<number> => {
    const data = await fetchApi<number>('/account/favorites/count', {
        method: 'GET',
    });
    return data ?? 0;
};

