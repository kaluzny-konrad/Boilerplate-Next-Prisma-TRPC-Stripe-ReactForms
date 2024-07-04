"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Photo } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  ProductCreateRequest,
  ProductCreateValidator,
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

export default function ProductCreateForm() {
  const router = useRouter();
  const [photo, setPhoto] = useState<Photo | undefined>(undefined);
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);

  const form = useForm<ProductCreateRequest>({
    resolver: zodResolver(ProductCreateValidator),
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

  async function onSubmit(data: ProductCreateRequest) {
    createProduct(data);
  }

  const { mutate: addPhoto } = trpc.photo.addPhotoToProduct.useMutation({
    onSuccess: (res) => {},
    onError: (err) => {
      toast.error(`Something went wrong during photo save.`);
    },
  });

  const { mutate: createProduct } = trpc.product.createProduct.useMutation({
    onSuccess: (res) => {
      if (photo?.id) {
        addPhoto({ productId: res.id, photoId: photo.id });
      }

      router.push(`/product/${res.id}`);
    },
    onError: (err) => {
      toast.error(`Something went wrong during product save.`);
    },
  });

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
        id="create-product"
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
          <Button type="submit" variant={"default"} disabled={isPhotoUploading}>
            Create product
          </Button>
        </div>
      </form>
    </Form>
  );
}
