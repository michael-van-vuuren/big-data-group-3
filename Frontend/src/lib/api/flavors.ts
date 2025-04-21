import { fetchApi } from './core';

export type FlavorDTO = {
    name: string;
};

// Fetch all flavors from the backend
export const getAllFlavors = (): Promise<FlavorDTO[]> => {
    return fetchApi<FlavorDTO[]>('/flavors/all', {
        method: 'GET',
    }).then(data => data || []);
};
