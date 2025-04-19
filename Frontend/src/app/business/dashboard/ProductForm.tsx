"use client";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductFormData, ProductPayload, AvailabilityOption, RoastDegreeOption, productPayloadSchema } from "./productValidator";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Logo from "@/sections/logo";
import { cn } from "@/lib/utils";
import { toTitleCase } from "@/lib/stringutils";

import { useAuth } from "@/context/AuthContext";
import { importProducts } from "@/lib/apiClient";
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



const ProductForm = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);


  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      product: {
        name: "",
        image: undefined,
        webpage: undefined,
        gram: undefined,
        roastDegree: undefined,
        availability: undefined,
        price: undefined,
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
      },
      roasterCountry: undefined
    },
    mode: "onChange",
  });

  // Flavor and producers can be added within the form
  const { fields: flavorFields, append: appendFlavor, remove: removeFlavor } = useFieldArray({
    control: form.control,
    name: "product.flavors"
  });

  const { fields: producerFields, append: appendProducer, remove: removeProducer } = useFieldArray({
    control: form.control,
    name: "product.producers"
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

  // On submit
  const processSubmit: SubmitHandler<ProductFormData> = async (data) => {
    if (!user?.name) {
      setSubmitError("User not identified. Cannot determine roaster name.");
      form.setError("root", { type: "manual", message: "User not identified." });
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const { product, roasterCountry } = data;

    // Payload to send to product import endpoint
    const rawPayload = {
      ...product,
      roaster: {
        name: user.name,
        country: roasterCountry,
      },
    };
    console.log("Raw Payload before parse", rawPayload);

    // Validate with productValidator
    const payload: ProductPayload = productPayloadSchema.parse(rawPayload);

    // DEBUG
    console.log("Submitting Payload:", [payload]);

    try {
      const result = await importProducts([payload]);
      console.log(result);

      sessionStorage.setItem("submitStatus", JSON.stringify(result));
      form.reset();
      window.location.reload();
    }
    catch (error: any) {
      console.error("Submission failed:", error);

      if (error instanceof z.ZodError) {
        console.error("Zod validation error:", error.errors);
        setSubmitError("Payload validation failed. Check console for details.");
      } else {
        const message = error.message || "An unexpected error occurred during submission.";
        sessionStorage.setItem("submitError", message);
        setSubmitError(message);
        form.setError("root.serverError", {
          type: "manual",
          message,
        });
      }

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
  }, []);



  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(processSubmit)} className="w-full max-w-xl space-y-6 p-2 sm:p-4 md:p-6">

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
                      {toTitleCase(p.name)} (ID: {p.id})
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
                      {toTitleCase(p.name)} - {submitStatus.rejectionReasons[i]}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* --- Roaster Info --- */}
        <h3 className="text-xl font-semibold">1.&nbsp;&nbsp;Your Information</h3>
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

        {/* --- Basic Product Info --- */}
        <h3 className="text-xl font-semibold">2.&nbsp;&nbsp;Product Information</h3>
        {/* NAME */}
        <FormField control={form.control} name="product.name" render={({ field }) => (
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
          <FormField control={form.control} name="product.gram" render={({ field }) => (
            <FormItem>
              <FormLabel>Weight (grams)<span className="text-red-500">&nbsp;*</span></FormLabel>
              <FormControl>
                <Input type="number" step="any" placeholder="e.g. 250" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          {/* PRICE */}
          <FormField control={form.control} name="product.price" render={({ field }) => (
            <FormItem>
              <FormLabel>Price ($)<span className="text-red-500">&nbsp;*</span></FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="e.g. 15.99" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        {/* ROAST DEGREE */}
        <FormField control={form.control} name="product.roastDegree" render={({ field }) => (
          <FormItem>
            <FormLabel>Roast Degree<span className="text-red-500">&nbsp;*</span></FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
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
        <FormField control={form.control} name="product.availability" render={({ field }) => (
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
            <FormField control={form.control} name="product.image" render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <Input type="url" placeholder="https://..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {/* WEBPAGE */}
            <FormField control={form.control} name="product.webpage" render={({ field }) => (
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
            <FormField control={form.control} name="product.pricePerCup" render={({ field }) => (
              <FormItem>
                <FormLabel>Price Per Cup ($)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="e.g. 0.50" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {/* BULK PRICE PER CUP */}
            <FormField control={form.control} name="product.bulkPricePerCup" render={({ field }) => (
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
        <h3 className="text-xl font-semibold">3.&nbsp;&nbsp;Processing</h3>
        <div className="grid grid-cols-1 gap-4">
          {/* PROCESS */}
          <FormField control={form.control} name="product.process.name" render={({ field }) => (
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
              <FormField control={form.control} name="product.process.tag" render={({ field }) => (
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

        {/* --- Flavors --- */}
        <div className="flex flex-row items-center gap-4">
          <h3 className="text-xl font-semibold">4.&nbsp;&nbsp;Flavors</h3>

          <Button
            type="button"
            variant="default"
            className="ml-auto p-2 mr-3 bg-emerald-500 text-white font-bold"
            size="sm"
            onClick={() => appendFlavor({ name: "" })}
          >
            + Add Flavor
          </Button>
        </div>

        <div className="space-y-4">
          {form.formState.errors.product?.flavors?.root &&
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.product.flavors.root.message}
            </p>
          }
          {form.formState.errors.product?.flavors?.message &&
            <p className="text-sm font-medium text-destructive">{
              form.formState.errors.product.flavors.message}
            </p>
          }

          <div className="border-black border-2 p-8 pt-6 mx-2 border-b-8">
            {flavorFields.map((item, index) => (
              <div key={item.id}>
                {/* FLAVOR NAME */}
                <FormField
                  control={form.control}
                  name={`product.flavors.${index}.name`}
                  render={({ field }) => (
                    <div>
                      <p className={cn(
                        "ml-9 text-sm font-medium",
                        index !== 0 ? "sr-only" : ""
                      )}>Flavor Names<span className="text-red-500">&nbsp;*</span></p>
                      <FormItem className="flex-grow flex items-center space-x-2 pt-2 pr-3">
                        <span className="flex items-center justify-center border-black border-2 bg-blue-600 text-white h-7 w-7 font-semibold shrink-0 shadow-lightSm">
                          {index + 1}
                        </span>
                        <FormControl>
                          <Input placeholder="e.g. Tropical Fruit" {...field} />
                        </FormControl>
                        <FormMessage />
                        <Button
                          variant="reverse"
                          size="icon"
                          onClick={() => removeFlavor(index)}
                          disabled={flavorFields.length <= 1 && index === 0}
                          className="shrink-0 bg-red-500 border-black text-black hover:bg-white"
                          aria-label="Remove flavor addition"
                        >
                          <span className="text-xl font-semibold leading-none">&times;</span>
                        </Button>
                      </FormItem>
                    </div>
                  )} />


              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* --- Producers --- */}
        <div className="flex flex-row items-center gap-4">
          <h3 className="text-xl font-semibold">5.&nbsp;&nbsp;Producers</h3>

          <Button
            type="button"
            variant="default"
            className="ml-auto p-2 mr-3 bg-emerald-500 text-white font-bold"
            size="sm"
            onClick={() =>
              appendProducer({
                name: "",
                elevation: undefined,
                tag: "",
                regions: [{ name: "" }],
                countries: [{ name: "" }],
              })
            }
          >
            + Add Producer
          </Button>
        </div>

        <div className="space-y-4">
          {form.formState.errors.product?.producers?.root && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.product.producers.root.message}
            </p>
          )}
          {form.formState.errors.product?.producers?.message && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.product.producers.message}
            </p>
          )}

          <div className="border-black border-2 border-b-8 p-2 sm:p-4 md:p-6 pt-6 mx-2">
            {producerFields.map((producerItem, producerIndex) => (
              <div key={producerItem.id} className="space-y-4 relative">
                <p className={cn(
                  "ml-9 text-sm font-medium",
                  producerIndex !== 0 ? "sr-only" : ""
                )}>Producer Names<span className="text-red-500">&nbsp;*</span></p>
                <FormItem className="flex items-center space-x-2 pr-3">
                  <span className="flex items-center justify-center border-black border-2 bg-blue-600 text-white h-7 w-7 font-semibold shrink-0 shadow-lightSm">
                    {producerIndex + 1}
                  </span>

                  <FormField
                    control={form.control}
                    name={`product.producers.${producerIndex}.name`}
                    render={({ field }) => (
                      <FormControl>
                        <Input placeholder="Producer Name e.g. Los Pirineos" {...field} />
                      </FormControl>
                    )}
                  />

                  <Button
                    variant="reverse"
                    size="icon"
                    onClick={() => removeProducer(producerIndex)}
                    disabled={producerFields.length <= 1 && producerIndex === 0}
                    className="shrink-0 bg-red-500 border-black text-black hover:bg-white"
                    aria-label="Remove producer addition"
                  >
                    <span className="text-xl font-semibold leading-none">&times;</span>
                  </Button>
                </FormItem>

                <div className="grid grid-cols-2 gap-4 pl-9 pr-11">
                  {/* Elevation */}
                  <FormField
                    control={form.control}
                    name={`product.producers.${producerIndex}.elevation`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Elevation (meters)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 1400" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Tag */}
                  <FormField
                    control={form.control}
                    name={`product.producers.${producerIndex}.tag`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Producer Tag</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Single Origin" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Nested Regions */}
                <NestedFieldArray
                  control={form.control}
                  parentIndex={producerIndex}
                  fieldArrayName="regions"
                  label="Region Name"
                  placeholder="e.g. Usulutan"
                />

                {/* Nested Countries */}
                <NestedFieldArray
                  control={form.control}
                  parentIndex={producerIndex}
                  fieldArrayName="countries"
                  label="Country Name"
                  placeholder="e.g. El Salvador"
                />

                <div className="h-2"></div>
                <Separator color="black" />
                <div className="h-2"></div>
              </div>
            ))}
          </div>
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
            disabled={isSubmitting}
            className="mx-auto text-white border-black bg-emerald-500 border-2 font-bold py-4 px-8 mb-8 text-md  group-hover:underline"
          >
            {isSubmitting ? 'Adding Product...' : 'Add Product'}
          </Button>
        </div>

      </form>
    </Form >
  );
};

// Producer can have multiple regions and countries 
interface NestedFieldArrayProps {
  control: any;
  parentIndex: number;
  fieldArrayName: "regions" | "countries";
  label: string;
  placeholder: string;
}
const NestedFieldArray: React.FC<NestedFieldArrayProps> = ({
  control,
  parentIndex,
  fieldArrayName,
  label,
  placeholder,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `product.producers.${parentIndex}.${fieldArrayName}`,
  });

  return (
    <>
      <div className="flex flex-row items-center gap-4">
        <Button
          type="button"
          variant="default"
          className="ml-auto p-2 mr-3 bg-emerald-500 text-white font-bold"
          size="sm"
          onClick={() => append({ name: "" })}
        >
          + Add {fieldArrayName === "regions" ? "Region" : "Country"}
        </Button>
      </div>
      <div className="space-y-4">
        <div className="bg-white border-black border-2 p-2 sm:p-4 md:p-6 pt-6 mx-2 shadow-light">
          {fields.map((item, index) => (
            <div key={item.id}>

              <FormField
                control={control}
                name={`product.producers.${parentIndex}.${fieldArrayName}.${index}.name`}
                render={({ field }) => (
                  <div>
                    <p
                      className={cn(
                        "ml-9 text-sm font-medium",
                        index !== 0 ? "sr-only" : ""
                      )}
                    >
                      {label}<span className="text-red-500">&nbsp;*</span>
                    </p>
                    <FormItem className="flex-grow flex items-center space-x-2 pt-2 pr-3">
                      <span className="flex items-center justify-center border-black border-2 bg-blue-600 text-white h-7 w-7 font-semibold shrink-0 shadow-lightSm">
                        {index + 1}
                      </span>
                      <FormControl>
                        <Input placeholder={placeholder} {...field} />
                      </FormControl>
                      <FormMessage />
                      <Button
                        variant="reverse"
                        size="icon"
                        onClick={() => remove(index)}
                        disabled={fields.length <= 1 && index === 0}
                        className="shrink-0 bg-red-500 border-black text-black hover:bg-white"
                        aria-label={`Remove ${fieldArrayName === "regions" ? "region" : "country"}`}
                      >
                        <span className="text-xl font-semibold leading-none">&times;</span>
                      </Button>
                    </FormItem>
                  </div>
                )}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};


export default ProductForm;
