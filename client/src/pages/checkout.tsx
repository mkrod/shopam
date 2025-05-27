import { useGlobalProvider } from '@/constants/provider';
import React from 'react'
import { useLocation } from 'react-router'
import MobileCheckout from './mobile/checkout';
import DesktopCheckout from './desktop/checkout';

const Checkout : React.FC = () : React.JSX.Element => {

  const { state } = useLocation();
  const { display } = useGlobalProvider();

  
  return display.mobile ? (<MobileCheckout data={state} />) : (<DesktopCheckout data={state} />);
}

export default Checkout