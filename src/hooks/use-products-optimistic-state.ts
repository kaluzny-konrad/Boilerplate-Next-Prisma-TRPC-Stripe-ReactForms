import { Photo, Product } from "@prisma/client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ProductItem = {
  product: Product & { Photos: Photo[] };
  disabled?: boolean;
};

type ProductsState = {
  products: ProductItem[];

  onProductAdd: (product: Product & { Photos: Photo[] }) => void;
  onProductUpdate: (product: Product & { Photos: Photo[] }) => void;
  onProductDelete: (product: Product & { Photos: Photo[] }) => void;

  onPhotoUploadBegin: (productId: string, photo: Photo) => void;
  onPhotoUploadComplete: (productId: string, photo: Photo) => void;
  onPhotoDelete: (productId: string, photo: Photo) => void;

  setOptimisticUpdateLoading: (productId: string, loading: boolean) => void;
};

export const useProductsOptimisticState = create<ProductsState>()(
  persist(
    (set) => ({
      products: [],
      onProductAdd: (product) => {
        set((state) => ({
          products: [...state.products, { product }],
        }));
      },
      onProductUpdate: (product) => {
        set((state) => ({
          products: state.products.map((productItem) =>
            productItem.product.id === product.id ? { product } : productItem,
          ),
        }));
      },
      onProductDelete: (product) => {
        set((state) => ({
          products: state.products.filter(
            (productItem) => productItem.product.id !== product.id,
          ),
        }));
      },
      onPhotoUploadBegin: (productId, photo) => {
        set((state) => ({
          products: state.products.map((productItem) =>
            productItem.product.id === productId
              ? {
                  product: {
                    ...productItem.product,
                    Photos: [...productItem.product.Photos, photo],
                  },
                }
              : productItem,
          ),
        }));
      },
      onPhotoUploadComplete: (productId, photo) => {
        set((state) => ({
          products: state.products.map((productItem) =>
            productItem.product.id === productId
              ? {
                  product: {
                    ...productItem.product,
                    Photos: productItem.product.Photos.map((p) =>
                      p.id === photo.id ? photo : p,
                    ),
                  },
                }
              : productItem,
          ),
        }));
      },
      onPhotoDelete: (productId, photo) => {
        set((state) => ({
          products: state.products.map((productItem) =>
            productItem.product.id === productId
              ? {
                  product: {
                    ...productItem.product,
                    Photos: productItem.product.Photos.filter(
                      (p) => p.id !== photo.id,
                    ),
                  },
                }
              : productItem,
          ),
        }));
      },
      setOptimisticUpdateLoading: (productId, loading) => {
        set((state) => ({
          products: state.products.map((productItem) =>
            productItem.product.id === productId
              ? {
                  product: {
                    ...productItem.product,
                    optimisticUpdateLoading: loading,
                  },
                }
              : productItem,
          ),
        }));
      },
    }),
    {
      name: "products-optimistic-state",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
