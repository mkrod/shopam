import { OrderList } from '@/constants/provider'
import React, { useEffect, useState } from 'react'
import "./css/mobile_order_list_card.css";
import { formatNumberWithCommas, getStatusColor, returnUrl } from '@/constants';
import ActivityIndicator from './activity_indicator';
import { useNavigate } from 'react-router';

interface Prop {
    data: OrderList;
}
export interface DisplayItem {
  image?: string;
  title?: string;
  variant?: string;
  price?: string | number;
  quantity?: string | number;
}
const MobileOrderListCard : React.FC<Prop> = ({ data }) : React.JSX.Element => {

  const navigate = useNavigate();
  const [displayItem, setDisplayItem] = useState<DisplayItem>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    if(!data.data) return;
    const itemToDisplay: DisplayItem = {
      image: data.data.orders?.[0]?.images?.[0]?.url,
      title: data.data.orders[0].title,
      variant: data.data.orders[0].variant ? `${data.data.orders[0].variant.size || ''} ${data.data.orders[0].variant.color || ''}`.trim() : undefined,
      price: data.data.orders[0].price.current,
      quantity: data.data.orders[0].qty,
    }
    setDisplayItem(itemToDisplay);
  }, [data.data])


  return (
    <div onClick={() => navigate(returnUrl({
      goto: "/orders/details",
      params: {
        order_id: data.order_id,
      }
    }))} className='mobile_order_card_list_container'>
        <div className="mobile_order_card_list_item_container">
            <div className="mobile_order_card_list_item_show_image_container">
                <img onLoad={() => setIsLoading(false)} src={displayItem.image} alt="mobile_order_card_list_item_show_image" className='mobile_order_card_list_item_image' />
                {isLoading && <div style={{position: "absolute", top: "0", left: "0", right: "0", bottom: "0", display: "flex", justifyContent: "center", alignItems: "center" ,backgroundColor: "var(--background-color)"}}>
                  <ActivityIndicator size='small' />
                </div>}
            </div>
            <div className="mobile_order_card_list_item_metadata_container">
              <h4>{displayItem.title}</h4>
              <span>{displayItem.variant}</span>
              <h4>{formatNumberWithCommas(Number(Number(displayItem.price).toFixed(2))||0)}</h4>
            </div>
        </div>
        <div className="mobile_order_card_list_order_metadata_container">
            <div className="mobile_order_card_list_order_metadata">
                <span className='mobile_order_card_list_order_metadata_label'>Order ID</span>
                <h5 className='mobile_order_card_list_order_metadata_value'>#{data.order_id}</h5>
            </div>
            <div className="mobile_order_card_list_order_metadata">
                <span className='mobile_order_card_list_order_metadata_label'>Date</span>
                <h5>{new Date(data.created_at).toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }).replace(',', '')}</h5>
            </div>
            <div className="mobile_order_card_list_order_metadata">
                <span className='mobile_order_card_list_order_metadata_label'>Total Items</span>
                <h5 className='mobile_order_card_list_order_metadata_value'>{data.data.orders.length}</h5>
            </div>
            <div className="mobile_order_card_list_order_metadata">
                <span className='mobile_order_card_list_order_metadata_label'>Status</span>
                <h6 style={{backgroundColor: getStatusColor(data.status)}} className='mobile_order_card_list_order_metadata_value value_status'>{data.status}</h6>
            </div>
        </div>
    </div>
  )
}

export default MobileOrderListCard;