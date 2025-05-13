import { DesktopBannerProp } from '@/constants/provider'
import React from 'react'
import { useNavigate } from 'react-router'
import "./css/desktop_banner.css";
import { returnUrl } from '@/constants';

const DesktopBanner : React.FC<{data: DesktopBannerProp, variant: "desktop" | "mobile"}> = ({ data, variant }) : React.JSX.Element => {
    const navigate = useNavigate();

  return (
    <div className='desktop_banner_component_container'>
        <div className="desktop_banner_component_left">
            <div className="desktop_banner_component_left_deal">{data.deal}</div>
            {variant === "desktop" && <h1 className="desktop_banner_component_left_title">{data.title.length > 50 ? data.title.slice(0, 47) + "..." : data.title}</h1>}
            {variant === "mobile" && <h3 className="desktop_banner_component_left_title">{data.title.length > 50 ? data.title.slice(0, 47) + "..." : data.title}</h3>}
            <div className="desktop_banner_component_left_navigate">
                <button onClick={() => navigate(returnUrl({
                    goto: "/product",
                    params: {
                        id: data.id
                    },
                }))} className="desktop_banner_component_left_button">
                    Shop Now
                </button>
            </div>
        </div>
        <div className="desktop_banner_component_right">
            <img src={data.image} className='desktop_banner_component_right_image'  />
        </div>
    </div>
  )
}

export default DesktopBanner