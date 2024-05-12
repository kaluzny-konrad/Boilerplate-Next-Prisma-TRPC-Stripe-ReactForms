"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ProductCreateRequest,
  ProductCreateValidator,
} from "@/lib/validators/product";
import { trpc } from "@/server/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import UploadImageZone from "./UploadImageZone";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import Image from "next/image";
import DeletePhotoButton from "./DeletePhotoButton";
import { Photo } from "@prisma/client";

export default function ProductCreateForm() {
  const router = useRouter();
  const [photo, setPhoto] = useState<Photo | undefined>(undefined);

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
      photoId: undefined,
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

  const { mutate: createProduct } = trpc.product.createProduct.useMutation({
    onSuccess: (res) => {
      router.push(`/product/${res.id}`);
    },
    onError: (err) => {
      toast.error(`Something went wrong.`);
    },
  });

  function handlePhotoChanged(photo: Photo | undefined) {
    setPhoto(photo);
    setValue("photoId", photo?.id);
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

            <DeletePhotoButton
              Photo={photo}
              onPhotoDeleted={() => handlePhotoChanged(undefined)}
            />
          </div>
        ) : (
          <UploadImageZone handleImageUploaded={handlePhotoChanged} />
        )}
        <div className="hidden">
          <Label htmlFor="photoId">Main image</Label>
          <Input type="text" id="photoId" {...register("photoId")} />
        </div>

        <div>
          <Button type="submit" variant={"default"}>
            Create product
          </Button>
        </div>
      </form>
    </div>
  );
}
