import { useGlobalProvider } from '@/constants/provider';
import React from 'react'
import MobileSearch from './mobile/search';
import DesktopSearch from './desktop/search';
import { useParams } from 'react-router';

const Search : React.FC = () : React.JSX.Element => {
  const { display } = useGlobalProvider();

  const { query, type } = useParams();
  
    return display.mobile ? (<MobileSearch query={query} type={type} />) : (<DesktopSearch query={query} type={type} />)
}

export default Search