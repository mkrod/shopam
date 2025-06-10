import { CartProp, Orders, useGlobalProvider, Variant } from '@/constants/provider';
import React, { useEffect, useState } from 'react'
import { TbTruckDelivery } from 'react-icons/tb';
import "./css/checkout.css";
import { IoStorefront } from 'react-icons/io5';
import { FaAngleRight, FaLocationDot, FaStripe } from 'react-icons/fa6';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router';
import { capFirstLetter, formatNumberWithCommas } from '@/constants';
import { intiatePayment, Response } from '@/constants/api';
import OrderCard from '@/components/order_card';

interface Prop {
  data: CartProp[];
}

interface ExtraFee {
  delivery?: number;
  pickup?: number;
  tax?: number;
}
type DeliveryMethod = "delivery"|"pickup";
export type PaymentMethod = "stripe"|"paystack"|"flutter";

const MobileCheckout : React.FC<Prop> = ({ data }) : React.JSX.Element => {


  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("delivery");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("paystack");
      

  const navigate = useNavigate()
  const { user, currency, products, setLoading, setNote, deliveryFees } = useGlobalProvider();
  const [orders, setOrders] = useState<Orders[]>([]);
  const [message, setMessage] = useState<string>("");

  function computeDeliveryFee ():number {
    const userState = user.user_data.address?.state;
    if(!userState) return 0;

    const deliveryConfig = deliveryFees.find((df) => df.state.toLowerCase() === userState.toLowerCase()) || deliveryFees.find((df) => df.state.toLowerCase() === "all other");
    if(!deliveryConfig) return 0;
    if(deliveryConfig.feeForAll){
      const Dfee = deliveryConfig.fee as number;
      return Dfee;
    }

    const customizedFee = deliveryConfig.feeBreakdown?.find((fb) => {
      const min = Number(fb.min);
      const max = Number(fb.max);
      return total >= min && total <= max;
    })?.fee as number || 0;

    return customizedFee;
  }

  function computeTax () :number {
      return 0
  }

  function getSalesPrice(cartItem:CartProp):number{ 
    let price = 0;
    //console.log(cartItem.id)
    const thisCart = data?.find((c) => c.id === cartItem.id);
    const thisProduct = products?.find((p)=>p.id===cartItem.id);
    //console.log(thisCart, thisProduct);
    if(thisCart&&thisProduct){

      const hasVarAmount = Object.values(thisCart.selectedVariant||{}).some((val: Variant) => (val.price !== 0)||(val.price > 0));
      //console.log(hasVarAmount)
      price = ((!hasVarAmount ? thisProduct?.price.current : Object.values(thisCart.selectedVariant||{}).find((val: Variant) => val.price !== 0)?.price) || 0);
      //console.log(price);
    }
    return price;
  }

  useEffect(() => {
    if (!data || !products) return;

    const mapOrder = (item: CartProp): Orders | null => {
      const thisProduct = products.find((p) => p.id === item.id);
      if (!thisProduct) return null;
      return {
        id: item.id,
        title: thisProduct.title,
        images: thisProduct.gallery,
        desc: thisProduct.description,
        price: thisProduct.price,
        salePrice: getSalesPrice(item),
        qty: item.qty ?? 1,
        variant: item.selectedVariant,
        status: "proccessing",
        order_item_id: "",
      };
    };

    const allOrder: Orders[] = data.map(mapOrder).filter((order): order is Orders => order !== null);
    setOrders(allOrder);
  }, [data, products]);


  const [agreedTerm, setAgreedTerm] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [subTotal, setSubTotal] = useState<number>(0);
  const [extraFee, setExtraFee] = useState<ExtraFee>({});
  useEffect(() => {
    if(deliveryMethod === "delivery") return setExtraFee({ delivery: computeDeliveryFee(), tax: computeTax()  });
    if(deliveryMethod === "pickup") return setExtraFee({ pickup: computeDeliveryFee() - 1000, tax: computeTax()  });
    
  }, [total, deliveryMethod]);
  useEffect(() => {
    let sub_total : number = 0;
    orders.forEach((o)=>{
      sub_total += (o.salePrice * ((o.qty) as number));
    })
    setSubTotal(sub_total);
  }, [data, products, orders]);
  useEffect(()=>{
    let total : number = subTotal;
    Object.entries(extraFee).forEach(([_, value]) => {
      total += Number(value);
    })
    setTotal(total);
  },[subTotal, orders, extraFee]);


  const PayNow = async () => {
    if(!agreedTerm) return;
    if(!user.user_data.address || !user.user_data.contact || !user.user_data.name){
      setNote({type: "error", title: "Error", body: "Please add contact info and re-try again"});
      return setTimeout(()=>setNote(undefined), 3000);
    }
    if((extraFee.delivery||0) < 1){
      setNote({type: "error", title: "Error", body: "Product not deliverable to your state"});
      return setTimeout(()=>setNote(undefined), 3000);
    }

    setLoading(true);

    const payload = {
      orders,
      total,
      contact: user.user_data,
      deliveryMethod,
      extraFee,
      paymentMethod,
      message
    }

    try {
      const res = await intiatePayment(paymentMethod, payload) as Response;
      console.log(res);
      if(res.message !== "success"){
        setNote({type: "error", title: "Error", body: res.message});
        setLoading(false)
        return setTimeout(()=> setNote(undefined), 2000);
      }
      const url = res.data.url;
      return window.open(url || "about:blank", "_self");
      
    } catch (err) {
      console.error(err);
      setNote({ type: "error", title: "Error", body: "Payment failed, try again." });
      return setTimeout(()=> setNote(undefined), 2000);
    }    

  }

  const [showingLength, setShowingLength] = useState<number>(1);
  const showHideAllOrder = () => {
    setShowingLength((prev) => prev === 1 ? orders.length : 1);
  }



  return (
    <div className='mobile_chceckout_container'>
      <div className="mobile_chceckout_shipping_details_container">
        <div className="mobile_chceckout_shipping_details_left">
          <FaLocationDot />
        </div>
        <div className="mobile_chceckout_shipping_details_center">
          <h4>Shipping Address</h4>
          <p className='mobile_chceckout_shipping_text'>{Object.values(user.user_data?.address||{}).join(", ") || "Not Set"}</p>
          <div className="mobile_checkout_shipping_name_phone">
            <p className='mobile_chceckout_shipping_text'>{(capFirstLetter(user.user_data.name?.first||"")+ " " +  capFirstLetter(user.user_data.name?.last||"") || "Not Set")}</p>
            <p className='mobile_chceckout_shipping_text_fade'>{user.user_data.contact || "Not Set"}</p>
          </div>
          <p className='mobile_chceckout_shipping_text'>{capFirstLetter(user.email) || "Not Set"}</p>
        </div>
        <div onClick={() => navigate("/profile")} className="mobile_chceckout_shipping_details_edit_container">
          <FaAngleRight color='var(--text-fade)' />
        </div>
      </div>

      {orders.length > 0 && <div className='mobile_checkout_product_preview_section'>
        <div className='mobile_checkout_product_preview_header'>
          <h5>orders</h5>
          {orders.length > 1 && <h5 className='mobile_checkout_product_preview_show_hide' onClick={showHideAllOrder}>
          {showingLength === 1 ? "Show all" : "Show less"}
        </h5>}
        </div>
        <div className="mobile_checkout_product_preview">
          {orders.slice(0, showingLength).map((order: Orders, index: number) => (
            <OrderCard key={index} data={order} otherStyles={{borderTopColor: index === 0 ? "var(--background-fade)" : "transparent", borderBottomColor: "var(--background-fade)"}} />
          ))}
        </div>
      </div>}

      <div style={{marginTop: "20px"}} className="mobile_checkout_shipping_method_section">
        <h5>Delivery method</h5>
          <div className='desktop_checkout_delivery_container'>
            <div onClick={() =>  setDeliveryMethod("pickup")} className={`desktop_checkout_delivery_method ${deliveryMethod ===  "pickup" && "selected_method"}`}>
              <IoStorefront />
              <h5>Pick up</h5>
            </div>

            <div onClick={() => setDeliveryMethod("delivery")} className={`desktop_checkout_delivery_method ${deliveryMethod ===  "delivery" && "selected_method"}`}>
              <TbTruckDelivery />
              <h5>Delivery</h5>
            </div>
          </div>
      </div>
      {deliveryMethod  === "delivery" &&  (
        <div className="desktop_checkout_delivery_address_container">
          <span className='desktop_checkout_detail_section_info_title'>Delivery address</span>
          <h5>{ Object.values(user.user_data?.address||{}).join(", ")  || "Not set" }</h5>
        </div>
      )}
      {deliveryMethod  === "pickup" &&  (
        <div className="desktop_checkout_delivery_address_container">
          <span className='desktop_checkout_detail_section_info_title'>Pickup store address</span>
          <h5>Not Available for pickup</h5>
        </div>
      )}

      <div className='d_c_o_hr' />


      <div className="desktop_checkout_note_container">
        <h5>Note:</h5>
        <input onChange={(e) => setMessage(e.target.value)} value={message} placeholder='Leave a message' className='desktop_checkout_note_input' />
      </div>

      <div className='d_c_o_hr' />

      <div className="desktop_checkout_payment_method_header">
        <h5>3. Payment method</h5>
      </div>

      <div className="desktop_checkout_delivery_container">
        <div onClick={() => setPaymentMethod("paystack")} className={`desktop_checkout_delivery_method ${paymentMethod ===  "paystack" && "selected_method"}`}>
          <img width={25} src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsWKza4IaoogsTAPXl8mjQ1JPg0ii8Jmp_6Q&s' />
          <h5>Paystack</h5>
        </div>
        <div onClick={() => setPaymentMethod("stripe")} className={`desktop_checkout_delivery_method ${paymentMethod ===  "stripe" && "selected_method"}`}>
          <FaStripe size={20} />
          <h5>Stripe</h5>
        </div>
        <div onClick={() => setPaymentMethod("flutter")} className={`desktop_checkout_delivery_method ${paymentMethod ===  "flutter" && "selected_method"}`}>
          <FcGoogle size={15} />
          <h5>Pay</h5>
        </div>
      </div>

      <div className='d_c_o_hr' />

      <div className="desktop_checkout_order_d_em">
        <h5 className='mobile_checkout_order_d_em_label'>SUBTOTAL</h5>
        <h5 className='mobile_checkout_order_d_em_value'>{currency.symbol+" "+formatNumberWithCommas(Number((subTotal).toFixed(2)))}</h5>
      </div>
      {Object.entries(extraFee).map(([key, value], index: number) => (
        <div key={index} className="desktop_checkout_order_d_em">
          <h5 className='mobile_checkout_order_d_em_label'>{key.toUpperCase()}</h5>
          <h5 className='mobile_heckout_order_d_em_value'>{currency.symbol+" "+formatNumberWithCommas(Number((value).toFixed(2)))}</h5>
        </div>
      ))}

      <div className='d_c_o_hr' />

      <div className="desktop_checkout_order_total_container">
        <h3>TOTAL</h3>
        <h2>{currency.symbol+ " " +formatNumberWithCommas(Number((total).toFixed(2)))}</h2>
      </div>

      <div className="desktop_checkout_order_pay_button_container">
        <button disabled={!agreedTerm} onClick={PayNow} className="desktop_checkout_order_pay_button">Pay now</button>
      </div>

      <div className="desktop_checkout_order_agree_container">
        <input checked={agreedTerm} onChange={() => setAgreedTerm(!agreedTerm)} type="checkbox" className="desktop_checkout_agree_checkbox" />
        <h6 className=''>
          By confirming the order, I accept the <a href='/terms_of_use'>terms of user agreement.</a>
        </h6>
      </div>



    </div>
  )
}

export default MobileCheckout