import { useGlobalProvider } from '@/constants/provider'
import React from 'react'
import MobileOrders from './mobile/orders';
import DesktopOrders from './desktop/desktop_orders';

const Orders : React.FC = () : React.JSX.Element => {
  const { display } = useGlobalProvider();
    
  return display.mobile ? (<MobileOrders />) : (<DesktopOrders />);
}

export default Orders