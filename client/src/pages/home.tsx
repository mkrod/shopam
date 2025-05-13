import React from 'react'
import "./css/home.css";
import { useGlobalProvider } from '@/constants/provider';
import MobileHomePage from './mobile/home';
import DesktopHomePage from './desktop/home';

const Homepage : React.FC = () : React.JSX.Element => {
  const { display } = useGlobalProvider();

  return display.mobile ? (<MobileHomePage />) : (<DesktopHomePage />);
}

export default Homepage;