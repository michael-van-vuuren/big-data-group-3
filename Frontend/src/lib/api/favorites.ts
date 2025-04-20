import { fetchApi, Product } from './core';

// Add a favorite to a user's account
export const addFavoriteProduct = (productId: number): Promise<any> => {
    return fetchApi('/account/favorites', {
        method: 'POST',
        body: JSON.stringify({ productId: productId }),
    });
};

// Get a user's favorites
export const getFavoriteProducts = (): Promise<Product[]> => {
    return fetchApi<Product[]>('/account/favorites', {
        method: 'GET',
    }).then(data => data || []);
};

// Remove a favorite from a user's account
export const removeFavoriteProduct = (productId: number): Promise<void> => {
    return fetchApi<void>(`/account/favorites/${productId}`, {
        method: 'DELETE',
    })
};
