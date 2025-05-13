import React from 'react'
import "./css/tabs_layout.css"
import { Outlet } from 'react-router'
import DeskTopTabNavBar from '@/components/navbar/desktop_tab';
import Footer from '@/components/footer';
/*import MobileNavbar, { Bar } from '@/components/navbar/mobile';
import { IoGrid, IoGridOutline } from 'react-icons/io5';
import { FaHeart, FaRegHeart, FaRegUser, FaUser } from 'react-icons/fa';
import { RiHome6Fill, RiHome6Line } from 'react-icons/ri';*/


const TabsLayout : React.FC = () : React.JSX.Element => {

  /*const TabiconSize = 20;
  
  const tabBarProp: Bar[] = [
    {
      name: "Home",
      icon: {
        solid: <RiHome6Fill size={25} color='var(--accent)' />,
        outline: <RiHome6Line size={25} />,
      },
      path: "/",
    },
    {
      name: "Explore",
      icon: {
        solid: <IoGrid size={TabiconSize} color='var(--accent)' />,
        outline: <IoGridOutline size={TabiconSize} /> ,
      },
      path: "/explore",
    },
    {
      name: "Saved",
      icon: {
        solid: <FaHeart size={TabiconSize} color='var(--accent)' />,
        outline: <FaRegHeart size={TabiconSize} />,
      },
      path: "/saved",
    },
    {
      name: "Me",
      icon: {
        solid: <FaUser size={TabiconSize} color='var(--accent)' />,
        outline: <FaRegUser size={TabiconSize} /> ,
      },
      path: "/profile",
    },
  ];*/

  

  return (
    <div className='tabs_layout_container'>
      <div className="tabs_layout_desktop_tabs_navigation_container">
        <DeskTopTabNavBar />
      </div>
      <div className="tabs_content_container">
        <Outlet context={{}} />
      </div>
      {/*<div className="tabs_navigation_bar_container mobile">
        <MobileNavbar 
          tabs={tabBarProp}
        />
      </div>*/}
      <Footer />
    </div>
  )
}

export default TabsLayout