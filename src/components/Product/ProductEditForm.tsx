"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { Photo } from "@prisma/client";

import {
  ProductEditRequest,
  ProductEditValidator,
} from "@/lib/validators/product";
import { trpc } from "@/server/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import PhotoUploadZone from "@/components/Photo/PhotoUploadZone";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import DeletePhotoButton from "@/components/Photo/PhotoDeleteButton";

type Props = {
  productId: string;
};

export default function ProductEditForm({ productId }: Props) {
  const router = useRouter();
  const [photo, setPhoto] = useState<Photo | undefined>(undefined);
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);

  const {
    data: productPreviousData,
    isLoading: databaseLoading,
    error: databaseError,
  } = trpc.product.getProduct.useQuery({ productId });

  const form = useForm<ProductEditRequest>({
    resolver: zodResolver(ProductEditValidator),
    defaultValues: {
      name: "",
      price: "0",
    },
  });

  useEffect(() => {
    if (Object.keys(form.formState.errors).length) {
      for (const [key, value] of Object.entries(form.formState.errors)) {
        toast.error(`Something went wrong: ${value.message}`);
      }
    }
  }, [form.formState.errors]);

  async function onSubmit(data: ProductEditRequest) {
    editProduct(data);
  }

  const { mutate: addPhoto } = trpc.photo.addPhotoToProduct.useMutation({
    onSuccess: (res) => {},
    onError: (err) => {
      toast.error(`Something went wrong during photo save.`);
    },
  });

  const { mutate: editProduct } = trpc.product.editProduct.useMutation({
    onSuccess: (res) => {
      if (photo?.id) {
        addPhoto({ productId: res.id, photoId: photo.id });
      }

      router.push(`/product/${res.id}`);
    },
    onError: (err) => {
      toast.error(`Something went wrong.`);
    },
  });

  useEffect(() => {
    if (productPreviousData) {
      form.setValue("name", productPreviousData.name);
      form.setValue("price", productPreviousData.price.toString());
      form.setValue("productId", productPreviousData.id);
      setPhoto(productPreviousData.Photos[0] ?? undefined);
    }
  }, [productPreviousData, form.setValue, setPhoto]);

  if (databaseLoading) {
    return false;
  }

  if (databaseError) {
    toast.error(`Something went wrong: ${databaseError?.message}`);
    return false;
  }

  function handlePhotoDeleted() {
    setPhoto(undefined);
  }

  function onBeforeUploadBegin() {
    setIsPhotoUploading(true);
  }

  function onClientUploadComplete(photo: Photo) {
    setPhoto(photo);
    setIsPhotoUploading(false);
  }

  return (
    <Form {...form}>
      <form
        id="edit-product"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Product name" {...field} />
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
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Product price"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {photo?.url ? (
          <div className="relative">
            <div className="absolute top-0">
              <DeletePhotoButton
                Photo={photo}
                onPhotoDeleted={handlePhotoDeleted}
              />
            </div>
            <Image
              src={photo.url}
              alt="Product image"
              width={600}
              height={400}
              className="aspect-video object-cover"
              priority
            />
          </div>
        ) : (
          <PhotoUploadZone
            onClientUploadComplete={onClientUploadComplete}
            onBeforeUploadBegin={onBeforeUploadBegin}
          />
        )}

        <div className="flex justify-end gap-2">
          <Button
            type="submit"
            data-test="product-edit-save-button"
            disabled={isPhotoUploading}
          >
            Save changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
