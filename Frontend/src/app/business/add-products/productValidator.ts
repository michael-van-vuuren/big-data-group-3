import { z } from "zod";

import { fromCompressedForm } from "@/lib/stringutils";

const sanitizeRegularString = (str: string) =>
    str.toLowerCase().replace(/[^\w\s.]|_/g, "").replace(/\s+/g, " ").trim();

const sanitizeTag = (str: string) => str.toLowerCase();
const sanitizeUrl = (str: string) => str.trim();

const optionalStringWithSanitize = (
    stringSchema: z.ZodString,
    sanitizer: (str: string) => string
) => {
    return z.union([stringSchema.transform(sanitizer), z.literal(''), z.undefined()])
        .transform(s => (s === '' || s === undefined) ? undefined : s);
};

const optionalNumberWithNull = (numberSchema: z.ZodNumber) => {
    return z.preprocess(
        val => (val === '' || val === null || val === undefined) ? undefined : val,
        numberSchema.optional().transform(val => val === undefined ? undefined : val)
    );
};

const optionalNumberToStringWithNull = (numberSchema: z.ZodNumber) => {
    return z.preprocess(
        val => (val === '' || val === null || val === undefined) ? undefined : val,
        numberSchema.optional().transform(val => val === undefined ? undefined : String(val))
    );
};

// Schemas
const countrySchema = z.object({
    name: z.string()
        .min(1, "Country name is required.")
        .transform(sanitizeRegularString),
});
const regionSchema = z.object({
    name: z.string()
        .min(1, "Region name is required.")
        .transform(sanitizeRegularString),
});
const flavorSchema = z.object({
    name: z.string()
        .min(1, "Flavor name cannot be empty.")
        .transform(sanitizeRegularString)
        .transform(fromCompressedForm),
});
const processSchema = z.object({
    name: z.string()
        .min(1, "Processing method is required.")
        .transform(sanitizeTag), // don't remove punctuation

    tag: optionalStringWithSanitize(z.string(), sanitizeTag),
});
const producerSchema = z.object({
    name: z.string()
        .min(1, "At least one producer is required.")
        .transform(sanitizeRegularString),

    tag: optionalStringWithSanitize(z.string(), sanitizeTag),

    elevation: z.preprocess(
        (val) => {
            if (val === '' || val === null || val === undefined) return undefined;
            return val;
        },
        z.union([
            z.coerce.number({
                invalid_type_error: "Elevation must be a number."
            })
            .positive("Elevation must be positive.")
            .int("Elevation must be an integer."),
            z.undefined()
        ])
    ),

    regions: z.array(regionSchema)
        .optional()
        .default([]),
    countries: z.array(countrySchema)
        .optional()
        .default([]),
});

// Enums
export enum AvailabilityOption {
    YES = "YES",
    NO = "NO",
}

export enum RoastDegreeOption {
    DARK = "dark",
    ESPRESSO = "espresso",
    FILTER = "filter",
    LIGHT = "light",
    LIGHT_FILTER = "light filter",
    LIGHT_MEDIUM = "light medium",
    MEDIUM = "medium",
    MEDIUM_DARK = "medium dark",
    MEDIUM_LIGHT = "medium light",
    OMNI = "omni",
    ULTRA_LIGHT = "ultra light",
}

// Product schema
const baseProductSchema = z.object({
    name: z.string()
        .min(1, "Product name is required.")
        .transform(sanitizeRegularString),
    image: optionalStringWithSanitize(z.string().url("The image URL is invalid."), sanitizeUrl),
    webpage: optionalStringWithSanitize(z.string().url("The webpage URL is invalid."), sanitizeUrl),
    gram: z.coerce
        .number({ invalid_type_error: "Weight must be a number." })
        .positive("Weight must be positive."),
    roastDegree: z.nativeEnum(RoastDegreeOption, {
        errorMap: () => ({ message: "Please select a roast degree." }),
    }),
    availability: z.nativeEnum(AvailabilityOption, {
        errorMap: () => ({ message: "Please select availability." }),
    }),
    price: z.coerce
        .number({ invalid_type_error: "Price must be a number." })
        .positive("Price must be positive.")
        .multipleOf(0.01, "Price can have at most two decimal places."),
    pricePerCup: optionalNumberWithNull(z.coerce
        .number({ invalid_type_error: "Price per cup must be a number." })
        .positive("Price per cup must be positive.")
        .multipleOf(0.01, "Price per cup can have at most two decimal places.")
    ),
    bulkPricePerCup: optionalNumberWithNull(z.coerce
        .number({ invalid_type_error: "Bulk price per cup must be a number." })
        .positive("Bulk price per cup must be positive.")
        .multipleOf(0.01, "Bulk price per cup can have at most two decimal places.")
    ),

    process: processSchema,
    flavors: z.array(flavorSchema)
        .min(1, "At least one flavor note is required.")
        .optional()
        .default([]),
    producers: z.array(producerSchema)
        .min(1, "At least one producer is required.")
        .optional()
        .default([]),
});

// Product payload schema (dto)
export const productPayloadSchema = baseProductSchema.extend({
    name: z.string()
        .min(1, "Product name is required.")
        .transform(sanitizeRegularString),
    image: optionalStringWithSanitize(z.string().url("The image URL is invalid."), sanitizeUrl),
    webpage: optionalStringWithSanitize(z.string().url("The webpage URL is invalid."), sanitizeUrl),
    roaster: z.object({
        name: z.string()
            .min(1, "Roaster name is required.")
            .transform(sanitizeRegularString),
        country: z.string()
            .transform(sanitizeRegularString)
            .optional(),
    }),
});

export const productSchema = z.object({
    product: baseProductSchema,
    roasterCountry: z.string()
        .transform(sanitizeRegularString)
        .optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;

export type ProductPayload = z.infer<typeof productPayloadSchema>;
