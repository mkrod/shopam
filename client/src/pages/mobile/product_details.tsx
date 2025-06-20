import ActivityIndicator from '@/components/activity_indicator'
import MobileProductCard from '@/components/mobile_product_card';
import ReviewCard from '@/components/review_card';
import { formatDeliveryDate, formatNumberWithCommas, returnUrl } from '@/constants';
import { addToCart, addToWishList, IncreaseCartItemQty, MinusCartItemQty, removeCartItem, removeWishItem, Response } from '@/constants/api';
import useHorizontalInfiniteScroll from '@/constants/infinite_hor_scroll';
import { CartProp, Product, useGlobalProvider } from '@/constants/provider';
import equal from 'fast-deep-equal';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import React, { useEffect, useState } from 'react'
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { FaAngleDown, FaAngleUp, FaHeart, FaMinus, FaPlus, FaRegHeart } from 'react-icons/fa6';
import { GiCardPickup } from 'react-icons/gi';
import { RiShoppingBagLine } from 'react-icons/ri';
import { TbShoppingCartX, TbTruckDelivery, TbTruckReturn } from 'react-icons/tb';
import { useNavigate } from 'react-router';
import { Rating } from 'react-simple-star-rating';
import stringSimilarity from "string-similarity";

export type VT = {
  name: string; //the variant group e.g size, color
  value: string;
  price: number;
}
const ProductMobile : React.FC<{id: string | undefined}> = ({ id }) : React.JSX.Element => {


  const { products, setNote, setCartChanged, cart, user, saved ,setWishChanged } = useGlobalProvider();
  const [product, setProduct] = useState<Product | undefined>();
  const [rating, setRating] = useState<number | undefined>(0);
  const [ImageShowing, setImageShowing] = useState(0);
  const [loadingImage, setLoadingImage] = useState<boolean>(true);
  const navigate = useNavigate();

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
    //const [showingFullDescription, setShowingFullDescription] = useState<boolean>(false);

    
    const [similarCategory, setSimilarCategory] = useState<Product[] | undefined>()

    
    const { containerRef, addingMore, maxLength } = useHorizontalInfiniteScroll({ data: similarCategory || [], perPage: 10 });
    useEffect(() => {
      if(!product || !products) return;
      const category = product.category;
      const same = products.filter((prod: Product) => prod.category === category || stringSimilarity.compareTwoStrings(prod.sku, product.sku) >= 0.6);
      setSimilarCategory(same);
    }, [products, product]);

    const { containerRef: ReviewRef, addingMore: addingMoreReview, maxLength: MaxReview } = useHorizontalInfiniteScroll({perPage: 5, data: product?.reviews || []})







             



 


   /* useEffect(() => {
      if (!product || !product.variant) return;
      const sizes = Array.isArray(product.variant.size) ? product.variant.size : [];
      const colors = Array.isArray(product.variant.color) ? product.variant.color : [];
      const cantproceed: boolean = ((sizes.length > 0 && variant.size === "") || (colors.length > 0 && variant.color === "") || !product.availability);
      setCantProceed(cantproceed);
    }, [product, variant]); */


 

          const [ratingBreakdown, setRatingBreakdown] = useState<{
            5: number,
            4: number,
            3: number,
            2: number,
            1: number,
          }>({
            5: 10,
            4: 2,
            3: 5,
            2: 22,
            1: 3,
          });
    
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


      const [showingFullDescription, setShowingFullDescription] = useState<boolean>(false);


      const [cantProceed, setCantProceed] = useState<boolean>(true);
      /// updated variant logic

      const [productVariant, setProductVariant] = useState<Record<string, VT[]>>({});
      const [isVariant, setIsVariant] = useState<boolean>(false);
      const [selectedVariant, setSelectedVariant] = useState<VT[]>([]);
      //group the variants by variant name i.e size, e.t.c
      useEffect(()  =>{
        if(!product || !product.variant) return;
        const groupped : Record<string, VT[]> = product.variant.reduce((acc: Record<string, VT[]>, curr) => {
          if(!acc[curr.name]) {
              acc[curr.name] = [{
              name:  curr.name,
              value: curr.value,
              price: curr.price  || 0,
            }];
          }else{
              acc[curr.name].push({
              name:  curr.name,
              value: curr.value,
              price: curr.price  || 0,
            });
          }
          return acc;
        }, {});

        setProductVariant(groupped);
      }, [product, products]);

      useEffect(() => {
        const isPriceyVariant= Object.entries(selectedVariant).some(([_, value]) => {
          const variantValue = value as VT;
          return variantValue.price !== 0;
        });

        setIsVariant(isPriceyVariant); //this useEffect check if a variant with different in price have been selected.
      }, [selectedVariant]);

      useEffect(() => {
        if(selectedVariant.length < Object.keys(productVariant).length) return setCantProceed(true);
        return setCantProceed(false)
        
      }, [selectedVariant, product, productVariant]);

      //console.log(cantProceed)
          //const [variant, setVariant] = useState<{size: string, color: string}>({size: "", color: ""});
    const [qty, setQty] = useState<number>(1)
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
   
          const response : Response = await addToCart({id: product.id, qty: String(qty), variant:selectedVariant});
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
            
  return (
    <div className='mobile_view_product_container'>

      {/* if header is needed */}

      <div id='product-gallery' className="mobile_view_product_images_section_container">
        {product?.gallery && product.gallery.length >  0 && product.gallery.map((item: {id?: string, url:  string}, index: number) =>  (
          <a 
            href={item.url}
            key={index} 
            className={`mobile_view_product_image ${ImageShowing === index && "active_image"}`} 
            data-pswp-width={450}
            data-pswp-height={450}
          >
            <img onLoad={() => setLoadingImage(false)} src={item.url} className='mobile_view_product_image_img' />
          </a>
        ))}
        {loadingImage && <div className='mobile_view_product_image_is_loading'>
          <ActivityIndicator size='small' />
        </div>}
       {product?.gallery && product.gallery.length > 0 && <div className="mobile_view_product_images_gallery_container">
          {product.gallery.map((item: {id?: string, url: string} , index: number) => (
              <div key={index} onClick={() =>  setImageShowing(index)} className={`mobile_view_product_image_gallery_container ${ImageShowing === index && "is_viewing_mobile_view_product_image_gallery"}`}>
                <img src={item.url} className='mobile_view_product_image_gallery' />
              </div>
          ))}
        </div>}
      </div>


      <div className="mobile_view_product_title_like_section_container">
        {product && product.title  &&  <h3 className='mobile_view_product_title'>{product.title}</h3>}
        <div className="mobile_view_product_title_like_container">
          {!isWishing && id && !saved.includes(id) && <FaRegHeart onClick={wishItem} size={25} />}
          {!isWishing && id && saved.includes(id) && <FaHeart onClick={unWishItem} size={25} color='red' />}
          {isWishing && <ActivityIndicator size='small' />}
        </div>
      </div>


      <div className="mobile_view_rating_container">
        <Rating fillColor='var(--accent)' readonly transition size={15} allowFraction initialValue={rating} />
        <span style={{fontSize: "var(--normal-font)", fontWeight: "700"}}>({rating})</span>
        {!product?.availability && <span className='mobile_view_out_of_stock_text'>out of stock</span>}
        {product?.availability && <span className='mobile_view_out_of_stock_text'>{product.stock  + "remaining"}</span>}
      </div>


      <div className="mobile_view_product_price_discount_section_container">
        <div className="mobile_view_product_price_discount_container">
          {!isVariant && product?.price && <h2>{product.price.currency + " " + formatNumberWithCommas(product.price.current)}</h2>}
          {isVariant && <h2>{product?.price.currency + " " + formatNumberWithCommas((selectedVariant.find((sv) => sv.price > 0)?.price || product?.price?.current || 0))}</h2>}
          {product?.discount && <span className='mobile_view_product_price_discount'>{product.discount.percentage + "%"}</span>}
        </div>
        {product && (product?.price?.prev||0)>0 && <p className='mobile_view_product_price_old'>{product?.price.currency + " " + formatNumberWithCommas(product.price.prev)}</p>}
      </div>

      <div className="mobile_view_product_size_variant_qty_container">

        
        <div className="mobile_view_product_qty_container">
          <button onClick={decreaseQty} className='mobile_view_product_qty_button'>
            <FaMinus size={15} />
          </button>
          <span className='mobile_view_product_qty'>{qty}</span>
          <button onClick={increaseQty} className='mobile_view_product_qty_button'>
            <FaPlus size={15} />
          </button>
        </div>
      </div>


      {Object.entries(productVariant).length > 0 && Object.entries(productVariant).map(([key, value]:[string, VT[]], index) => {
      
        return (
          <div key={index} className='mobile_view_product_sizes_variant_container'>
            <h4 style={{color: "var(--color)"}}>Select {key}</h4>
            <div className="mobile_view_product_size_variant_container">
              {value.map((val: VT, idx: number) => (
                <span 
                key={idx} 
                onClick={() => {
                  const alreadySelected = selectedVariant.some((sv) => equal(val, sv));
                
                  if (alreadySelected) {
                    // Remove if already selected
                    const newOne = selectedVariant.filter((sv) => !equal(sv, val));
                    return setSelectedVariant(newOne);
                  }
                
                  const hasSameName = selectedVariant.some((sv) => sv.name === val.name);
                
                  if (hasSameName) {
                    // Replace variant of same name
                    const newOne = selectedVariant.map((sv) =>
                      sv.name === val.name ? val : sv
                    );
                    return setSelectedVariant(newOne);
                  }
                
                  // Add new variant
                  setSelectedVariant([...selectedVariant, val]);
                }}
                
                className={`mobile_view_product_size ${selectedVariant.some((sv)=> sv.value === val.value ) && "selected_variant"}`}
                >
                  {val.value.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        )})}

        
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


        {similarCategory && (
        <div className="mobile_view_similar_product_section_container">
          <h3>Similar Product</h3>
          <div ref={containerRef} className="mobile_view_similar_product_container">
            {similarCategory.slice(0, maxLength).map((item: Product, index: number) => (
              <MobileProductCard extraStyle={{minWidth: "50%", maxWidth: "50%"}} key={index} data={item} />
            ))}
            {addingMore && <div style={{alignSelf:"center"}}><ActivityIndicator size='small' /></div>}
          </div>
        </div>)}


        {(product?.reviews || []).length > 0 && (
           <div className="mobile_view_product_review_section_container">
            <h3>Reviews</h3>
            <div ref={ReviewRef} className="mobile_view_product_review_container">
              {product?.reviews?.slice(0, MaxReview).map((item: NonNullable<Product['reviews']>[number], index: number) => (
                <ReviewCard key={index} data={item} />
              ))}
              {addingMoreReview && <div style={{alignSelf:"center"}}><ActivityIndicator size='small' /></div>}
            </div>


            <div style={{width:"100%", marginTop: 20}} className='desktop_view_product_review_section_content_right_container'>
                  <div className="desktop_view_product_review_section_content_right_rate_container">
                      <Rating allowFraction readonly initialValue={rating} size={30} fillColor='var(--accent)' />
                      <h4 title='Average Rating' className='desktop_view_product_review_section_content_right_rate'>{rating}</h4>
                  </div>

                  <div className="desktop_view_product_review_section_content_right_rates_breakdown_container">
                      <div className="desktop_view_product_review_section_content_right_rates_progress_container">
                            <h6 style={{color: "var(--text-fade)"}}>5</h6>
                            <progress value={(ratingBreakdown[5] / TotalRating)  * 100} max={100} className='desktop_view_product_review_section_content_right_rates_progress'  />
                            <h5 className='desktop_view_product_review_section_content_right_rate'>{ratingBreakdown[5]}</h5>
                      </div>
                      <div className="desktop_view_product_review_section_content_right_rates_progress_container">
                            <h6 style={{color: "var(--text-fade)"}}>4</h6>
                            <progress value={(ratingBreakdown[4] / TotalRating)  * 100} max={100} className='desktop_view_product_review_section_content_right_rates_progress'  />
                            <h5 className='desktop_view_product_review_section_content_right_rate'>{ratingBreakdown[4]}</h5>
                      </div>
                      <div className="desktop_view_product_review_section_content_right_rates_progress_container">
                            <h6 style={{color: "var(--text-fade)"}}>3</h6>
                            <progress value={(ratingBreakdown[3] / TotalRating)  * 100} max={100} className='desktop_view_product_review_section_content_right_rates_progress'  />
                            <h5 className='desktop_view_product_review_section_content_right_rate'>{ratingBreakdown[3]}</h5>
                      </div>
                      <div className="desktop_view_product_review_section_content_right_rates_progress_container">
                            <h6 style={{color: "var(--text-fade)"}}>2</h6>
                            <progress value={(ratingBreakdown[2] / TotalRating)  * 100} max={100} className='desktop_view_product_review_section_content_right_rates_progress'  />
                            <h5 className='desktop_view_product_review_section_content_right_rate'>{ratingBreakdown[2]}</h5>
                      </div>
                      <div className="desktop_view_product_review_section_content_right_rates_progress_container">
                            <h6 style={{color: "var(--text-fade)"}}>1</h6>
                            <progress value={(ratingBreakdown[1] / TotalRating)  * 100} max={100} className='desktop_view_product_review_section_content_right_rates_progress'  />
                            <h5 className='desktop_view_product_review_section_content_right_rate'>{ratingBreakdown[1]}</h5>
                      </div>
                  </div>
              </div>
           </div>
        )}


        <div className="mobile_view_product_delivery_return_container">


          {product?.canDeliver && product.nationalDelivery && deliveryDate.delivery && <div className="mobile_view_product_delivery_return_card">
            <div className="mobile_view_product_delivery_return_card_icon">
              <TbTruckDelivery size={20} />
            </div>
            <div className='mobile_view_product_delivery_return_content'>
              <h4>Delivery</h4>
              <p>Estimated Delivery <b>{formatDeliveryDate(deliveryDate.delivery)}</b> when you place order within the next 24hours</p>
            </div>
          </div>}

          {product?.canPickup && !product.pickupLocation && deliveryDate.pickup && <div className="mobile_view_product_delivery_return_card">
            <div className="mobile_view_product_delivery_return_card_icon">
              <GiCardPickup size={20} />
            </div>
            <div className='mobile_view_product_delivery_return_content'>
              <h4>Pickup</h4>
              <p>Ready for pickup as at <b>{formatDeliveryDate(deliveryDate.pickup)}</b> if you place your order within the next 24hours</p>
            </div>
          </div>}

          {product?.return?.active && <div className="mobile_view_product_delivery_return_card">
            <div className="mobile_view_product_delivery_return_card_icon">
              <TbTruckReturn size={20} />
            </div>
            <div className='mobile_view_product_delivery_return_content'>
              <h4>Return Policy</h4>
              <p>{product?.return?.policy}</p>
            </div>
          </div>}


        </div>


        {product?.description && (
          <div className="mobile_view_product_description_section_container">
            <div className="mobile_view_product_description_section_header">
              <h4>Description</h4>
              <div onClick={()=>  setShowingFullDescription(!showingFullDescription)} className='mobile_view_product_description_section_header_expand'>
                {!showingFullDescription && <h5>Expand</h5>}
                {showingFullDescription && <h5>Collapse</h5>}
                {showingFullDescription && <FaAngleUp />}
                {!showingFullDescription && <FaAngleDown />}
              </div>
            </div>


            <div className="mobile_view_product_description_container">
              <p className='mobile_view_product_description'>
                {product.description.length > 500 ? showingFullDescription  ? product.description :  product.description.slice(0, 500) + " ...":  product.description}
              </p>
            </div>
          </div>
        )}




        <div className={`mobile_view_product_add_cart_buy_section_container`}>
          {!inCart && <button onClick={addItemTocart} disabled={cantProceed} className='mobile_view_product_add_cart_button'>
            {isAddingCart && <div style={{position: 'absolute', top: "0", left: "0", bottom: "0", right: "0", display: "flex", justifyContent: "center", alignItems: "center"}}>
                <ActivityIndicator size='small' />
            </div>}
            {!isAddingCart && (<span style={{display: "flex", alignItems:  "center", justifyContent: "center", gap: "10px"}}><AiOutlineShoppingCart /> Add to cart</span>)}
          </button>}
          {inCart && <button onClick={removeFromCart} disabled={cantProceed} className='mobile_view_product_add_cart_button'>
            {isAddingCart && <div style={{position: 'absolute', top: "0", left: "0", bottom: "0", right: "0", display: "flex", justifyContent: "center", alignItems: "center"}}>
                <ActivityIndicator size='small' />
            </div>}
            {!isAddingCart && (<h5 style={{display: "flex", alignItems:  "center", justifyContent: "center", gap: "10px"}}><TbShoppingCartX /> Remove from cart</h5>)}
          </button>}
          <button
           onClick={() => navigate(returnUrl({
                goto: "/checkout",
            }), {state: [{id, qty, selectedVariant}]})}
          disabled={cantProceed} className='mobile_view_product_buy_button'>
             <RiShoppingBagLine />
             Buy Now
          </button>
        </div>
    </div>
  )
}

export default ProductMobile