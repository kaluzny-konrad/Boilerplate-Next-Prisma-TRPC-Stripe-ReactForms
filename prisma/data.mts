import { Prisma } from "@prisma/client";

export const Products: Prisma.ProductCreateInput[] = [
  {
    name: "Product 1",
    price: 10,
    priceId: "price_1PFrcdF5tzy1eZfnffEWBKys",
    stripeProductId: "prod_Q63krustgB2jRo",
  },
  {
    name: "Product 2",
    price: 10,
    priceId: "price_1PFrcdF5tzy1eZfnffEWBKys",
    stripeProductId: "prod_Q63krustgB2jRo",
  },
];

export const Photos: Prisma.PhotoCreateInput[] = [
  {
    url: "https://utfs.io/f/1aeaeeeb-37f2-4b4e-989f-ff5bbc6a2ebd-amfegj.jpg",
    key: "1aeaeeeb-37f2-4b4e-989f-ff5bbc6a2ebd-amfegj.jpg",
  },
  {
    url: "https://utfs.io/f/ea61e6fd-b680-48d3-8a6c-24861baa70c7-amfegi.jpg",
    key: "ea61e6fd-b680-48d3-8a6c-24861baa70c7-amfegi.jpg",
  },
];