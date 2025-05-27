import React, { createContext, useContext, useEffect, useState } from 'react'
import { ExtractDesktopBannerData, getCartItems, getCategories, getFeaturedPost, getHomeBanner, getOrderList, getProducts, getSavedItem } from './api';
import { generateSearchSuggestions } from '.';
import { getUserData } from './auth';

interface Note {
    type: "error" | "success";
    title?: string;
    body?: string;
}
export interface Category {
    id: string,
    name: string,
    image?: string,
}

export interface HomeBanner {
    image: string;
    url?: string;
}

export interface CartProp {
    id: string;
    qty?: string | number;
    variant?:{
        size?: string | number;
        color?: string | number;
    } 
}

export type Suggestion = {
    type: "title" | "brand" | "category" | "tag" | "variant";
    text: string;
  };
  

export interface Product {
    id: string; // product id
    title: string; // product title
    category?: {
        id: string; // id of the category
        name: string; // category name
    };
    gallery?: {
        id?: string; // id
        url: string; // the link or path
    }[];
    created_at: Date | string; // date added
    price: {
        currency: "USD" | "NGN",
        current: number; // current selling price
        prev: number; // if the price was previously different, aim to calculate discount, etc
    };
    stock: number; // number of units available
    availability: boolean; // whether the product is currently available for sale
    description?: string; // detailed product description
    ratings?: {
        average: number; // average rating score
        count: number; // number of ratings/reviews
    };
    reviews?: {
        id: string; 
        rating:  number;
        user: string; 
        created_at: string | Date; 
        review: string
    }[]; // list of reviews
    sku: string; // unique identifier for inventory tracking
    tags?: string[]; // list of product tags or keywords for searching/filtering
    dimensions?: {
        length?: number; // in cm
        width?: number; // in cm
        height?: number; // in cm
    };
    weight?: number; // in kg
    discount?: {
        percentage: number; // discount percentage
        startDate: Date | string; // discount start date
        endDate: Date | string; // discount end date
    };
    isFeatured?: boolean;
    featured?: {
        main?: string;
        description?: string;
        gallery?: string[];
    };
    variant?: {
        size?: string [];
        color?: string[];
    };
    location?: string;
    brand?: string; // brand name
}

export interface DesktopBannerProp {
    deal?: string;
    title: string;
    image?: string;
    id: string;
}

export interface User {
        email: string;
        user_id: string;
        user_data: {
                name?: {
                    first?: string;
                    last?: string
                };
                address?: string;
                contact?: string;
        };
}

export interface Orders {
  id: string;
  order_item_id: string;
  title: Product['title'];
  desc: Product['description'];
  images?: Product['gallery'];
  price: Product['price'];
  qty:  string | number;
  variant?: {
    size?: string;
    color?:  string; 
  };
  status?: string;
}

export interface OrderList extends User { 
    user_id: string;
    email: string;
    order_id: string;
    reference: string;
    data: {
        order_id: string;
        amounts: string | number;
        orders: Orders[] 
    }
    payment_status: string;
    status: string;
    created_at: string | Date;
    payment_method: string;
    others:{
        bills: Record<string, any>, 
        note: string;
    }
}

export type Currency = { name: "USD", symbol: "$" } | { name: "NGN", symbol: "₦" } | { name: "EUR", symbol: "€" };

interface GlobalContext {
    note: Note | undefined;
    setNote: React.Dispatch<React.SetStateAction<Note | undefined>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    display: Display;
    categories: Category[] | undefined;
    homeBanner: HomeBanner[] | undefined;
    desktopBanner: DesktopBannerProp[] | undefined;
    currency: Currency;
    products: Product[] | undefined;
    featuredPost: Product[] | undefined;
    cart: CartProp[];
    setCartChanged: React.Dispatch<React.SetStateAction<boolean>>;
    saved: string[];
    setWishChanged: React.Dispatch<React.SetStateAction<boolean>>;
    hotSearch: Suggestion[];
    user: User;
    setUserChanged: React.Dispatch<React.SetStateAction<boolean>>;
    orderList: OrderList[];
}

interface Display {
    mobile: boolean;
    desktop: boolean;
}
const GlobalContext = createContext<GlobalContext | null>(null);



/* Component */
export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const mobile : number = 767;
    const [note, setNote] = useState<Note | undefined>();   //for bullet popup
    const [loading, setLoading] = useState<boolean>(true); //for overlay loading
    const [display, setDisplay] = useState<Display>({       //for ui responsiveness
        mobile: window.innerWidth <= mobile, 
        desktop: window.innerWidth > mobile
    });

    useEffect(() => {
        const configDisplay = () : void => {
            if(window.innerWidth > mobile){
                setDisplay({mobile: false, desktop:  true});
            }else{
                setDisplay({mobile: true, desktop:  false});
            }
        }
        window.addEventListener("resize", configDisplay);
        setTimeout(() => setLoading(false), 2000);
        return () => window.removeEventListener("resize", configDisplay);
    }, []);

        //// auth
    
        const [user, setUser] =  useState<User>({email: "", user_data: {}, user_id: ""});
        const [userChanged, setUserChanged] = useState<boolean>(true);
        useEffect(() => {
            if(!userChanged) return;
            getUserData()
            .then((res: User | undefined) => {
                if(!res) return;
                setUser(res)
            })
            .catch((err) => console.log("Cannot get userData ", err))
            .finally(() => setUserChanged(false));
        }, [userChanged]);

    // currency
    const [currency, setCurrency] = useState<Currency>({ name: "NGN", symbol: "₦" });
    useEffect(() => {
        const currency = localStorage.getItem("choosen_currency");
        if(!currency) return;
        const parsed : Currency = JSON.parse(currency);
        setCurrency(parsed);
    }, [])


    ///////////// all products ////////
    const [products, setProducts] = useState<Product[] | undefined>([]);
    useEffect(() => {
        getProducts()
        .then((data: Product[] | undefined) => {
            setProducts(data);
        })
        .catch((error: Error) => {
            console.log("Product not fetched: ", error.message);
        });
    }, []);



    ///////  home banner
    const [homeBanner, setHomeBanner] = useState<HomeBanner[] | undefined>([]);
    useEffect(() => {
        getHomeBanner()
        .then((banners: HomeBanner[] | undefined) => {
            setHomeBanner(banners);
        })
        .catch((error: Error) => {
            console.log("Home banners not fetched: ", error.message)
        })
    }, [products]);
    //desktop
    const [desktopBanner, setDesktopBanner] = useState<DesktopBannerProp[] | undefined>([]);
    useEffect(() => {
        if(!products) return;
        ExtractDesktopBannerData()
        .then((data: DesktopBannerProp[] | undefined) =>  {
            setDesktopBanner(data);
        })
        .catch((error: Error) => {
            console.log("Cannot extract banner for desktop: ", error)
        })
    }, [products]);

    /////////////// featuredPost
    const [featuredPost, setFeaturedPost] = useState<Product[] | undefined>([]);
    useEffect(() => {
        getFeaturedPost()
        .then((item: Product[] | undefined) => {
            setFeaturedPost(item);
        })
        .catch((error: Error) => {
            console.log("Cannot Fetch Featured: ", error)
        })
    }, [products])


    ////////////// products categories//
    const [categories, setCategories] = useState<Category[] | undefined>([]);
    //fetch category
    useEffect(() => {
        getCategories()
        .then((categories: Category[] | undefined) => {
            setCategories(categories);
        })
        .catch((error: Error) => {
            console.log("Category not fetched: ", error.message)
        })
    }, []);

    //////// cart
    const [cart, setCart] = useState<CartProp[]>([]);
    const [cartChanged, setCartChanged]  = useState<boolean>(true);
    useEffect(() => {
        if(!cartChanged) return;
        getCartItems()
        .then((cart: CartProp[]) => {
            setCart(cart);
        })
        .catch(error => {
            setNote({type: "error", title: "Error", body: error.message});
            return setTimeout(() => setNote({type: "error", title: "Error", body: error.message}), 5000);
        })
        .finally(() => setCartChanged(false));  
    }, [cartChanged]);



    //saved or wishList
    const [saved, setSaved] = useState<string[]>([]);
    const [wishChanged, setWishChanged]  = useState<boolean>(true);
    useEffect(() => {
        if(!wishChanged) return;
        getSavedItem()
        .then((res: string[]) => setSaved(res))
        .catch(err => console.log("Cannot Fetch Saved Items: ", err))
        .finally(() => setWishChanged(false)); //block-scope for refreshing or etc
    }, [wishChanged]);

    /// search suggesstion
    const [hotSearch, setHotsearch] = useState<Suggestion[]>([]);
    useEffect(() => {
        if(!products) return;
        const sugguestion : Suggestion[] = generateSearchSuggestions(products);
        setHotsearch(sugguestion);
    }, [products]);


    /// get all orders
    const [orderList, setOrderList] = useState<OrderList[]>([]);
    useEffect(() => {
        if(!user.email) return;
        getOrderList()
        .then((list: OrderList[]) => {
            setOrderList(list);
        })
        .catch((err) => console.log("Error fetching orderList: ", err))
    }, [user.email]);



    return (
        <GlobalContext.Provider value={{
            note, 
            setNote, 
            loading, 
            setLoading, 
            display, 
            categories, 
            homeBanner, 
            desktopBanner,
            currency,
            products, 
            featuredPost, 
            cart, 
            setCartChanged, 
            saved,
            setWishChanged,
            hotSearch,
            user,
            setUserChanged,
            orderList
            }}>
            {children}
        </GlobalContext.Provider>
    );
};





/* Custom Hook */
export const useGlobalProvider = () => {
    const context = useContext(GlobalContext);
    if (!context) throw new Error('useGlobalProvider must be used within a GlobalProvider');
    return context;
};
