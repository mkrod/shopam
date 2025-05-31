import ActivityIndicator from '@/components/activity_indicator';
import { appName, formatDeliveryDate, formatNumberWithCommas, returnUrl } from '@/constants';
import { CartProp, Product, useGlobalProvider } from '@/constants/provider'
import React, { useEffect, useState } from 'react'
import { Rating } from 'react-simple-star-rating';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';
import { MdOutlineProductionQuantityLimits } from 'react-icons/md';
import { FaCaretLeft, FaCaretRight, FaHeart, FaMinus, FaPlus, FaRegHeart } from 'react-icons/fa6';
import DesktopProductCard from '@/components/desktop_product_card';
import usePagination from '@/constants/usePagination';
import { IoMdList, IoMdShareAlt } from 'react-icons/io';
import stringSimilarity from "string-similarity";
import ReviewComponent from '@/components/reviews';
import Discussion from '@/components/discussion';
import { addToCart, addToWishList, IncreaseCartItemQty, MinusCartItemQty, removeCartItem, removeWishItem, Response } from '@/constants/api';
import { useNavigate } from 'react-router';
import  "./css/product_details.css";
import { TbTruckDelivery, TbTruckReturn } from 'react-icons/tb';
import { GiCardPickup } from 'react-icons/gi';
const ProductDesktop : React.FC<{id:  string | undefined}> = ({ id }) : React.JSX.Element => {

    

    const navigate = useNavigate();
    const { products, setNote, setCartChanged, cart, saved, user, setWishChanged } = useGlobalProvider();
    const [product, setProduct] = useState<Product | undefined>();
    const [rating, setRating] = useState<number | undefined>(0);
    const [ImageShowing, setImageShowing] = useState(0);
    const [loadingImage, setLoadingImage] = useState<boolean>(true);
    useEffect(() => {
        if((!products || products.length === 0) || !id) return;
        const thisProduct = products.find((item: Product) => item.id === id);
        if(!thisProduct) {
            navigate(-1);
            return;
          }
        setProduct(thisProduct);
    }, [products, id]);

    useEffect(() => {
        if((!product || !product.reviews || product.reviews.length < 1)) return;
        const totalRating : number = product.reviews.reduce((total, rating) => total += (rating.rating || 0), 0);
        
        if(totalRating < 1){
          setRating(totalRating);
          return;
        }else{
          const avgRating : number = parseFloat((totalRating / product.reviews.length).toFixed(1));
          return setRating(avgRating);
        }

    }, [product]);

    useEffect(() => {
        let lightbox: PhotoSwipeLightbox | null = new PhotoSwipeLightbox({
          gallery: '#product-gallery',
          children: 'a',
          pswpModule: () => import('photoswipe'),
        });
        lightbox.init();
    
        return () => {
          if (lightbox) {
            lightbox.destroy();
          }
          lightbox = null;
        };
      }, []);
      const [showingFullDescription, setShowingFullDescription] = useState<boolean>(false);


      const [similarCategory, setSimilarCategory] = useState<Product[] | undefined>()
      const { nextFp, prevFp, canNextFp, canPrevFp, startEnd} = usePagination({perView: 4, data: similarCategory || []});
      useEffect(() => {
        if(!product || !products) return;
        const category = product.category;
        const same = products.filter((prod: Product) => prod.category === category || stringSimilarity.compareTwoStrings(prod.sku, product.sku) >= 0.7);
        setSimilarCategory(same);
      }, [products, product]);



      const [activeTab, setActiveTab] = useState<"reviews" | "discussion">("reviews");

      const [variant, setVariant] = useState<{size: string, color: string}>({size: "", color: ""});
      const [qty, setQty] = useState<number>(1);
      

      const [cantProceed, setCantProceed] = useState<boolean>();

    useEffect(() => {
      if (!product || !product.variant) return;
      const sizes = Array.isArray(product.variant.size) ? product.variant.size : [];
      const colors = Array.isArray(product.variant.color) ? product.variant.color : [];
      const cantproceed: boolean = ((sizes.length > 0 && variant.size === "") || (colors.length > 0 && variant.color === "") || !product.availability);
      setCantProceed(cantproceed);
    }, [product, variant]);


      const [isAddingCart, setIsAddingCart] = useState<boolean>();
      const addItemTocart = async () => {
         if(!product) {
             setNote({type: "error", title: "Failed", body: "failed to cart item"});
             return setTimeout(() => setNote(undefined), 2000);
         }
         setIsAddingCart(true);
         if(!user.email || !user.user_id){
           setNote({type: "error", title: "Failed", body: "Please log in"});
           setIsAddingCart(false);
           return setTimeout(() => setNote(undefined), 2000);
         }
   
          const response : Response = await addToCart({id: product.id, qty: String(qty), variant});
         if(response.message === "success"){
             setNote({type: "success", title: "Success", body: "Item added to cart"});
             setCartChanged(true);
             setIsAddingCart(false);
             return setTimeout(() => setNote(undefined), 2000);
         }else{
             setNote({type: "error", title: "Failed", body: "failed to cart item"});
             return setTimeout(() => setNote(undefined), 2000);
         }
       }
       
       const removeFromCart = async () => {
        if(!product) return;
            const response : Response = await removeCartItem({id: product.id});
            if(response.message === "success"){
                setNote({type: "success", title: "Success", body: "Item removed from cart"});
                setCartChanged(true);
                setIsAddingCart(false);
                return setTimeout(() => setNote(undefined), 2000);
            }else{
                setNote({type: "error", title: "Failed", body: "failed to cart item"});
                return setTimeout(() => setNote(undefined), 2000);
            }
       }


      const [ratingBreakdown, setRatingBreakdown] = useState<{
        5: number,
        4: number,
        3: number,
        2: number,
        1: number,
      }>({
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      });
      //443cc9ad-d8e9-4075-8a85-4d4ec2d394e8
    const TotalRating: number = Object.values(ratingBreakdown).reduce((total, rating) => total + rating, 0);

    useEffect(() => {
        if(!product || !product.reviews) return;

        const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

        product.reviews.forEach((review) => {
            if(review.rating){
                if (review.rating >= 4.5) {
                    breakdown[5]++;
                } else if (review.rating >= 4) {
                    breakdown[4]++;
                } else if (review.rating >= 3) {
                    breakdown[3]++;
                } else if (review.rating >= 2) {
                    breakdown[2]++;
                } else {
                    breakdown[1]++;
                }
            }
        });

        setRatingBreakdown(breakdown);
    }, [product])

    const initialReviewLength : number = 4;
    const [reviewLength, setReviewLength] = useState<number>(initialReviewLength);
    
    /////
    ///
    const [inCart, setInCart] = useState<boolean>(false);
    //check if id isin cart
    useEffect(() => {
    if(!cart || !product) return;
    const carted : CartProp | undefined = cart.find((c) => c.id === product.id);
    if(carted){
        setInCart(true);
        setQty(Number(carted.qty));
    }else{
        setInCart(false);
    }

    }, [cart, product]);

    const decreaseQty = async () => {
        if(!id) return;
        if(!inCart){
            setQty((prev) => {
            if (prev > 1) return prev - 1;
            return prev;
            })
        }else{
          const response = await MinusCartItemQty({id: id});
          if(response.message === "success"){
            setCartChanged(true);
          }
        }
    };


  const increaseQty = async () => {
    if(!id) return;
    if(!inCart){
        setQty((prev) => {
            if (product?.stock !== undefined && prev < product.stock) {
                return prev + 1;
            }
            return prev;
        });
    }else{
        const response = await IncreaseCartItemQty({id: id});
        if(response.message === "success"){
        setCartChanged(true);
        }
    }
  };

    ////wishlist
   const [isWishing, setIsWishing] = useState<boolean>(false);
   const wishItem = async () => {
      if(!product) {
        setNote({type: "error", title: "Failed", body: "failed to save item"});
        return setTimeout(() => setNote(undefined), 2000);
      }
      setIsWishing(true);
      if(!user.email || !user.user_id){
        setNote({type: "error", title: "Failed", body: "Please log in"});
        setIsWishing(false);
        return setTimeout(() => setNote(undefined), 2000);
      }

      const response : Response = await addToWishList({id: product.id});
      if(response.message === "success"){
          setNote({type: "success", title: "Success", body: "Item Saved"});
          setWishChanged(true);
          
          return setTimeout(() => {setNote(undefined); setIsWishing(false);}, 2000);
      }else{
          setNote({type: "error", title: "Failed", body: "failed to save item"});
          return setTimeout(() => setNote(undefined), 2000);
      }
   }

   
   const unWishItem = async () => {
    setIsWishing(true);
    if(!product) return;
    const response : Response = await removeWishItem({id: product.id});
    if(response.message === "success"){
        setNote({type: "success", title: "Success", body: "Item removed"});
        setWishChanged(true);
        setIsWishing(false);
        return setTimeout(() => setNote(undefined), 2000);
    }else{
        setNote({type: "error", title: "Failed", body: "failed to remove item"});
        return setTimeout(() => setNote(undefined), 2000);
    }
   }



   /// delivery, etc
   const [deliveryDate, setDeliveryDate] = useState<{delivery?:string;pickup?:string;}>({});

    useEffect(() => {
    if (!product || !product.deliveryTime) return;
    let delivery: string | undefined;
    let pickup: string | undefined;

    if (product.deliveryTime) {
        delivery = new Date(Date.now() + Number(product.deliveryTime) * 24 * 60 * 60 * 1000).toISOString();
    }
    if (product.pickupTime) {
        pickup = new Date(Date.now() + Number(product.pickupTime) * 24 * 60 * 60 * 1000).toISOString();
    }
    setDeliveryDate({ delivery, pickup });
    }, [product]);





  return (
    <div className='desktop_view_product_container'>
        <div className="desktop_view_product_first_section">
            <div className="desktop_view_product_first_section_left">
                <div id='product-gallery' className="desktop_view_product_first_section_left_image_container">
                    {product?.gallery?.length && product.gallery.map((item: { id?: string; url: string }, index: number) => (

                            <a 
                            href={item.url}
                            key={index} 
                            className={`desktop_view_product_first_section_left_image ${ImageShowing === index && "active_image"}`} 
                            data-pswp-width={450}
                            data-pswp-height={450}
                            >
                                <img
                                    onLoad={() => setLoadingImage(false)} 
                                    src={item.url} 
                                alt="" />
                            </a>

                    ))}
                    {loadingImage && <div className='desktop_view_product_first_section_left_image_is_loading'>
                        <ActivityIndicator size='medium' />
                    </div>}
                </div>
                <div className="desktop_view_product_first_section_left_image_gallery_container">
                    {product?.gallery?.length && product.gallery.map((item: { id?: string; url: string }, index: number) => (
                        <div key={index} onClick={() => setImageShowing(index)} className={`desktop_view_product_first_section_left_image_gallery_item_container ${ImageShowing === index && "active_border"}`}>
                              <img src={item.url} className='desktop_view_product_first_section_left_image_gallery_item' />
                        </div>
                    ))}
                </div>
            </div>
            <div className="desktop_view_product_first_section_right">
                <h2 className="desktop_view_product_first_section_right_title">{product?.title}</h2>
                <div className="desktop_view_product_first_section_right_rating_container">
                    <Rating fillColor='var(--accent)' readonly transition size={15} allowFraction initialValue={rating} />
                    <span className='desktop_view_product_first_section_right_rating_number'>({ rating })</span>

                    {!product?.availability && <span className='mobile_view_out_of_stock_text'>out of stock</span>}
                    {product?.availability && <span className='mobile_view_out_of_stock_text'>{product.stock  + "remaining"}</span>}
                </div>
                <div className="desktop_view_product_first_section_right_description_container">
                    {product?.description && product?.description?.length > 200 ? (
                        <span className='desktop_view_product_first_section_right_description'>
                            {product?.description.slice(0, 200)}
                            {showingFullDescription ? <strong onClick={() => setShowingFullDescription(false)}>...less</strong> : <strong onClick={() => setShowingFullDescription(true)}>...more</strong>}
                        </span>
                        
                    ) : (
                    <span className='desktop_view_product_first_section_right_description'>
                        {product?.description}
                    </span>
                    )}
                </div>


                <div className='desktop_view_product_first_section_right_price_save_qty_container'>
                    <div className="desktop_view_product_first_section_right_price_container">
                        <h4 className='desktop_view_product_first_section_right_price'>{product?.price.currency + " " + formatNumberWithCommas(product?.price.current || 0)}</h4>
                        {(product?.price?.prev||0)>0&&<span className='desktop_view_product_first_section_right_old_price'>{product?.price.currency + " " + formatNumberWithCommas(product?.price.prev || 0)}</span>}
                    </div>

                    <div className='desktop_view_product_first_section_right_save_container'>
                    {!isWishing && id && !saved.includes(id) && <FaRegHeart onClick={wishItem} size={25} />}
                    {!isWishing && id && saved.includes(id) && <FaHeart onClick={unWishItem} size={25} color='red' />}
                    {isWishing && <ActivityIndicator size='small' />}
                    </div>

                    <div style={{marginLeft: 20}} className="mobile_view_product_qty_container">
                        <button onClick={decreaseQty} className='mobile_view_product_qty_button'>
                        <FaMinus size={15} />
                        </button>
                        <span className='mobile_view_product_qty'>{qty}</span>
                        <button onClick={increaseQty} className='mobile_view_product_qty_button'>
                        <FaPlus size={15} />
                        </button>
                    </div>
                </div>
                

                {product?.variant && (product?.variant?.size||[])?.length>0 && (
                    <div style={{width: "100%"}}>
                        <div className='desktop_view_product_first_section_right_hr'/> 
                        <div className="desktop_view_product_variant_section_container">
                            {product.variant?.size?.map((size: string, index: number) => (
                                <span 
                                    key={index} 
                                    onClick={() => setVariant((prev) => ({...prev, size: size}))} 
                                    title={size}
                                    className={`desktop_view_product_variant ${variant.size === size && "selected_variant"}`}
                                >
                                    {size.toUpperCase()}
                                </span>
                            ))}
                            </div>
                    </div>
                )}
                {product?.variant && (product?.variant?.color||[])?.length>0 &&  (
                    <div style={{width: "100%"}}>
                        <div className='desktop_view_product_first_section_right_hr'/> 
                        <div className="desktop_view_product_variant_section_container">
                            {product?.variant?.color?.map((color: string, index: number) => (
                                <span 
                                    key={index} 
                                    onClick={() => setVariant((prev) => ({...prev, color: color}))} 
                                    title={color}
                                    className={`desktop_view_product_variant ${variant.color === color && "selected_variant"}`}
                                >
                                    {color.toUpperCase()}
                                </span>
                            ))}
                            </div>
                    </div>
                )}

                <div className='desktop_view_product_first_section_right_hr'/> 

                <div className='desktop_view_product_first_section_right_brand_etc'>
                    <div className="desktop_view_product_first_section_right_brand_etc_left">
                        <span className='desktop_view_product_first_section_right_brand_etc_label'>Brand</span>
                        {product?.category && <span className='desktop_view_product_first_section_right_brand_etc_label'>Category</span>}
                        {product?.vendor_name && <span className='desktop_view_product_first_section_right_brand_etc_label'>Seller</span>}
                        {product?.tags && <span className='desktop_view_product_first_section_right_brand_etc_label'>Tags</span>}
                    </div>
                    <div className="desktop_view_product_first_section_right_brand_etc_right">
                        <span className='desktop_view_product_first_section_right_brand_etc_value'>{product?.brand ? product?.brand : "Generic"}</span>
                        {product?.category && <span className='desktop_view_product_first_section_right_brand_etc_value'>{product.category.name}</span>}
                        {product?.vendor_name && <span className='desktop_view_product_first_section_right_brand_etc_value'>{product.vendor_name}</span>}
                        {product?.tags && <div style={{display: "flex", gap: "5px", alignItems: "center"}} className='desktop_view_product_first_section_right_brand_etc_value'>{product.tags.map((tags: string, index: number) => (<span key={index}>{tags}</span>))}</div>}
                    </div>              
                </div>
                <div className="desktop_view_product_first_section_right_buy_cart_container">
                    {!inCart && <button disabled={cantProceed} onClick={addItemTocart} className="desktop_view_product_first_section_right_cart">
                        {isAddingCart && <div style={{position: 'absolute', top: "0", left: "0", bottom: "0", right: "0", display: "flex", justifyContent: "center", alignItems: "center"}}>
                            <ActivityIndicator size='small' />
                        </div>}
                       {!isAddingCart && "Add to cart"}
                    </button>}

                    {inCart && <button onClick={removeFromCart} className="desktop_view_product_first_section_right_cart">
                        {isAddingCart && <div style={{position: 'absolute', top: "0", left: "0", bottom: "0", right: "0", display: "flex", justifyContent: "center", alignItems: "center"}}>
                            <ActivityIndicator size='small' />
                        </div>}
                       {!isAddingCart && "Remove from cart"}
                    </button>}
                    <button onClick={() => navigate(returnUrl({
                        goto: "/checkout",
                    }), {state: [{id, qty, variant}]})} disabled={cantProceed} className="desktop_view_product_first_section_right_buy">Buy now</button>
                    <button className="desktop_view_product_first_section_right_share" onClick={() => {
                        
                        if (navigator.share) {
                            navigator.share({
                              title: "Check out this product from " + appName,
                              text: product?.title,
                              url: window.location.href,
                            })
                            .then(() => {
                              setNote({ type: "success", title: "Shared" });
                              setTimeout(() => setNote(undefined), 2000);
                            })
                            .catch(() => {
                              setNote({ type: "error", title: "Share Failed" });
                              setTimeout(() => setNote(undefined), 2000);
                            });
                          } else if (navigator.clipboard) {
                            navigator.clipboard.writeText(window.location.href)
                            .then(() => {
                              setNote({ type: "success", title: "Link copied to clipboard" });
                              setTimeout(() => setNote(undefined), 2000);
                            })
                            .catch(() => {
                              setNote({ type: "error", title: "Failed to copy link" });
                              setTimeout(() => setNote(undefined), 2000);
                            });
                          } else {
                            setNote({ type: "error", title: "Failed, Try again later!" });
                            setTimeout(() => setNote(undefined), 2000);
                          }

                    }}><IoMdShareAlt size={20} /></button>
                </div>
            </div>
        </div>

        <div className='desktop_view_product_first_section_right_hr'/> 
          <div className="desktop_view_product_delivery_return_container">
            <div className="desktop_view_product_review_section_header_tab_container">
                <h4 className="desktop_view_product_review_section_header_tab">Delivery & Returns</h4>
            </div>

            <div className="desktop_view_product_delivery_return_cards">
                {product?.canDeliver && product.nationalDelivery && deliveryDate.delivery && <div className="desktop_view_product_delivery_return_card">
                    <div className="desktop_view_product_delivery_return_card_head">
                        <TbTruckDelivery size={20} />
                        <h5>Delivery</h5>
                    </div>
                    <span className='desktop_view_product_delivery_return_card_text'>Estimated Delivery {formatDeliveryDate(deliveryDate.delivery)} when you place order within the next 24hours</span>
                </div>}
                {product?.canPickup && !product.pickupLocation && deliveryDate.pickup && <div className="desktop_view_product_delivery_return_card">
                    <div className="desktop_view_product_delivery_return_card_head">
                        <GiCardPickup size={20} />
                        <h5>Pickup</h5>
                    </div>
                    <span className='desktop_view_product_delivery_return_card_text'>Ready for pickup as at {formatDeliveryDate(deliveryDate.pickup)} if you place your order within the next 24hours</span>
                </div>}
                {product?.return?.active && <div className="desktop_view_product_delivery_return_card">
                    <div className="desktop_view_product_delivery_return_card_head">
                        <TbTruckReturn size={20} />
                        <h5>Return Policy</h5>{/*use product.return.policy for the text */}
                    </div>
                    <span className='desktop_view_product_delivery_return_card_text'>{product?.return?.policy}</span>
                </div>}
            </div>

          </div>


        <div className='desktop_view_product_first_section_right_hr'/> 
          

        {/* Review Tab Here*/}
        <div className="desktop_view_product_review_section_container">
            <div className="desktop_view_product_review_section_header_tab_container">
                <h4 onClick={() => setActiveTab("reviews")} style={{color: activeTab === "reviews" ? "var(--accent)":"var(--color)", cursor: "pointer"}} className="desktop_view_product_review_section_header_tab">Reviews</h4>
                <h4 onClick={() => setActiveTab("discussion")} style={{color: activeTab === "discussion" ? "var(--accent)":"var(--color)", cursor: "pointer"}} className="desktop_view_product_review_section_header_tab">Discussion</h4>
            </div>
            <div className="desktop_view_product_review_section_content_container">
                <div className="desktop_view_product_review_section_content_left_container">
                    {/*conditional  Rendering of the components */}
                    {activeTab === "reviews" && product && product.reviews?.length && (
                        <ReviewComponent data={product.reviews.slice(0, reviewLength)} />
                    )}
                    {activeTab === "reviews" && (product?.reviews || []).length > initialReviewLength && (
                    <div>
                        {reviewLength < (product?.reviews || []).length && <button className='show_all_review_button' onClick={() => setReviewLength(product?.reviews?.length || 0)}>
                            show all
                        </button>}
                        {reviewLength >= (product?.reviews || []).length && <button className='show_all_review_button' onClick={() => setReviewLength(initialReviewLength)}>
                            show less
                        </button>}
                    </div>)}
                    {activeTab === "reviews" && product && !product.reviews && (
                        <div>
                            No Review at this Time
                        </div>
                    )}
                    {activeTab === "discussion" && (
                        <Discussion />
                    )}
                </div>
                <div className='desktop_view_product_review_section_content_right_container'>
                    <div className="desktop_view_product_review_section_content_right_rate_container">
                        <Rating allowFraction readonly initialValue={rating} size={30} fillColor='var(--accent)' />
                        <h4 title='Average Rating' className='desktop_view_product_review_section_content_right_rate'>{rating}</h4>
                    </div>

                    <div className="desktop_view_product_review_section_content_right_rates_breakdown_container">
                        <div className="desktop_view_product_review_section_content_right_rates_progress_container">
                             <h6 style={{color: "var(--text-fade)"}}>5</h6>
                             <progress value={Number(ratingBreakdown[5] / TotalRating)  * 100} max={100} className='desktop_view_product_review_section_content_right_rates_progress'  />
                             <h5 className='desktop_view_product_review_section_content_right_rate'>{ratingBreakdown[5]}</h5>
                        </div>
                        <div className="desktop_view_product_review_section_content_right_rates_progress_container">
                             <h6 style={{color: "var(--text-fade)"}}>4</h6>
                             <progress value={Number(ratingBreakdown[4] / TotalRating)  * 100} max={100} className='desktop_view_product_review_section_content_right_rates_progress'  />
                             <h5 className='desktop_view_product_review_section_content_right_rate'>{ratingBreakdown[4]}</h5>
                        </div>
                        <div className="desktop_view_product_review_section_content_right_rates_progress_container">
                             <h6 style={{color: "var(--text-fade)"}}>3</h6>
                             <progress value={Number(ratingBreakdown[3] / TotalRating)  * 100} max={100} className='desktop_view_product_review_section_content_right_rates_progress'  />
                             <h5 className='desktop_view_product_review_section_content_right_rate'>{ratingBreakdown[3]}</h5>
                        </div>
                        <div className="desktop_view_product_review_section_content_right_rates_progress_container">
                             <h6 style={{color: "var(--text-fade)"}}>2</h6>
                             <progress value={Number(ratingBreakdown[2] / TotalRating)  * 100} max={100} className='desktop_view_product_review_section_content_right_rates_progress'  />
                             <h5 className='desktop_view_product_review_section_content_right_rate'>{ratingBreakdown[2]}</h5>
                        </div>
                        <div className="desktop_view_product_review_section_content_right_rates_progress_container">
                             <h6 style={{color: "var(--text-fade)"}}>1</h6>
                             <progress value={Number(ratingBreakdown[1] / TotalRating)  * 100} max={100} className='desktop_view_product_review_section_content_right_rates_progress'  />
                             <h5 className='desktop_view_product_review_section_content_right_rate'>{ratingBreakdown[1]}</h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className='desktop_view_product_first_section_right_hr'/> 

        <div className='desktop_view_product_full_description'>
            <div className="desktop_view_similar_products_header_left">
                <h3 className='desktop_view_similar_products_header_label'>Full Description Details</h3>
                <IoMdList size={20} />
            </div>

            <p className='desktop_view_product_full_description_text'>{product?.description}</p>
        </div>

        <div className='desktop_view_product_first_section_right_hr'/> 

        {similarCategory && similarCategory.length > 0 && <div className="desktop_view_similar_products_section_container">
            <div className="desktop_view_similar_products_header_container">
                <div className="desktop_view_similar_products_header_left">
                    <h3 className='desktop_view_similar_products_header_label'>Similar product</h3>
                    <MdOutlineProductionQuantityLimits size={20} />
                </div>
                <div className="desktop_view_similar_products_header_right">
                    <button disabled={!canPrevFp} onClick={prevFp} className="desktop_view_similar_products_header_right_button_prev"><FaCaretLeft /></button>
                    <button disabled={!canNextFp} onClick={nextFp} className="desktop_view_similar_products_header_right_button_next"><FaCaretRight /></button>
                </div>
            </div>


            <div className="desktop_view_similar_products_container">
                {similarCategory.slice(startEnd.start, startEnd.end).map((item: Product, index: number) => (
                    <DesktopProductCard key={index} data={item}/>
                ))}
            </div>
        </div>}
    </div>
  )
}

export default ProductDesktop