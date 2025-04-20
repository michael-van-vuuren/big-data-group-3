import { fetchApi, ProductPayload } from './core';

// Import product
export const importProducts = (productPayloads: ProductPayload[]) => {
    return fetchApi('/products/import', {
        method: 'POST',
        body: JSON.stringify(productPayloads),
    });
};

// Delete product
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
