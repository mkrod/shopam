import { CartProp, Orders, useGlobalProvider } from '@/constants/provider';
import React, { useEffect, useState } from 'react'
import { TbEdit, TbTruckDelivery } from 'react-icons/tb';
import "./css/checkout.css";
import { IoStorefront } from 'react-icons/io5';
import { FaChevronLeft, FaChevronRight, FaStripe } from 'react-icons/fa6';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router';
import { formatNumberWithCommas } from '@/constants';
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

const DesktopCheckout : React.FC<Prop> = ({ data }) : React.JSX.Element => {


  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("delivery");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("paystack");
      

  const navigate = useNavigate()
  const { user, currency, products, setLoading, setNote } = useGlobalProvider();
  const [orders, setOrders] = useState<Orders[]>([]);
  const [message, setMessage] = useState<string>("");

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
        qty: item.qty ?? 1,
        variant: item.variant
          ? {
              size: typeof item.variant.size === 'string' ? item.variant.size : undefined,
              color: typeof item.variant.color === 'string' ? item.variant.color : undefined,
            }
          : undefined,
          status:"",
          order_item_id: "",
      };
    };

    const allOrder: Orders[] = data.map(mapOrder).filter((order): order is Orders => order !== null);
    setOrders(allOrder);
  }, [data, products]);

  const [singlePreviewImage, setSinglePreviewImage] = useState<number>(0);
  const prevSinglePreviewImage = () => {
    setSinglePreviewImage((prev) => (prev > 0 ? prev - 1 : prev));
  };
  const nextSinglePreviewImage = () => {
    
     setSinglePreviewImage((prev) => {
        const imagesLength = orders[0]?.images?.length || 0;
        return prev < imagesLength - 1 ? prev + 1 : prev;
      })
  };

  const [agreedTerm, setAgreedTerm] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [subTotal, setSubTotal] = useState<number>(0);
  const [extraFee, setExtraFee] = useState<ExtraFee>({});
  useEffect(() => {
    setExtraFee({
      delivery:
        total <= 10
          ? 2
          : total <= 50
          ? 3
          : total <= 100
          ? 5
          : total <= 1000
          ? 10
          : total <= 3000
          ? 30
          : 50,
    });
  }, [total]);
  useEffect(() => {
    let sub_total : number = 0;
    orders.forEach((o)=>{
      sub_total += (o.price.current * ((o.qty) as number));
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
    <div className='desktop_checkout_container'>
      <div className="desktop_checkout_details_container">
        <h2 className='desktop_checkout_header_text'>Checkout</h2>

        <div className="desktop_checkout_detail_section">
          <div className="desktop_checkout_detail_section_header">
            <h4>1. Contact Information</h4>
            
            <div onClick={()=> navigate("/profile")} className='desktop_checkout_detail_section_header_right'>
              <TbEdit />
              <span>Edit info</span>
            </div>
          </div>

          <div className='desktop_checkout_detail_section_infos_container'>
            <div className="desktop_checkout_detail_section_info_container">
              <span className='desktop_checkout_detail_section_info_title'>First Name</span>
              <h5>{ user.user_data.name?.first || "Not set"}</h5>
            </div>
            <div className="desktop_checkout_detail_section_info_container">
            <span className='desktop_checkout_detail_section_info_title'>Last Name</span>
              <h5>{ user.user_data.name?.last || "Not set"}</h5>
            </div>
            <div className="desktop_checkout_detail_section_info_container">
            <span className='desktop_checkout_detail_section_info_title'>Email</span>
              <h5>{ user.email  || "Not Set" }</h5>
            </div>
            <div className="desktop_checkout_detail_section_info_container">
            <span className='desktop_checkout_detail_section_info_title'>Mobile No</span>
              <h5>{ user.user_data.contact || "Not Set" }</h5>
            </div>
          </div>


          <div className="desktop_checkout_detail_section_header">
            <h4>2. Delivery Method</h4>
          </div>

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
          {deliveryMethod  === "delivery" &&  (
            <div className="desktop_checkout_delivery_address_container">
              <span className='desktop_checkout_detail_section_info_title'>Delivery address</span>
              <h5>{ user.user_data.address || "Not set" }</h5>
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



          <div className="desktop_checkout_payment_method_header">
            <h4>3. Payment method</h4>
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
        </div>




      </div>

      <div className="desktop_checkout_order_container">
        <div className="desktop_checkout_order">
          <h3>Order</h3>
          {orders.length === 1 && orders.map((item: Orders, index: number) => (
            <div key={index} className="desktop_checkout_order_single_preview_container">
              <div className="desktop_checkout_order_single_preview_images_container">
                {item.images && item.images.map((img: NonNullable<Orders['images']>[number], index: number) => (
                  <div key={index} className={`desktop_checkout_order_single_preview_image_container ${singlePreviewImage === index && "desktop_checkout_order_single_preview_image_active"}`}>
                    <img src={img.url} className='desktop_checkout_order_single_preview_image' />
                  </div>
                ))}
                <button onClick={prevSinglePreviewImage} className='desktop_checkout_left_arrow'><FaChevronLeft size={10} /></button>
                <button onClick={nextSinglePreviewImage} className='desktop_checkout_right_arrow'><FaChevronRight size={10} /></button>
              </div>

              <h3>{item.title}</h3>

              <div className="desktop_checkout_order_single_preview_variants">
                {Object.entries(item.variant||{}).length > 0 && Object.entries(item.variant||{}).map(([key, value], index: number) => {
                  return value ? (<div key={index} className="desktop_checkout_order_single_variant_wrapper">
                    <span className='d_c_o_v_l'>{key}:</span>
                    <span className='d_c_o_v_v'>{value}</span>
                  </div>) : null})}
                  <div key={index} className="desktop_checkout_order_single_variant_wrapper">
                    <span className='d_c_o_v_l'>Qty :</span>
                    <span className='d_c_o_v_v'>{item.qty}</span>
                  </div>
              </div>

              {item.price && (
              <div className="desktop_checkout_order_single_preview_price">
                {item.price.prev && <span className='d_c_o_o_p'>{`${currency.symbol} ${formatNumberWithCommas(Number((item.price.prev).toFixed(2)))}`}</span>}
                {item.price.current && <span className='d_c_o_n_p'>{`${currency.symbol} ${formatNumberWithCommas(Number((item.price.current).toFixed(2)))}`}</span>}
              </div>)}
            </div>
          ))}

          {orders.length > 1 && <div className='mobile_checkout_product_preview_section'>
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


          <div style={{marginTop: "10px"}} className="desktop_checkout_order_d_em">
            <span className='desktop_checkout_order_d_em_label'>SUBTOTAL</span>
            <span className='desktop_checkout_order_d_em_value'>{currency.symbol+" "+formatNumberWithCommas(Number((subTotal).toFixed(2)))}</span>
          </div>
          {Object.entries(extraFee).map(([key, value], index: number) => (
            <div key={index} className="desktop_checkout_order_d_em">
              <span className='desktop_checkout_order_d_em_label'>{key.toUpperCase()}</span>
              <span className='desktop_checkout_order_d_em_value'>{currency.symbol+" "+formatNumberWithCommas(Number((value).toFixed(2)))}</span>
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
            <span className='desktop_checkout_agree_text'>
              By confirming the order, I accept the <a href='/terms_of_use'>terms of user agreement.</a>
            </span>
          </div>

        </div>
      </div>
    </div>
  )
}

export default DesktopCheckout