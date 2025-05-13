import { Product } from '@/constants/provider'
import React from 'react'
import ReviewCard from './review_card';
import "./css/desktop_review_component.css"

interface Props {
    data: Product['reviews'];
}

const ReviewComponent : React.FC<Props> = ({ data }) : React.JSX.Element => {

  return (
    <div className='desktop_review_component_container'>
      {data?.map((review: NonNullable<Product['reviews']>[number], index: number) => (
        <ReviewCard data={review} key={index} />
      ))}
    </div>
  )
}

export default ReviewComponent