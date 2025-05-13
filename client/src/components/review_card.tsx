import { Product } from '@/constants/provider'
import React from 'react'
import { Rating } from 'react-simple-star-rating';
import "./css/review_card.css";
type Data = {
    data: NonNullable<Product['reviews']>[number];
};

const ReviewCard: React.FC<Data> = ({ data }) : React.JSX.Element => {
    const formattedDate = new Date(data.created_at).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

  return (
    <div className='review_card_container'>
        <h4>{ data.user }</h4>
        <div className="review_card_rating_date_container">
            <Rating readonly fillColor='var(--accent)' initialValue={data.rating} size={15} />
            <span className='review_card_date'>{ formattedDate }</span>
        </div>
        <p className='review_card_review'>{ data.review }</p>
    </div>
  )
}

export default ReviewCard