import { useGlobalProvider } from '@/constants/provider'
import React from 'react'
import MobileMe from './mobile/me';
//import DesktopMe from './desktop/me';


const Me : React.FC = () : React.JSX.Element => {
  const { display } = useGlobalProvider();

  return display.mobile ? (<MobileMe />) : (<MobileMe />) ;
}

export default Me