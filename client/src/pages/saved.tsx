import { useGlobalProvider } from '@/constants/provider'
import React from 'react'
import MobileSaved from './mobile/saved';
import DesktopSaved from './desktop/saved';

const Saved : React.FC = () : React.JSX.Element => {

  const { display, saved } = useGlobalProvider();

  return display.mobile ? (<MobileSaved data={saved} />) : (<DesktopSaved data={saved} />);
}

export default Saved