import { fetchApi, Product, ProductSearchQuery } from './core';

// Fetch products matching a list of flavor names
export const getProductsByFlavors = (flavors: string[], searchStrictnessFlag?: boolean): Promise<Product[]> => {
    const params = new URLSearchParams();
    flavors.forEach(flavor => params.append('flavors', flavor));

    if (searchStrictnessFlag === true) {
        params.append('strict', 'true');
    }

    return fetchApi<Product[]>(`/products/by-flavors?${params.toString()}`, {
        method: 'GET',
    }).then(data => data || []); 
};

// Fetch coffee bean products by roaster name
export const getProductsByRoaster = (roasterName: string): Promise<Product[]> => {
    const params = new URLSearchParams();
    params.append('roasterName', roasterName);
    return fetchApi<Product[]>(`/products/by-roaster?${params.toString()}`, {
        method: 'GET',
    }).then(data => data || []);
};

// Fetch coffee bean products by roaster country
export const getProductsByRoasterCountry = (roasterCountry: string): Promise<Product[]> => {
    const params = new URLSearchParams();
    params.append('countryName', roasterCountry);
    return fetchApi<Product[]>(`/products/by-roaster-country?${params.toString()}`, {
        method: 'GET',
    }).then(data => data || []);
};

// Query router
export const searchProducts = (query: ProductSearchQuery): Promise<Product[]> => {
    console.log("Searching products with query:", query);

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
