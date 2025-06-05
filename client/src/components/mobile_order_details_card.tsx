import { Orders, Variant } from '@/constants/provider'
import React, { useState } from 'react'
import { formatNumberWithCommas, getStatusColor } from '@/constants';
import ActivityIndicator from './activity_indicator';


type Prop = {data: Orders}
const MobileOrderDetailsCard : React.FC<Prop> = ({data}) : React.JSX.Element => {


    const [isLoading, setIsLoading] = useState<boolean>(true);



  return (
       <div className='mobile_order_card_list_container'>
            <div className="mobile_order_card_list_item_container">
                <div className="mobile_order_card_list_item_show_image_container">
                    <img onLoad={() => setIsLoading(false)} src={data.images?.[0]?.url ?? ""} alt="mobile_order_card_list_item_show_image" className='mobile_order_card_list_item_image' />
                    {isLoading && <div style={{position: "absolute", top: "0", left: "0", right: "0", bottom: "0", display: "flex", justifyContent: "center", alignItems: "center" ,backgroundColor: "var(--background-color)"}}>
                      <ActivityIndicator
                       size='small' />
                    </div>}
                </div>
                <div className="mobile_order_card_list_item_metadata_container">
                  <h4>{data.title}</h4>
                  {Object.values(data.variant||{}).map((item:Variant, index:number) => (
                    <h6 key={index}>{item.value}</h6>
                  ))}
                  <h4>{formatNumberWithCommas(Number(Number(data.price.current).toFixed(2))||0)}</h4>
                </div>
            </div>
            <div className="mobile_order_card_list_order_metadata_container">
                <div className="mobile_order_card_list_order_metadata">
                    <span className='mobile_order_card_list_order_metadata_label'>Order ID</span>
                    <h5 className='mobile_order_card_list_order_metadata_value'>#{data.order_item_id}</h5>
                </div>
                <div className="mobile_order_card_list_order_metadata">
                    <span className='mobile_order_card_list_order_metadata_label'>Updated</span>
                    <h5>{new Date(data.updated_at||new Date()).toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }).replace(',', '')}</h5>
                </div>
                
                <div className="mobile_order_card_list_order_metadata">
                    <span className='mobile_order_card_list_order_metadata_label'>Total Items</span>
                    <h5 className='mobile_order_card_list_order_metadata_value'>{data.qty}</h5>
                </div>
                <div className="mobile_order_card_list_order_metadata">
                    <span className='mobile_order_card_list_order_metadata_label'>Status</span>
                    <h6 style={{backgroundColor: getStatusColor(data.status??"processing")}} className='mobile_order_card_list_order_metadata_value value_status'>{data.status??"Processing"}</h6>
                </div>
            </div>
        </div>
  )
}

export default MobileOrderDetailsCard