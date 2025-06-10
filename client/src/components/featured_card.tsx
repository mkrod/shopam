import { Product } from '@/constants/provider'
import React from 'react'
import { TbExternalLink } from 'react-icons/tb'
import "./css/featured_card.css";
import { returnUrl } from '@/constants';
import { useNavigate } from 'react-router';

const FeaturedCard : React.FC<{data: Product}> = ({ data }) : React.JSX.Element => {
    const image = data.featured?.gallery && data.featured.gallery.length > 0 ? data.featured.gallery[0] : data.gallery && data.gallery.length > 0 ? data.gallery[0].url : "";
    const main = data.featured?.main ? data.featured.main : data.title ? data.title : "";
    const desc = data.featured?.description ? data.featured.description : data.description ? data.description : "";

    const navigate = useNavigate();
  return (
    <div className='featured_product_card_container'>
        <img src={image} alt='image' className='featured_product_card_image' />
        <div className="featured_product_card_metadata_container">
            <div className="featured_product_card_metadata_main">{ main }</div>
            <div className="featured_product_card_metadata_description">{ desc.length > 250 ? desc.slice(0, 250) + "...": desc }</div>
            <div className="featured_product_card_metadata_button_container">
                <button onClick={() => navigate(returnUrl({
                    goto: "/product",
                    params: {id: data.id},
                }))} className='featured_product_card_metadata_button'>
                    Buy now
                    <TbExternalLink />
                </button>
            </div>
        </div>
    </div>
  )
}

export default FeaturedCard