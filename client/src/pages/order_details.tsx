import { useGlobalProvider } from '@/constants/provider';
import React from 'react'
import { useParams } from 'react-router';
import MobileOrderDetails from './mobile/order_details';
import DesktopOrderDetails from './desktop/desktop_order_details';



const OrderDetails : React.FC = () : React.JSX.Element => {
    const { order_id } = useParams();
    const { display } = useGlobalProvider();

  return display.mobile ? (<MobileOrderDetails order_id={order_id} />) : (<DesktopOrderDetails order_id={order_id} />);
}

export default OrderDetails