//import axios from "axios";
import { Currency, Product, Suggestion } from "./provider";
import { Response } from "./api";

export const appLogoUri : string = "/logo_text.png";
export const appName: string = "ShopAM";
export const appFavicon: string = "/dt_favicon.png";
export const currency : Currency[] = [
  {
  name: "USD",
  symbol: "$",
  },
  {
    name: "NGN",
    symbol: "₦",
  },
  {
    name: "EUR",
    symbol: "€",
  }
];
export const defaultUserDp : string = "https://i.pinimg.com/236x/9d/b6/0b/9db60bcc99768a7b224d7f8647cb95ce.jpg";
//export const server : string = "https://192.168.43.103:3000/api";
export const server : string = "https://api.sora.com.ng/api";

export const serverRequest = async (
  method: "post" | "get",
  route: string,
  data?: any,
  type?: "json" | "form"
): Promise<Response> => {
  const headers = {
    "Content-Type": type === "form" ? "application/x-www-form-urlencoded" : "application/json",
  };


  const payload = type === "form"
    ? new URLSearchParams({data}).toString()
    : JSON.stringify({data});

  const options: RequestInit = {
    method: method.toUpperCase(),
    headers,
    credentials: "include",
  };

  if (method === "post") {
    options.body = payload;
  } else if (method === "get" && data) {
    route += `?${new URLSearchParams(data).toString()}`;
  }

  const response = await fetch(`${server}/${route}`, options);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json() as Promise<Response>;
};

export const formatNumberWithCommas = (num: number) : string => {
    if(typeof num !== "number") return "Invalid Amount"
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function randomString(length = 25) {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export const returnUrl = ({ goto, params }: { goto: string, params?: Record<string, any>}): string => {
  // Join params into the URL path
  const path = params ? Object.values(params).map(String).join("/") : null;

  return `${goto}${path ? "/" + path : ""}`;
};


// Utility to safely access nested fields like "price.current"
const getNestedValue = (obj: any, path: string): any => {
  // Convert bracket notation to dot notation: items[0].price → items.0.price
  const normalizedPath = path.replace(/\[(\w+)\]/g, '.$1');
  const parts = normalizedPath.split('.');

  return parts.reduce((acc, part) => acc?.[part], obj);
};


export const SortData = (
  data: any[],
  newest: boolean,
  field: string
) => {
  const sortedData = [...data].sort((a, b) => {
    const valA = getNestedValue(a, field);
    const valB = getNestedValue(b, field);

    if (valA === valB) return 0;
    if (newest) return valA < valB ? 1 : -1;
    return valA > valB ? 1 : -1;
  });

  return sortedData;
};


  
export const generateSearchSuggestions = (products: Product[]): Suggestion[] => {
  const seen = new Set<string>();
  const result: Suggestion[] = [];

  const add = (text: string, type: Suggestion["type"]) => {
    const key = `${type}:${text.toLowerCase()}`;
    if (!seen.has(key)) {
      seen.add(key);
      result.push({ type, text: text.toLowerCase() });
    }
  };

  products.forEach(product => {
    // title
    const words = product.title.split(" ").filter(word => word.length > 2);

    // Add single word suggestions
    words.forEach((word: string) => add(word, "title"));

    // Add multi-word phrases (e.g., "iphone 14")
    for (let i = 0; i < words.length; i++) {
      for (let j = i + 1; j <= words.length; j++) {
        const phrase = words.slice(i, j).join(" ");
        if (phrase.length > 2) add(phrase, "title");
      }
    }

    // category
    if (product.category?.name) add(product.category.name, "category");

    // tags
    product.tags?.forEach(tag => add(tag, "tag"));

    // brand
    if (product.brand) add(product.brand, "brand");

    // variant
    //product.variant?.color?.forEach(color => add(color, "variant"));
    //product.variant?.size?.forEach(size => add(size, "variant"));
    Object.values(product.variant||{}).forEach((v)=>add(v.value, "variant"));
  });

  return result;
};


export const generateOrderID = (length: number = 4): string => {
  const segment = () => randomString(length).toUpperCase();
  return `${segment()}-${segment()}-${segment()}`;
};


export const capFirstLetter = (name: string) : string => {
  return name.slice(0, 1).toUpperCase() + name.slice(1).toLowerCase();
}

export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "processing":
      return "var(--processing-color)";
    case "delivered":
      return "var(--completed-color)";
    case "cancelled":
      return "var(--cancelled-color)";
    case "refunded":
      return "var(--refunded-color)";
    default:
      return "var(--default-color)";
  }
}

export function formatDeliveryDate(input: Date | string): string {
  const date = new Date(input);
  const now = new Date();

  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();
  //const hours = date.getHours();
  //const minutes = String(date.getMinutes()).padStart(2, '0');
  //const ampm = hours >= 12 ? 'pm' : 'am';
  //const formattedHour = hours % 12 === 0 ? 12 : hours % 12;

  //const time = `${formattedHour}:${minutes}${ampm}`;
  const datePart = now.getFullYear() === year
    ? `${day} ${month}`
    : `${day} ${month} ${year}`;

  return `${datePart}`;//, ${time}
}