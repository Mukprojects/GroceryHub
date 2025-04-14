import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { FaCartPlus } from 'react-icons/fa';
import { addToCart } from '../../features/cart/cartSlice';
import { toast } from 'react-toastify';
import Rating from '../common/Rating';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  // Add null checking for product
  if (!product) {
    return <div>Product data missing</div>;
  }
  
  const {
    _id,
    name = 'Unnamed Product',
    price = 0,
    discountPrice = 0,
    image = '',
    images = [],
    rating = 0,
    averageRating = 0,
    slug = '',
    stock = 0,
    countInStock = 0,
  } = product;
  
  // Use either stock or countInStock depending on which one is available
  const productStock = typeof stock !== 'undefined' ? stock : countInStock;
  
  const handleAddToCart = () => {
    if (productStock < 1) {
      toast.error('Product is out of stock');
      return;
    }
    
    // Get image source
    const productImage = image || (images.length > 0 ? images[0] : '');
    const imageSrc = productImage.startsWith('http') 
      ? productImage 
      : `http://localhost:5000${productImage}`;
    
    // Use actual price (original or discounted)
    const actualPrice = discountPrice > 0 && price > discountPrice 
      ? discountPrice 
      : price;
    
    dispatch(
      addToCart({
        productId: _id,
        name: name,
        image: imageSrc,
        price: actualPrice,
        quantity: 1,
      })
    );
    
    toast.success(`${name} added to cart`);
  };
  
  return (
    <CardContainer>
      <Link to={`/product/${slug}`}>
        <ProductImage>
          {/* Handle both single image and image array cases */}
          {image ? (
            <img 
              src={image.startsWith('http') ? image : `http://localhost:5000${image}`} 
              alt={name} 
            />
          ) : images && images.length > 0 ? (
            <img 
              src={images[0].startsWith('http') ? images[0] : `http://localhost:5000${images[0]}`} 
              alt={name} 
            />
          ) : (
            <div className="product-placeholder">{name.charAt(0)}</div>
          )}
          {discountPrice > 0 && price > discountPrice ? (
            <DiscountBadge>
              {Math.round(((price - discountPrice) / price) * 100)}% OFF
            </DiscountBadge>
          ) : null}
          {productStock < 1 && <OutOfStockBadge>Out of Stock</OutOfStockBadge>}
        </ProductImage>
      </Link>
      
      <ProductInfo>
        <Link to={`/product/${slug}`}>
          <ProductName>{name}</ProductName>
        </Link>
        
        <Rating value={averageRating || rating || 0} />
        
        <PriceContainer>
          {discountPrice > 0 && price > discountPrice ? (
            <>
              <DiscountPrice>₹{discountPrice.toFixed(2)}</DiscountPrice>
              <OriginalPrice>₹{price.toFixed(2)}</OriginalPrice>
            </>
          ) : (
            <Price>₹{price.toFixed(2)}</Price>
          )}
        </PriceContainer>
        
        <AddToCartButton
          onClick={handleAddToCart}
          disabled={productStock < 1}
          className={productStock < 1 ? 'disabled' : ''}
        >
          <FaCartPlus /> Add to Cart
        </AddToCartButton>
      </ProductInfo>
    </CardContainer>
  );
};

const CardContainer = styled.div`
  background-color: var(--white);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: var(--box-shadow);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const ProductImage = styled.div`
  position: relative;
  height: 200px;
  background-color: var(--grey-light);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .product-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    color: var(--grey-dark);
    font-weight: bold;
    background-color: var(--grey-light);
  }
`;

const DiscountBadge = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: var(--primary-color);
  color: var(--white);
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
`;

const OutOfStockBadge = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white);
  font-size: 1.2rem;
  font-weight: bold;
`;

const ProductInfo = styled.div`
  padding: 15px;
`;

const ProductName = styled.h3`
  font-size: 1rem;
  margin-bottom: 10px;
  color: var(--dark-color);
  min-height: 40px;
  
  &:hover {
    color: var(--primary-color);
  }
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
`;

const Price = styled.span`
  font-weight: bold;
  font-size: 1.1rem;
  color: var(--dark-color);
`;

const DiscountPrice = styled.span`
  font-weight: bold;
  font-size: 1.1rem;
  color: var(--primary-color);
`;

const OriginalPrice = styled.span`
  font-size: 0.9rem;
  color: var(--grey-dark);
  text-decoration: line-through;
`;

const AddToCartButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: var(--primary-color);
  color: var(--white);
  border: none;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  &.disabled {
    background-color: var(--grey);
    cursor: not-allowed;
  }
`;

export default ProductCard;