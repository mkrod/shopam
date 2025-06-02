import { Orders, Variant } from '@/constants/provider';
import React, { CSSProperties } from 'react'
import "./css/order_card.css";
import { useGlobalProvider } from '@/constants/provider';
import { formatNumberWithCommas } from '@/constants';

type Prop = {data: Orders, otherStyles?: CSSProperties}
const OrderCard : React.FC<Prop> = ({ data, otherStyles }) : React.JSX.Element => {
    const {currency} = useGlobalProvider();
  return (
    <div style={otherStyles} className='order_card_container'>
        <div className="order_card_image_container">
            <img src={data.images ? data.images[0].url : undefined} className='order_card_image' />
        </div>
        <div className="order_card_metadata">
            <h5 className='order_card_metadata_title'>{data.title}</h5>
            {Object.values(data.variant || {}).some((v)=>v!=null||v!=undefined) && <div className="order_card_variants">
                {Object.values(data.variant || {}).map((value: Variant, index: number) => (
                    <span className='cart_card_variant' key={index}>{value.value}</span>
                ))}
            </div>}
            <div className="order_card_price_qty_section">
                <h4>{currency.symbol+" "+formatNumberWithCommas(data.salePrice)}</h4>
                <span className='order_card_quantity'>{"x"+data.qty}</span>
            </div>
        </div>
    </div>
  )
}

export default OrderCard