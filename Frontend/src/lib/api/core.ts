import { ProductPayload } from "@/app/business/add-products/productValidator";
import { Product } from "@/app/flavors/[...path]/types/types";
import { ProductSearchQuery } from "@/app/flavors/[...path]/types/types";

// Backend api URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Generic fetcher that calls the backend
export async function fetchApi<T = any>(endpoint: string, options: RequestInit = {}): Promise<T | undefined> {
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

        // Delete response
        if (response.status === 204 || !contentType) {
            return undefined;
        }
        // JSON
        if (contentType.includes("application/json")) {
            return await response.json() as T;
        }
        // Plain text
        return await response.text() as T;

    } catch (error) {
        console.error('API Fetch Error in fetchApi:', error);
        throw error;
    }
}

export type { Product, ProductPayload, ProductSearchQuery };
