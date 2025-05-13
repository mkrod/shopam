import { useGlobalProvider } from '@/constants/provider'
import React, { useEffect } from 'react'
import ProductDesktop from './desktop/product_details';
import ProductMobile from './mobile/product_details';
import { useLocation, useParams } from 'react-router';
import "./css/product.css";

const ProductPage : React.FC = () : React.JSX.Element => {

  const { id } = useParams();
  const { pathname } = useLocation();

  const { display } = useGlobalProvider();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return display.mobile ? (<ProductMobile id={id} />) : (<ProductDesktop id={id} />);
}

export default ProductPage