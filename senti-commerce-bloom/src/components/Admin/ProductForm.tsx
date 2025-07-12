import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Product,
  createProduct,
  updateProduct,
} from "@/features/products/productSlice";
import { useAppDispatch } from "@/app/hooks";

const formSchema = z.object({
  product_name: z
    .string()
    .min(2, { message: "Product name must be at least 2 characters." }),
  price: z.string().min(1, { message: "Price is required." }),
  category: z.coerce
    .number()
    .min(1, { message: "Category ID must be a positive number." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." }),
  image_url: z.string().url({ message: "Please enter a valid URL." }),
  stock: z.coerce
    .number()
    .min(0, { message: "Stock must be a non-negative number." }),
  is_available: z.boolean().default(true),
});

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
}

const ProductForm: React.FC<ProductFormProps> = ({
  open,
  onOpenChange,
  product,
}) => {
  const dispatch = useAppDispatch();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product_name: "",
      price: "",
      category: 1,
      description: "",
      image_url: "",
      stock: 0,
      is_available: true,
    },
  });

  React.useEffect(() => {
    if (product) {
      form.reset({
        product_name: product.product_name,
        price: product.price,
        category: product.category,
        description: product.description,
        image_url: product.image_url,
        stock: product.stock,
        is_available: product.is_available,
      });
    } else {
      form.reset({
        product_name: "",
        price: "",
        category: 1,
        description: "",
        image_url: "",
        stock: 0,
        is_available: true,
      });
    }
  }, [product, open, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (product) {
        await dispatch(
          updateProduct({ id: product.id, data: values })
        ).unwrap();
      } else {
        await dispatch(createProduct(values)).unwrap();
      }
      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      console.error("Failed to save product:", error);

      // Check if it's a role-related error
      if (
        error?.message?.includes("seller") ||
        error?.response?.data?.error?.includes("seller")
      ) {
        alert(
          "Error: Only sellers can create products. Please make sure you're logged in with a seller account."
        );
      } else if (error?.response?.status === 403) {
        alert("Error: You don't have permission to perform this action.");
      } else if (error?.response?.status === 401) {
        alert("Error: Please log in to continue.");
      } else {
        alert(
          `Error: ${
            error?.message || "Failed to save product. Please try again."
          }`
        );
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add Product"}</DialogTitle>
          <DialogDescription>
            {product
              ? "Make changes to your product here. Click save when you're done."
              : "Add a new product to your store."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="product_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="99.99" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category ID</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Product description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/image.png"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductForm;
