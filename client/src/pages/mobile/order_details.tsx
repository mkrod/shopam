import MobileOrderDetailsCard from '@/components/mobile_order_details_card';
import { OrderList, Orders, useGlobalProvider } from '@/constants/provider';
import React, { useEffect, useState } from 'react'


type OrderId = {order_id: string | undefined};
const MobileOrderDetails : React.FC<OrderId>  = ({ order_id }) : React.JSX.Element => {


    const { orderList } = useGlobalProvider();

    
    const [orders, setOrders] = useState<Orders[]>([]);

    useEffect(() => {
        if(!order_id) return;
        const order : OrderList|undefined = orderList.find((item)=>item.order_id===order_id);

        if(!order) return;
        
        setOrders(order.data.orders);
    } ,[order_id, orderList.length]);

    


  return (
    <div style={{padding: "var(--y) var(--x)"}} className='mobile_order_details_container'>
        {orders.map((order: Orders,index:number)=>(
            <MobileOrderDetailsCard key={index} data={order} />
        ))}
    </div>
  )
}

export default MobileOrderDetails;