"use client";

/* --- 
TODO: This file is really long and should definitely be refactored 
into smaller subcomponents 
--- */
import { useState, useEffect } from "react";
import { useForm, SubmitHandler, useFieldArray, Control } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ProductPayload,
  AvailabilityOption,
  RoastDegreeOption,
  productPayloadSchema,
  MultiProductFormShape,
  multiProductFormSchema,
  ProductEntry
} from "./productValidator";

import { Button } from "@/components/button";
import Link from "next/link";
import { Input } from "@/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form";
import Logo from "@/components/logo";
import { cn } from "@/lib/utils/utils";
import { toTitleCase } from "@/lib/utils/stringutils";

import { useAuth } from "@/context/AuthContext";
import { businessApi } from "@/lib/api";
import { Separator } from "@/components/separator";


const roastDegreeOptions = [
  { label: "Dark", value: RoastDegreeOption.DARK },
  { label: "Espresso", value: RoastDegreeOption.ESPRESSO },
  { label: "Filter", value: RoastDegreeOption.FILTER },
  { label: "Light", value: RoastDegreeOption.LIGHT },
  { label: "Light Filter", value: RoastDegreeOption.LIGHT_FILTER },
  { label: "Light Medium", value: RoastDegreeOption.LIGHT_MEDIUM },
  { label: "Medium", value: RoastDegreeOption.MEDIUM },
  { label: "Medium Dark", value: RoastDegreeOption.MEDIUM_DARK },
  { label: "Medium Light", value: RoastDegreeOption.MEDIUM_LIGHT },
  { label: "Omni", value: RoastDegreeOption.OMNI },
  { label: "Ultra Light", value: RoastDegreeOption.ULTRA_LIGHT },
];

const defaultProductEntry: ProductEntry = {
  name: "",
  image: undefined,
  webpage: undefined,
  gram: 0,
  roastDegree: RoastDegreeOption.MEDIUM,
  availability: AvailabilityOption.NO,
  price: 0,
  pricePerCup: undefined,
  bulkPricePerCup: undefined,
  process: {
    name: "",
    tag: undefined,
  },
  flavors: [{ name: "" }],
  producers: [
    { name: "", elevation: undefined, tag: undefined, regions: [{ name: "" }], countries: [{ name: "" }] }
  ],
}


const ProductForm = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<MultiProductFormShape>({
    resolver: zodResolver(multiProductFormSchema),
    defaultValues: {
      products: [defaultProductEntry],
      roasterCountry: undefined
    },
    mode: "onChange",
  });

  const { fields: productFields, append: appendProduct, remove: removeProduct } = useFieldArray({
    control: form.control,
    name: "products"
  });

  type ProductImportDTO = {
    id: number;
    name: string;
  };

  type SubmitStatus = {
    acceptedProducts: ProductImportDTO[];
    rejectedProducts: ProductImportDTO[];
    rejectionReasons: string[];
    message: string;
  };

  const [submitStatus, setSubmitStatus] = useState<SubmitStatus | null>(null);

  /* --- Submission button handler --- */
  const processSubmit: SubmitHandler<MultiProductFormShape> = async (data) => {
    if (!user?.name) {
      setSubmitError("User not identified. Cannot determine roaster name.");
      form.setError("roasterCountry", { type: "manual", message: "User not identified." });
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitStatus(null);

    const { products, roasterCountry } = data;

    const payloads: ProductPayload[] = [];
    const validationErrors: string[] = [];

    products.forEach((product: { name: string; }, index: number) => {
      const rawPayload = {
        ...product,
        roaster: {
          name: user.name!,
          country: roasterCountry,
        },
      };

      // Validate each product payload
      const validationResult = productPayloadSchema.safeParse(rawPayload);
      if (validationResult.success) {
        payloads.push(validationResult.data);
      } else {
        console.error(`Validation failed for product ${index + 1} (${product.name || 'Unnamed'}):`, validationResult.error.errors);
        validationErrors.push(`Product ${index + 1} (${product.name || 'Unnamed'}) has validation errors. Check console.`);
      }
    });

    if (validationErrors.length > 0) {
      setSubmitError(`Some products have validation errors: ${validationErrors.join('; ')}`);
      setIsSubmitting(false);
      return;
    }

    if (payloads.length === 0) {
      setSubmitError("No valid products to submit.");
      setIsSubmitting(false);
      return; 
    }

    try {
      const result = await businessApi.importProducts(payloads); 

      sessionStorage.setItem("submitStatus", JSON.stringify(result));

      form.reset({
        products: [defaultProductEntry],
        roasterCountry: undefined
      });
      window.location.reload(); 
    } catch (error: any) {
      console.error("Submission failed:", error);
      const message = error.message || "An unexpected error occurred during submission.";
      sessionStorage.setItem("submitError", message);
      setSubmitError(message);
      form.setError("root.serverError", {
        type: "manual",
        message,
      });

    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const statusJson = sessionStorage.getItem("submitStatus");
    if (statusJson) {
      try {
        const parsed = JSON.parse(statusJson);
        setSubmitStatus(parsed);
      } catch (err) {
        console.error("Failed to parse submitStatus:", err);
      }
      sessionStorage.removeItem("submitStatus");
    }
    const errorJson = sessionStorage.getItem("submitError");
    if (errorJson) {
      setSubmitError(errorJson);
      sessionStorage.removeItem("submitError");
    }
  }, []);



  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(processSubmit)} className="w-full max-w-2xl space-y-6 p-2 sm:p-4 md:p-6">

        <div className="flex flex-row items-center gap-8">
          <Logo />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground cosmic-bg bg-clip-text text-transparent">Add Your New Coffee Product</h2>
        </div>

        <Separator />

        {/* Response status */}
        {submitStatus && (
          <div className="p-4 border-2 bg-slate-400 border-black text-sm space-y-2 text-white shadow-light">
            {submitStatus.message && (
              <div className="font-bold text-white text-lg">{submitStatus.message.split(",").join(" -")}</div>
            )}

            {submitStatus.acceptedProducts.length > 0 && (
              <div>
                <div className="font-semibold text-black">Accepted Products:</div>
                <ul className="list-disc list-inside text-black font-medium">
                  {submitStatus.acceptedProducts.map((p) => (
                    <li key={p.id}>
                      {toTitleCase(p.name)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {submitStatus.rejectedProducts.length > 0 && (
              <div>
                <div className="font-semibold text-black">Rejected Products:</div>
                <ul className="list-disc list-inside text-black font-medium">
                  {submitStatus.rejectedProducts.map((p, i) => (
                    <li key={p.id}>
                      {toTitleCase(p.name)} — {submitStatus.rejectionReasons[i]}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button
              variant="noShadow"
              className="!mt-4 text-black border-black bg-white border-2 font-bold hover:cosmic-bg hover:text-white transition-all duration-200"
            >
              <Link href="/business/products">
                View Products
              </Link>
            </Button>
          </div>
        )}

        {/* --- Roaster Info --- */}
        <h3 className="text-xl font-semibold">Your Information</h3>
        <div className="grid grid-cols-1 gap-4">
          {/* ROASTER NAME */}
          <FormItem>
            <FormLabel>Your Business Name:</FormLabel>
            <FormControl>
              <Input value={user?.name || "Not logged in"} readOnly disabled />
            </FormControl>
          </FormItem>
          {/* ROASTER COUNTRY */}
          <div className="bg-blue-900 text-white p-8 pt-6 border-black border-2 space-y-4 shadow-light mx-2">
            <h4 className="text-lg">Optional</h4>
            <FormField
              control={form.control}
              name="roasterCountry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Country</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. El Salvador" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
          </div>
        </div>

        <Separator />

        {/* --- PRODUCT LOOP --- */}
        {productFields.map((productItem, productIndex) => (
          <div key={productItem.id} className="border-2 border-black p-4 mb-6 relative space-y-4 shadow-light">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Product #{productIndex + 1}</h3>
              <Button
                type="button"
                variant="reverse"
                size="icon"
                onClick={() => removeProduct(productIndex)}
                disabled={productFields.length <= 1}
                className="shrink-0 bg-red-500 border-black text-black hover:bg-white"
                aria-label={`Remove Product ${productIndex + 1}`}
              > <span className="text-xl font-semibold leading-none">&times;</span> </Button>
            </div>
            {/* --- Basic Product Info --- */}
            <h3 className="text-xl font-semibold">1.&nbsp;&nbsp;Product Information</h3>
            {/* NAME */}
            <FormField control={form.control} name={`products.${productIndex}.name`} render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name<span className="text-red-500">&nbsp;*</span></FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Ethiopia Yirgacheffe Washed" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid grid-cols-2 gap-8 ">
              {/* GRAM */}
              <FormField control={form.control} name={`products.${productIndex}.gram`} render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight (grams)<span className="text-red-500">&nbsp;*</span></FormLabel>
                  <FormControl>
                    <Input type="number" step="any" placeholder="e.g. 250" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              {/* PRICE */}
              <FormField control={form.control} name={`products.${productIndex}.price`} render={({ field }) => (
                <FormItem>
                  <FormLabel>Price ($)<span className="text-red-500">&nbsp;*</span></FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="e.g. 15.99" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            {/* ROAST DEGREE */}
            <FormField control={form.control} name={`products.${productIndex}.roastDegree`} render={({ field }) => (
              <FormItem>
                <FormLabel>Roast Degree<span className="text-red-500">&nbsp;*</span></FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl className="border-black bg-white text-black">
                    <SelectTrigger className="font-normal ">
                      <SelectValue placeholder="Select a roast degree" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white text-black">
                    {roastDegreeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value} className="border-black border-t-0 border-x-0 border-b-2 border-dotted last:border-0 hover:text-pink-400 hover:font-bold hover:!border-black">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )} />
            {/* AVAILABILITY */}
            <FormField control={form.control} name={`products.${productIndex}.availability`} render={({ field }) => (
              <FormItem>
                <FormLabel>Availability<span className="text-red-500">&nbsp;*</span></FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl className="border-black bg-white text-black">
                    <SelectTrigger className="font-normal">
                      <SelectValue placeholder="Select availability..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white text-black">
                    <SelectItem value={AvailabilityOption.YES} className="border-black border-t-0 border-x-0 border-b-2 border-dotted last:border-0 hover:text-pink-400 hover:font-bold hover:!border-black"
                    >
                      Available
                    </SelectItem>
                    <SelectItem value={AvailabilityOption.NO} className="border-black border-t-0 border-x-0 border-b-2 border-dotted last:border-0 hover:text-pink-400 hover:font-bold hover:!border-black"
                    >
                      Unavailable
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <div className="bg-blue-900 text-white p-8 pt-6 border-black border-2 space-y-4 shadow-light mx-2">
              <h4 className="text-lg">Optional</h4>
              <div className="grid grid-cols-2 gap-8">
                {/* IMAGE */}
                <FormField control={form.control} name={`products.${productIndex}.image`} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input type="url" placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                {/* WEBPAGE */}
                <FormField control={form.control} name={`products.${productIndex}.webpage`} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Webpage URL</FormLabel>
                    <FormControl>
                      <Input type="url" placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="grid grid-cols-2 gap-8">
                {/* PRICE PER CUP */}
                <FormField control={form.control} name={`products.${productIndex}.pricePerCup`} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price Per Cup ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="e.g. 0.50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                {/* BULK PRICE PER CUP */}
                <FormField control={form.control} name={`products.${productIndex}.bulkPricePerCup`} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bulk Price Per Cup ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="e.g. 0.40" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>

            <Separator />

            {/* --- Processing --- */}
            <h3 className="text-xl font-semibold">2.&nbsp;&nbsp;Processing</h3>
            <div className="grid grid-cols-1 gap-4">
              {/* PROCESS */}
              <FormField control={form.control} name={`products.${productIndex}.process.name`} render={({ field }) => (
                <FormItem>
                  <FormLabel>Process Name<span className="text-red-500">&nbsp;*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Washed, Natural" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="bg-blue-900 text-white p-8 pt-6 border-black border-2 space-y-4 shadow-light mx-2">
                <h4 className="text-lg">Optional</h4>
                <div className="grid grid-cols-1 gap-8">
                  {/* PROCESS TAG */}
                  <FormField control={form.control} name={`products.${productIndex}.process.tag`} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Process Tag</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Anaerobic, Carbonic" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </div>
            </div>

            <Separator />

            {/* --- Flavors (subcomponent below) --- */}
            <ProductFlavors control={form.control} productIndex={productIndex} />

            <Separator />

            {/* --- Producers  (subcomponent below) --- */}
            <ProductProducers control={form.control} productIndex={productIndex} />

          </div>
        ))}

        {/* --- Add product button --- */}
        <div className="flex justify-center mt-6">
          <Button
            type="button"
            variant="default"
            size="sm"
            className="border-black border-2 text-white bg-emerald-500 font-bold p-2"
            onClick={() => appendProduct(defaultProductEntry)}
          >
            + Add Another Product
          </Button>
        </div>

        {submitError && !form.formState.errors.root?.serverError && (
          <div className="font-bold p-4 border-2 bg-red-600 border-black text-sm space-y-2 text-black shadow-light">
            {submitError}
          </div>
        )}
        {form.formState.errors.root?.serverError && (
          <p className="font-bold p-4 border-2 bg-red-600 border-black text-sm space-y-2 text-black shadow-light">
            {form.formState.errors.root.serverError.message}
          </p>
        )}

        <Separator />

        <div className="w-full flex items-center">
          <Button
            type="submit"
            variant="reverse"
            disabled={isSubmitting || !form.formState.isValid}
            className="mx-auto text-white border-black favorite-bg border-2 font-bold py-4 px-8 mb-8 text-md group-hover:underline disabled:opacity-50"
          >
            {isSubmitting
              ? `Submitting ${productFields.length} Product${productFields.length === 1 ? '' : 's'}...`
              : `Submit ${productFields.length} Product${productFields.length === 1 ? '' : 's'}`}
          </Button>

        </div>
      </form>
    </Form>
  );
};


/* --- Subcomponent for flavors --- */
interface ProductFlavorsProps {
  control: Control<MultiProductFormShape>;
  productIndex: number;
}

const ProductFlavors: React.FC<ProductFlavorsProps> = ({ control, productIndex }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `products.${productIndex}.flavors`
  });

  const flavorErrors = (control._formState.errors?.products?.[productIndex] as any)?.flavors;

  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center gap-4">
        <h4 className="text-xl font-semibold">3.&nbsp;&nbsp;Flavors</h4>
        <Button
          type="button" variant="default" size="sm"
          className="ml-auto p-2 mr-3 bg-emerald-500 text-white font-bold"
          onClick={() => append({ name: "" })}
        > + Add Flavor </Button>
      </div>

      {flavorErrors?.root && <p className="text-sm font-medium text-destructive ml-4">{flavorErrors.root.message}</p>}
      {flavorErrors?.message && <p className="text-sm font-medium text-destructive ml-4">{flavorErrors.message}</p>}

      <div className="border-black border-2 p-8 pt-6 mx-2 border-b-8">
        {fields.map((item, index) => (
          <div key={item.id}>
            <FormField
              control={control}
              name={`products.${productIndex}.flavors.${index}.name`}
              render={({ field }) => (
                <div>
                  <p className={cn("ml-9 text-sm font-medium", index !== 0 ? "sr-only" : "")}>
                    Flavor Names<span className="text-red-500">&nbsp;*</span>
                  </p>
                  <FormItem className="flex-grow flex items-center space-x-2 pt-2 pr-3">
                    <span className="flex items-center justify-center border-black border-2 bg-blue-600 text-white h-7 w-7 font-semibold shrink-0">
                      {index + 1}
                    </span>
                    <FormControl>
                      <Input placeholder="e.g. Tropical Fruit" {...field} />
                    </FormControl>
                    <FormMessage />
                    <Button
                      variant="reverse" size="icon"
                      onClick={() => remove(index)}
                      disabled={fields.length <= 1 && index === 0}
                      className="shrink-0 bg-red-500 border-black text-black hover:bg-white"
                      aria-label="Remove flavor"
                    > <span className="text-xl font-semibold leading-none">&times;</span> </Button>
                  </FormItem>
                </div>
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
}


/* --- Subcomponent for producers --- */
interface ProductProducersProps {
  control: Control<MultiProductFormShape>;
  productIndex: number;
}
const ProductProducers: React.FC<ProductProducersProps> = ({ control, productIndex }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `products.${productIndex}.producers`
  });

  const producerErrors = (control._formState.errors?.products?.[productIndex] as any)?.producers;


  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center gap-4">
        <h4 className="text-xl font-semibold">4.&nbsp;&nbsp;Producers</h4>
        <Button
          type="button" variant="default" size="sm"
          className="ml-auto p-2 mr-3 bg-emerald-500 text-white font-bold"
          onClick={() => append({ name: "", elevation: undefined, tag: "", regions: [{ name: "" }], countries: [{ name: "" }] })}
        > + Add Producer </Button>
      </div>

      {producerErrors?.root && <p className="text-sm font-medium text-destructive ml-4">{producerErrors.root.message}</p>}
      {producerErrors?.message && <p className="text-sm font-medium text-destructive ml-4">{producerErrors.message}</p>}


      <div className="border-black border-2 border-b-8 p-2 sm:p-4 md:p-6 pt-6 mx-2">
        {fields.map((producerItem, producerInnerIndex) => (
          <div key={producerItem.id} className="space-y-4 relative mb-4 pb-4 border-b border-gray-300 last:border-b-0 last:mb-0 last:pb-0">
            <p className={cn("ml-9 text-sm font-medium", producerInnerIndex !== 0 ? "sr-only" : "")}>
              Producer Details<span className="text-red-500">&nbsp;*</span>
            </p>
            <FormItem className="flex items-center space-x-2 pr-3">
              <span className="flex items-center justify-center border-black border-2 bg-blue-600 text-white h-7 w-7 font-semibold shrink-0">
                {producerInnerIndex + 1}
              </span>
              <FormField
                control={control}
                name={`products.${productIndex}.producers.${producerInnerIndex}.name`}
                render={({ field }) => (
                  <FormControl className="flex-grow">
                    <Input placeholder="Producer Name e.g. Los Pirineos" {...field} />
                  </FormControl>
                )}
              />
              <FormMessage />
              <Button
                variant="reverse" size="icon"
                onClick={() => remove(producerInnerIndex)}
                disabled={fields.length <= 1 && producerInnerIndex === 0}
                className="shrink-0 bg-red-500 border-black text-black hover:bg-white"
                aria-label="Remove producer"
              > <span className="text-xl font-semibold leading-none">&times;</span> </Button>
            </FormItem>

            <div className="grid grid-cols-2 gap-4 pl-9 pr-11">
              {/* Elevation */}
              <FormField
                control={control}
                name={`products.${productIndex}.producers.${producerInnerIndex}.elevation`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Elevation (meters)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g. 1400" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value, 10))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Tag */}
              <FormField
                control={control}
                name={`products.${productIndex}.producers.${producerInnerIndex}.tag`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Producer Tag</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Single Origin" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Nested regions */}
            <NestedFieldArray
              control={control}
              productIndex={productIndex}
              parentIndex={producerInnerIndex}
              fieldArrayName="regions"
              label="Region Name"
              placeholder="e.g. Usulutan"
            />

            {/* Nested countries */}
            <NestedFieldArray
              control={control}
              productIndex={productIndex}
              parentIndex={producerInnerIndex}
              fieldArrayName="countries"
              label="Country Name"
              placeholder="e.g. El Salvador"
            />
          </div>
        ))}
      </div>
    </div>
  );
}


// Producer can have multiple regions and countries 
interface NestedFieldArrayProps {
  control: Control<MultiProductFormShape>;
  productIndex: number;
  parentIndex: number;
  fieldArrayName: "regions" | "countries";
  label: string;
  placeholder: string;
}
const NestedFieldArray: React.FC<NestedFieldArrayProps> = ({
  control,
  productIndex,
  parentIndex,
  fieldArrayName,
  label,
  placeholder,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `products.${productIndex}.producers.${parentIndex}.${fieldArrayName}`,
  });

  const nestedErrors = (control._formState.errors?.products?.[productIndex] as any)?.producers?.[parentIndex]?.[fieldArrayName];


  return (
    <div className="pl-9 pr-3">
      <div className="flex flex-row items-center gap-4 mb-2">
        <h5 className="text-md font-semibold">{fieldArrayName === 'regions' ? 'Regions' : 'Countries'}</h5>
        <Button
          type="button" variant="default" size="sm"
          className="ml-auto p-1 mr-1 bg-emerald-500 text-white font-bold"
          onClick={() => append({ name: "" })}
        > + Add {fieldArrayName === "regions" ? "Region" : "Country"} </Button>
      </div>

      {nestedErrors?.root && <p className="text-xs font-medium text-destructive ml-4">{nestedErrors.root.message}</p>}
      {nestedErrors?.message && <p className="text-xs font-medium text-destructive ml-4">{nestedErrors.message}</p>}

      <div className="mt-4 space-y-2">
        <div className="bg-white border-black border-[1px] border-dashed p-4 pt-4">
          {fields.length === 0 && <p className="text-xs text-gray-500">No {fieldArrayName} added yet.</p>}
          {fields.map((item, index) => (
            <div key={item.id} className="mb-2 last:mb-0">
              <FormField
                control={control}
                name={`products.${productIndex}.producers.${parentIndex}.${fieldArrayName}.${index}.name`}
                render={({ field }) => (
                  <div>
                    <p className={cn("ml-9 text-sm font-medium", index !== 0 ? "sr-only" : "")} >
                      {label}<span className="text-red-500">&nbsp;*</span>
                    </p>
                    <FormItem className="flex-grow flex items-center space-x-2 pt-1">
                      <span className="flex items-center justify-center border-black border-2 bg-blue-600 text-white h-6 w-6 text-xs font-semibold shrink-0">
                        {index + 1}
                      </span>
                      <FormControl>
                        <Input placeholder={placeholder} {...field} className="h-8 text-sm" />
                      </FormControl>
                      <FormMessage className="text-xs" />
                      <Button
                        variant="reverse" size="icon"
                        onClick={() => remove(index)}
                        disabled={fields.length <= 1 && index === 0} 
                        className="shrink-0 bg-red-400 border-black text-black hover:bg-white w-6 h-6"
                        aria-label={`Remove ${fieldArrayName === "regions" ? "region" : "country"}`}
                      > <span className="text-lg font-semibold leading-none">&times;</span> </Button>
                    </FormItem>
                  </div>
                )}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default ProductForm;
