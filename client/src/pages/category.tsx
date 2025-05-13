import { useGlobalProvider } from '@/constants/provider'
import React from 'react'
import { useParams } from 'react-router';
import MobileCategory from './mobile/category';
import DesktopCategory from './desktop/category';

const Category : React.FC = () : React.JSX.Element => {

  const { display }  = useGlobalProvider();
  const { id, name } = useParams();
  



  return display.mobile ? (<MobileCategory id={id} name={name} />) : (<DesktopCategory id={id} name={name} />);
}

export default Category