import { describe, expect, it } from "vitest";
import { formatPrice, getPublicPhotoUrl, getPublicPrice } from "./utils";
import { Photo, Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
import { PHOTO_REPLACEMENT_URL } from "@/config/photo";

describe("getMainPhotoUrl", () => {
  const mockedMainPhoto: Photo = {
    id: "1",
    key: "key",
    url: "mockedMainPhotoUrl",
    fileName: "mockedMainPhotoFileName.jpg",
    isMainPhoto: true,
  };

  const mockedNotMainPhoto: Photo = {
    id: "2",
    key: "key",
    url: "mockedNotMainPhotoUrl",
    fileName: "mockedNotMainPhotoFileName.jpg",
    isMainPhoto: false,
  };

  const getNotMainPhotos = (count: number) => {
    const photos = [];
    for (let i = 0; i < count; i++) {
      photos.push({
        id: randomUUID(),
        key: "key",
        url: randomUUID(),
        fileName: randomUUID(),
        isMainPhoto: false,
      });
    }
    return photos;
  };

  it("should return main photo when is first in array", () => {
    const photos = [mockedMainPhoto, mockedNotMainPhoto];
    const photoUrl = getPublicPhotoUrl(photos);
    expect(photoUrl).toEqual(mockedMainPhoto.url);
  });

  it("should return main photo when is not first in array", () => {
    const photos = [mockedNotMainPhoto, mockedMainPhoto];
    const photoUrl = getPublicPhotoUrl(photos);
    expect(photoUrl).toEqual(mockedMainPhoto.url);
  });

  it("should return main photo when there are multiple photos", () => {
    const notMainPhotos = getNotMainPhotos(5);
    const photos = [mockedNotMainPhoto, mockedMainPhoto, ...notMainPhotos];
    const photoUrl = getPublicPhotoUrl(photos);
    expect(photoUrl).toEqual(mockedMainPhoto.url);
  });

  it("should return first photo when there is no main photo", () => {
    const photos = [mockedNotMainPhoto];
    const photoUrl = getPublicPhotoUrl(photos);
    expect(photoUrl).toEqual(mockedNotMainPhoto.url);
  });

  it("should return first photo when there is no main photo and multiple photos", () => {
    const notMainPhotos = getNotMainPhotos(5);
    const photos = [mockedNotMainPhoto, ...notMainPhotos];
    const photoUrl = getPublicPhotoUrl(photos);
    expect(photoUrl).toEqual(mockedNotMainPhoto.url);
  });

  it("should return undefined when there are no photos", () => {
    const photos: Photo[] = [];
    const photoUrl = getPublicPhotoUrl(photos);
    expect(photoUrl).toEqual(PHOTO_REPLACEMENT_URL);
  });
});

describe("getPublicPrice", () => {
  it("should format price in DEFAULT_PRICE_CURRENCY", () => {
    const prismaPrice = new Prisma.Decimal("1234.56");
    const price = getPublicPrice(prismaPrice);
    expect(price).toBe("1234,56 zł");
  });

  it("should format long price with standard notation", () => {
    const prismaPrice = new Prisma.Decimal("1234567.89");
    const price = getPublicPrice(prismaPrice);
    expect(price).toMatch("1 234 567,89 zł");
  });

  it("should return 'Free' when price is 0", () => {
    const prismaPrice = new Prisma.Decimal("0");
    const price = getPublicPrice(prismaPrice);
    expect(price).toBe("Free");
  });

  it("should handle string price '10' like Decimal", () => {
    const wrongPrice = "10";
    // @ts-ignore
    const price = getPublicPrice(wrongPrice);
    expect(price).toBe("10,00 zł");
  });
});

describe("formatPrice", () => {
  it("should format price in PLN if not specified", () => {
    const prismaPrice = new Prisma.Decimal("1234.56");
    const price = formatPrice(prismaPrice);
    expect(price).toBe("1234,56 zł");
  });

  it("should format price with standard notation if not specified", () => {
    const prismaPrice = new Prisma.Decimal("1234567.89");
    const price = formatPrice(prismaPrice);
    expect(price).toMatch("1 234 567,89 zł");
  });

  it("should format price in PLN", () => {
    const prismaPrice = new Prisma.Decimal("1234.56");
    const price = formatPrice(prismaPrice, { currency: "PLN" });
    expect(price).toBe("1234,56 zł");
  });

  it("should format price in USD", () => {
    const prismaPrice = new Prisma.Decimal("1234.56");
    const price = formatPrice(prismaPrice, { currency: "USD" });
    expect(price).toBe("$1,234.56");
  });

  it("should format price in EUR", () => {
    const prismaPrice = new Prisma.Decimal("1234.56");
    const price = formatPrice(prismaPrice, { currency: "EUR" });
    expect(price).toBe("1.234,56 €");
  });

  it("should format long price with compact notation", () => {
    const prismaPrice = new Prisma.Decimal("1234567.89");
    const price = formatPrice(prismaPrice, { notation: "compact" });
    expect(price).toMatch("1,2 mln zł");
  });
});
