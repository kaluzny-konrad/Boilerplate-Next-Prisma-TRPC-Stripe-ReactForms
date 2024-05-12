"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ProductCreateRequest,
  ProductCreateValidator,
} from "@/lib/validators/product";
import { trpc } from "@/server/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import UploadImageZone from "./UploadImageZone";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";


export default function ProductCreateForm() {
    const router = useRouter();

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
        imageId: undefined,
      },
    });
  
    useEffect(() => {
      if (Object.keys(errors).length) {
        for (const [key, value] of Object.entries(errors)) {
          toast.error(`Something went wrong: ${value.message}`);
          console.error(errors);
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
        console.error(err);
      },
    });
  
    const imageUploaded = (args: { imageId: string }) => {
      setValue("imageId", args.imageId);
    };
  
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
  
          <UploadImageZone imageUploaded={imageUploaded} />
          <div className="hidden">
            <Label htmlFor="imageId">Main image</Label>
            <Input type="text" id="imageId" {...register("imageId")} />
          </div>
    
          <div>
            <Button type="submit" variant={'default'}>Create product</Button>
          </div>
        </form>
      </div>
    );
  }
  