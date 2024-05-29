import { type ClassValue, clsx } from "clsx";
import { Metadata } from "next";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNowStrict } from "date-fns";
import locale from "date-fns/locale/en-US";
import { Prisma } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  if (typeof window !== "undefined") return path;
  return `${process.env.NEXT_PUBLIC_SERVER_URL}${path}`;
}

export function formatPrice(
  price: Prisma.Decimal | string,
  options: {
    currency?: "PLN" | "USD" | "EUR" | "GBP" | "BDT";
    notation?: Intl.NumberFormatOptions["notation"];
  } = {}
) {
  const defaultCurrency = process.env.DEFAULT_CURRENCY ?? "PLN";
  const { currency = defaultCurrency, notation = "compact" } = options;

  const numericPrice =
    typeof price === "string"
      ? new Prisma.Decimal(price).toNumber()
      : price.toNumber();

  const defaultNumberLocales = process.env.DEFAULT_NUMBER_LOCALES ?? "pl-PL";
  return new Intl.NumberFormat(defaultNumberLocales, {
    style: "currency",
    currency,
    notation,
    maximumFractionDigits: 2,
  }).format(numericPrice);
}

export function getPriceSum(prices: Prisma.Decimal[]) {
  return prices.reduce((acc, curr) => acc.add(curr), new Prisma.Decimal(0));
}

export function getDecimalPrice(price: string) {
  return new Prisma.Decimal(price).toDecimalPlaces();
}

const formatDistanceLocale = {
  lessThanXSeconds: "just now",
  xSeconds: "just now",
  halfAMinute: "just now",
  lessThanXMinutes: "{{count}}m",
  xMinutes: "{{count}}m",
  aboutXHours: "{{count}}h",
  xHours: "{{count}}h",
  xDays: "{{count}}d",
  aboutXWeeks: "{{count}}w",
  xWeeks: "{{count}}w",
  aboutXMonths: "{{count}}m",
  xMonths: "{{count}}m",
  aboutXYears: "{{count}}y",
  xYears: "{{count}}y",
  overXYears: "{{count}}y",
  almostXYears: "{{count}}y",
};

function formatDistance(token: string, count: number, options?: any): string {
  options = options || {};

  const result = formatDistanceLocale[
    token as keyof typeof formatDistanceLocale
  ].replace("{{count}}", count.toString());

  if (options.addSuffix) {
    if (options.comparison > 0) {
      return "in " + result;
    } else {
      if (result === "just now") return result;
      return result + " ago";
    }
  }

  return result;
}

export function formatTimeToNow(date: Date): string {
  try {
    return formatDistanceToNowStrict(date, {
      addSuffix: true,
      locale: {
        ...locale,
        formatDistance,
      },
    });
  } catch (error) {}
  return "";
}

export function shrinkDescription(description: string, maxLength: number) {
  if (description.length <= maxLength) return description;

  // split to max length, but not in the middle of the word
  const words = description.split(" ");
  let result = "";
  for (const word of words) {
    if (result.length + word.length > maxLength) break;
    result += word + " ";
  }
  return result.trim() + "...";
}

export function constructMetadata({
  title = "Title",
  description = "description.",
  image = "/thumbnail.png",
  icons = "/favicon.ico",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@twitterAccount",
    },
    icons,
    metadataBase: new URL("http://localhost:3000/"),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
