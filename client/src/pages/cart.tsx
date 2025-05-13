import { useGlobalProvider } from '@/constants/provider';
import React from 'react'
import MobileCart from './mobile/cart';
import DesktopCart from './desktop/cart';

const Cart : React.FC = () : React.JSX.Element => {


  const { display, cart } = useGlobalProvider();

  return display.mobile ? (<MobileCart data={cart} />) : (<DesktopCart data={cart}/>);
}

export default Cart