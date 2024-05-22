"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ProductEditRequest,
  ProductEditValidator,
} from "@/lib/validators/product";
import { trpc } from "@/server/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import PhotoUploadZone from "./PhotoUploadZone";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import DeletePhotoButton from "./PhotoDeleteButton";
import { Photo } from "@prisma/client";

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

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProductEditRequest>({
    resolver: zodResolver(ProductEditValidator),
    defaultValues: {
      name: "",
      price: "0",
    },
  });

  useEffect(() => {
    if (Object.keys(errors).length) {
      for (const [key, value] of Object.entries(errors)) {
        toast.error(`Something went wrong: ${value.message}`);
      }
    }
  }, [errors]);

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
      setValue("name", productPreviousData.name);
      setValue("price", productPreviousData.price.toString());
      setValue("productId", productPreviousData.id);
      setPhoto(productPreviousData.Photos[0] ?? undefined);
    }
  }, [productPreviousData, setValue, setPhoto]);

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
    <div>
      <form id="edit-product" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label htmlFor="name">Product name</Label>
          <Input type="text" id="name" {...register("name")} />
        </div>
        <div>
          <Label htmlFor="price">Price</Label>
          <Input type="number" step="0.01" id="price" {...register("price")} />
        </div>

        {photo?.url ? (
          <div>
            <Image
              src={photo.url}
              alt="Product image"
              width={600}
              height={400}
              className="h-auto w-auto"
              priority
            />
          </div>
        ) : (
          <PhotoUploadZone
            onClientUploadComplete={onClientUploadComplete}
            onBeforeUploadBegin={onBeforeUploadBegin}
          />
        )}

        <div className="flex gap-2 m-2">
          <div>
            <Button
              type="submit"
              variant={"default"}
              disabled={isPhotoUploading}
            >
              Save changes
            </Button>
          </div>

          {photo?.url && (
            <div>
              <DeletePhotoButton
                Photo={photo}
                onPhotoDeleted={handlePhotoDeleted}
              />
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
