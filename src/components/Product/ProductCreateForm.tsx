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

import PhotoUploadZone from "@/components/Photo/PhotoUploadZone";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import DeletePhotoButton from "@/components/Product/PhotoDeleteButton";

export default function ProductCreateForm() {
  const router = useRouter();
  const [photo, setPhoto] = useState<Photo | undefined>(undefined);
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProductCreateRequest>({
    resolver: zodResolver(ProductCreateValidator),
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
    <div>
      <form id="create-product" onSubmit={handleSubmit(onSubmit)}>
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
              Create product
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
