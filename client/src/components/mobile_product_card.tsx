import { CartProp, Product, useGlobalProvider } from '@/constants/provider'
import React, { CSSProperties, useEffect, useState } from 'react'
import "./css/mobile_product_card.css";
import ActivityIndicator from './activity_indicator';
import { FaLocationDot, FaMinus, FaPlus } from 'react-icons/fa6';
import { useNavigate } from 'react-router';
import { returnUrl, formatNumberWithCommas } from '@/constants';
import { addToCart, IncreaseCartItemQty, MinusCartItemQty, removeCartItem, Response } from '@/constants/api';
import { AiOutlineShoppingCart } from 'react-icons/ai';

const MobileProductCard : React.FC<{data: Product, extraStyle?: CSSProperties}> = ({ data, extraStyle }) : React.JSX.Element => {
  const [isLoadingPic, setIsLoadingPic] = useState<boolean>(true);
  const navigate = useNavigate();
  const title : string = data.title.length > 35 ? data.title.slice(0, 35) + "..." : data.title;
  const difference = data.price.prev ? (data.price.prev - data.price.current): null;
  let discount : number | undefined; 
  if(difference){
    discount = difference < 0 ? undefined : Math.round((difference / data.price.prev) * 100);
  }

  /////
  const { setNote, setCartChanged, cart, user } = useGlobalProvider()
      //const [variant, setVariant] = useState<{size: string, color: string}>({size: "", color: ""});
      const [qty, setQty] = useState<number>(1);
  
      const [isAddingCart, setIsAddingCart] = useState<boolean>();
  
      const addItemTocart = async () => {
        if(!data) {
            setNote({type: "error", title: "Failed", body: "failed to cart item"});
            return setTimeout(() => setNote(undefined), 2000);
        }
        setIsAddingCart(true);
        if(!user.email || !user.user_id){
          setNote({type: "error", title: "Failed", body: "Please log in"});
          setIsAddingCart(false);
          return setTimeout(() => setNote(undefined), 2000);
        }
  
        const response : Response = await addToCart({id: data.id});
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
  
   
      const [cantProceed, setCantProceed] = useState<boolean>();
  
      useEffect(() => {
        if (!data || !data.variant) return;
        //const sizes = Array.isArray(data.variant.size) ? data.variant.size : [];
        //const colors = Array.isArray(data.variant.color) ? data.variant.color : [];
        const cantproceed: boolean = !data.availability;
        setCantProceed(cantproceed);
      }, [data]);
  
      const [inCart, setInCart] = useState<boolean>(false);
      //check if id isin cart
      useEffect(() => {
        if(!cart) return;
        const carted : CartProp | undefined = cart.find((c) => c.id === data.id);
        if(carted){
          setInCart(true);
          setQty(Number(carted.qty));
        }else{
          setInCart(false);
        }
        
      }, [cart]);
      //logic to increase decresase cart
      const decreaseQty = async () => {
        //send request to server to update the qty value -1 
        // and if request is sent when qty is 1 
        // divert the request to remove cart
        if(qty <= 1){
          const response : Response = await removeCartItem({id: data.id});
          if(response.message === "success"){
              setNote({type: "success", title: "Success", body: "Item removed from cart"});
              setCartChanged(true);
              setIsAddingCart(false);
              return setTimeout(() => setNote(undefined), 2000);
          }else{
              setNote({type: "error", title: "Failed", body: "failed to cart item"});
              return setTimeout(() => setNote(undefined), 2000);
          }

        }else{
          const response = await MinusCartItemQty({id: data.id});
          if(response.message === "success"){
            setCartChanged(true);
          }
        }
      }
      const increaseQty = async () => {
        //send request to server to update the qty value +1 
        // as far as it is <= stock amount
        


        if(data.stock && (qty <= data.stock)){
          const response = await IncreaseCartItemQty({id: data.id});
          if(response.message === "success"){
            setCartChanged(true);
          }
        }
      };
      








  return (
    <div 
    tabIndex={0}
    style={extraStyle}
    className='mobile_product_card_container'>
      <div onClick={() => navigate(returnUrl({goto: "/product", params: {id: data.id}}))} className="mobile_product_card_image_container">
        {data.gallery && data.gallery.length > 0 && (
          <img onLoad={() => setIsLoadingPic(false)} className='mobile_product_card_image' src={data.gallery[0].url} alt={`${data.sku || ""} picture`} />
        )}
        {isLoadingPic && (
        <div className="mobile_product_card_is_loading">
          <ActivityIndicator size='small' />
        </div>)}
      </div>
      <div onClick={() => navigate(returnUrl({goto: "/product", params: {id: data.id}}))} className="mobile_product_card_metadata_container">
        <div className="mobile_product_card_metadata_title_container">
          <span className="mobile_product_card_metadata_title">{title}</span> {/* slice 35 */}
        </div>
        <div className="mobile_product_card_metadata_price_container">
          <span className='mobile_product_card_metadata_price'>{data.price.currency + " " + formatNumberWithCommas(data.price.current)}</span>
          {data.price.prev && <span className='mobile_product_card_metadata_old_price'>{data.price.currency + " " + formatNumberWithCommas(data.price.prev)}</span>}
        </div>
        <div className="mobile_product_card_metadata_rating_container"></div>
        {data.location && <div className="mobile_product_card_metadata_location">
          <FaLocationDot color='var(--accent)' />
          <span className="mobile_product_card_metadata_location_text">{data.location}</span>
        </div>}
      </div>

      <div className="mobile_product_card_add_to_cart_adjust_container">
          {!inCart && (
            <div className='mobile_product_card_add_to_cart_container'>
              <button disabled={cantProceed} className='mobile_product_card_add_to_cart' onClick={addItemTocart}>
              {isAddingCart && <div style={{position: 'absolute', top: "0", left: "0", bottom: "0", right: "0", display: "flex", justifyContent: "center", alignItems: "center"}}>
                <ActivityIndicator size='small' />
                </div>}
              {!isAddingCart && (<span style={{display: "flex", alignItems:  "center", justifyContent: "center", gap: "10px"}}><AiOutlineShoppingCart /> Add to cart</span>)}
              </button>
            </div>
          )}
          {inCart && (
            <div className="mobile_product_card_adjust_qty_container">
              <button onClick={decreaseQty} className='mobile_view_product_qty_button'>
                <FaMinus size={10} />
              </button>
              <span className='mobile_view_product_qty'>{qty}</span>
              <button disabled={qty >= data.stock} onClick={increaseQty} className='mobile_view_product_qty_button'>
                <FaPlus size={10} />
              </button> 
            </div>
          )}
        </div>

      {(discount || data.discount?.percentage) && <div className='mobile_product_card_discount_container'>
        - {discount || data.discount?.percentage}%
      </div>}
    </div>
  )
}

export default MobileProductCard