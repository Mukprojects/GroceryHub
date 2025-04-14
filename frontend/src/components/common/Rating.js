import React from 'react';
import styled from 'styled-components';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const Rating = ({ value = 0, text, color = '#f8e825' }) => {
  const stars = [];
  
  for (let i = 1; i <= 5; i++) {
    if (value >= i) {
      stars.push(<FaStar key={i} color={color} />);
    } else if (value >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} color={color} />);
    } else {
      stars.push(<FaRegStar key={i} color={color} />);
    }
  }
  
  return (
    <RatingContainer>
      <Stars>
        {stars.map((star, index) => (
          <Star key={index}>{star}</Star>
        ))}
      </Stars>
      {text && <Text>{text}</Text>}
    </RatingContainer>
  );
};

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const Stars = styled.div`
  display: flex;
`;

const Star = styled.span`
  margin-right: 2px;
`;

const Text = styled.span`
  margin-left: 5px;
  font-size: 0.9rem;
  color: var(--grey-dark);
`;

export default Rating; 