import { CartProp, Category, DesktopBannerProp, HomeBanner, Product } from "@/constants/provider";
import axios from "axios";
import { serverRequest } from ".";

export interface Response {
    status: number;
    message: string;
    data?: any;
}
export const getCategories = async () : Promise<Category[] | undefined> => { 

    //logic to fetch categories here
    return [
      {
        "id": "BEA-6",
        "name": "beauty"
      },
      {
        "id": "FRA-10",
        "name": "fragrances"
      },
      {
        "id": "FUR-9",
        "name": "furniture"
      },
      {
        "id": "GRO-9",
        "name": "groceries"
      },
      {
        "id": "HOM-15",
        "name": "home-decoration"
      },
      {
        "id": "KIT-19",
        "name": "kitchen-accessories"
      },
      {
        "id": "LAP-7",
        "name": "laptops"
      },
      {
        "id": "MEN-11",
        "name": "mens-shirts"
      },
      {
        "id": "MEN-10",
        "name": "mens-shoes"
      },
      {
        "id": "MEN-12",
        "name": "mens-watches"
      },
      {
        "id": "MOB-18",
        "name": "mobile-accessories"
      },
      {
        "id": "MOT-10",
        "name": "motorcycle"
      },
      {
        "id": "SKI-9",
        "name": "skin-care"
      },
      {
        "id": "SMA-11",
        "name": "smartphones"
      },
      {
        "id": "SPO-18",
        "name": "sports-accessories"
      },
      {
        "id": "SUN-10",
        "name": "sunglasses"
      },
      {
        "id": "TAB-7",
        "name": "tablets"
      },
      {
        "id": "TOP-4",
        "name": "tops"
      },
      {
        "id": "VEH-7",
        "name": "vehicle"
      },
      {
        "id": "WOM-11",
        "name": "womens-bags"
      },
      {
        "id": "WOM-14",
        "name": "womens-dresses"
      },
      {
        "id": "WOM-16",
        "name": "womens-jewellery"
      },
      {
        "id": "WOM-12",
        "name": "womens-shoes"
      }
    ]
}

///
//
//IMPORTANT NOTICE 
//
// USE /API/ROUTE_NAME for backend route to avoid route clash in product
//
///
//
//
///
///
///
//

export const getHomeBanner = async () : Promise<HomeBanner[] | undefined> => {

    return [
        {image: "https://static.vecteezy.com/system/resources/thumbnails/007/808/325/small/flash-sale-banner-template-design-for-web-or-social-media-vector.jpg"},
        {image: "https://img.freepik.com/free-vector/gradient-flash-sale-background_23-2149027975.jpg?semt=ais_hybrid&w=740"},
        {image: "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/flash-sale-banner-design-template-9349bfc8031a263ff98d40c75a97378a_screen.jpg?ts=1714269671"},
    ]
}

export const getProducts = async () : Promise<Product[] | undefined> => {
    //mine
    /*const response = await axios.get("/products.json");
    if(response.data.message !== "success") return [];
    const products : Product[] = response.data.data;
    if(response.status < 200 || response.status >= 300) return [];
    return products;*/

    //external api
    const response = await axios.get("https://dummyjson.com/products?limit=0");
    if(response.data.products < 1) return [];
    const products : Product[] = response.data.products.map(convertToProductFormat);
    if(response.status < 200 || response.status >= 300) return [];

    return products;
}

//////////////////

function convertToProductFormat(raw: any): Product {
    const randomDate = new Date(Date.now() - Math.floor(Math.random() * 1e10)).toISOString();
    const currentPrice = raw.price;
    const discount = raw.discountPercentage || 0;
    const prevPrice = +(currentPrice / (1 - discount / 100)).toFixed(2);
  
    const reviews = raw.reviews?.map((r: any, index: number) => ({
      id: `${raw.id}-${index + 1}`,
      rating: r.rating,
      user: r.reviewerName,
      created_at: r.date,
      review: r.comment,
    })) || [];
  
    const averageRating = reviews.length
      ? +(reviews.reduce((sum: any, r: any) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;
  
    return {
      id: raw.id.toString(),
      title: raw.title,
      category: {
        id: raw.category.toUpperCase().slice(0, 3) + "-" + raw.category.length,
        name: raw.category
      },
      gallery: [
        ...(raw.images || []).map((url: string) => ({ url })),
        ...(raw.thumbnail ? [{ url: raw.thumbnail }] : [])
      ],
      created_at: randomDate,
      price: {
        currency: "USD",
        current: currentPrice,
        prev: prevPrice
      },
      stock: raw.stock,
      availability: raw.availabilityStatus?.toLowerCase().includes("in stock") ?? raw.stock > 0,
      description: raw.description,
      ratings: {
        average: averageRating,
        count: reviews.length
      },
      reviews,
      sku: raw.sku,
      tags: raw.tags,
      dimensions: raw.dimensions ? {
        length: raw.dimensions.depth,
        width: raw.dimensions.width,
        height: raw.dimensions.height
      } : undefined,
      weight: raw.weight,
      discount: discount > 0 ? {
        percentage: discount,
        startDate: randomDate,
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString() // 7 days after
      } : undefined,
      brand: raw.brand
    };
  }
  








///////////////



export const ExtractDesktopBannerData = async () : Promise<DesktopBannerProp[] | undefined> => {
    const keyword = "apple" // tag used to filter item
    const products = await getProducts() as Product[];
    if(!products) return [];

    const featured = products.filter((item: Product) => item.tags?.some(tag => tag.toLowerCase() === keyword)).slice(0, 5);
    const fit = (item: Product): DesktopBannerProp =>  ({
            title: item.description ?? item.title,
            id: item.id,
            image: item.gallery?.[0].url, // Assuming gallery is an array and you want the first image
            deal: "Featured Post",
    });
    return featured.map(fit);
}

export const getFeaturedPost = async () : Promise<Product[] | undefined> => {
    const products = await getProducts() as Product[];
    if(!products) return [];
    const featured = products.filter((item: Product) => item.isFeatured);
    return featured;
}




///cart

export const getCartItems = async () : Promise<CartProp[]> => {

    const result = await serverRequest("get", "cart/");

    if(result.message !== "success") return [];
    const cart :  CartProp[] = result.data;
 
    return cart;
}

export const addToCart = async (data: {id: string, qty?: string; variant?: Record<string, any>}) : Promise<Response> => {

  const result : Response = await serverRequest("post", "cart/add/", data);

  return result;
}




export const MinusCartItemQty = async (data: {id: string, qty?: string;}) : Promise<Response> => {
  const result : Response = await serverRequest("post", "cart/qty/decrease/", data, "json");
  return result;
}

export const IncreaseCartItemQty = async(data: {id: string, qty?: string;}) : Promise<Response> => {
  const result : Response = await serverRequest("post", "cart/qty/increase/", data, "json");
  return result;
}

export const removeCartItem = async (data: {id: string}) : Promise<Response> => {
  const result : Response = await serverRequest("post", "cart/remove/", data);
  return result;
}


///wishlist
export const getSavedItem = async () : Promise<string[]> => {
  const result = await serverRequest("get", "wishlist/");

  if(result.message !== "success") return [];
  const wishlist :  string[] = result.data;

  return wishlist;
}


export const addToWishList = async (data: {id: string}) => {
  const result : Response = await serverRequest("post", "wishlist/add/", data);
  return result;
}



export const removeWishItem = async (data: {id: string}) : Promise<Response> => {
  const result : Response = await serverRequest("post", "wishlist/remove/", data);
  return result;
}

