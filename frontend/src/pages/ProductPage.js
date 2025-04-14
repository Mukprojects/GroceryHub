import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import { toast } from 'react-toastify';

// Components
import Loader from '../components/common/Loader';
import Rating from '../components/common/Rating';

// Actions
import { getProductBySlug } from '../features/products/productSlice';
import { addToCart } from '../features/cart/cartSlice';

const ProductPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  
  const { loading, error, selectedProduct } = useSelector((state) => state.products);
  
  useEffect(() => {
    if (slug) {
      dispatch(getProductBySlug(slug));
    }
  }, [dispatch, slug]);
  
  useEffect(() => {
    // Reset selected image when product changes
    setSelectedImage(0);
  }, [selectedProduct]);
  
  const handleAddToCart = () => {
    if (selectedProduct) {
      // Get the current selected image or use the main product image
      let imageSrc = selectedProduct.image;
      if (selectedProduct.images && selectedProduct.images.length > 0) {
        imageSrc = selectedProduct.images[selectedImage];
      }
      
      // Format image URL if needed
      if (!imageSrc.startsWith('http')) {
        imageSrc = `http://localhost:5000${imageSrc}`;
      }
      
      // Use actual price (original or discounted)
      const actualPrice = selectedProduct.discountPrice && selectedProduct.price > selectedProduct.discountPrice
        ? selectedProduct.discountPrice
        : selectedProduct.price;
      
      dispatch(addToCart({
        productId: selectedProduct._id,
        name: selectedProduct.name,
        image: imageSrc,
        price: actualPrice,
        quantity,
      }));
      
      toast.success(`${selectedProduct.name} added to cart!`);
    }
  };
  
  // Get image source based on whether it's a local or remote URL
  const getImageSrc = (imagePath) => {
    if (!imagePath) return '';
    return imagePath.startsWith('http') ? imagePath : `http://localhost:5000${imagePath}`;
  };
  
  // Get the current main display image
  const getMainImage = () => {
    if (!selectedProduct) return '';
    
    // If product has images array with content, use the selected image
    if (selectedProduct.images && selectedProduct.images.length > 0) {
      return getImageSrc(selectedProduct.images[selectedImage]);
    }
    
    // Otherwise fallback to main image
    return getImageSrc(selectedProduct.image);
  };
  
  if (loading) return <Loader />;
  
  if (error) return <ErrorMessage>{error}</ErrorMessage>;
  
  if (!selectedProduct) return <ErrorMessage>Product not found</ErrorMessage>;
  
  return (
    <ProductContainer>
      <BackLink to="/products">
        <FaArrowLeft /> Back to Products
      </BackLink>
      
      <ProductDetails>
        <ProductImagesSection>
          <MainImageContainer>
            <ProductMainImage src={getMainImage()} alt={selectedProduct.name} />
          </MainImageContainer>
          
          {selectedProduct.images && selectedProduct.images.length > 1 && (
            <ThumbnailsContainer>
              {selectedProduct.images.map((img, index) => (
                <ThumbnailItem 
                  key={index}
                  isSelected={selectedImage === index}
                  onClick={() => setSelectedImage(index)}
                >
                  <ThumbnailImage 
                    src={getImageSrc(img)} 
                    alt={`${selectedProduct.name} - view ${index + 1}`} 
                  />
                </ThumbnailItem>
              ))}
            </ThumbnailsContainer>
          )}
        </ProductImagesSection>
        
        <ProductInfo>
          <ProductTitle>{selectedProduct.name}</ProductTitle>
          
          <RatingContainer>
            <Rating value={selectedProduct.averageRating || selectedProduct.rating || 0} />
            <ReviewCount>{selectedProduct.numReviews} reviews</ReviewCount>
          </RatingContainer>
          
          <ProductDescription>
            {selectedProduct.description}
          </ProductDescription>
          
          <PriceContainer>
            {selectedProduct.discountPrice ? (
              <>
                <DiscountPrice>₹{selectedProduct.discountPrice.toFixed(2)}</DiscountPrice>
                <OriginalPrice>₹{selectedProduct.price.toFixed(2)}</OriginalPrice>
              </>
            ) : (
              <Price>₹{selectedProduct.price.toFixed(2)}</Price>
            )}
          </PriceContainer>
          
          <ProductMeta>
            <MetaItem>
              <MetaLabel>Brand:</MetaLabel>
              <MetaValue>{selectedProduct.brand}</MetaValue>
            </MetaItem>
            <MetaItem>
              <MetaLabel>Category:</MetaLabel>
              <MetaValue>{selectedProduct.category}</MetaValue>
            </MetaItem>
          </ProductMeta>
          
          <StockInfo inStock={selectedProduct.countInStock > 0}>
            {selectedProduct.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
          </StockInfo>
          
          {selectedProduct.countInStock > 0 && (
            <AddToCartContainer>
              <QuantitySelector>
                <QuantityLabel>Quantity:</QuantityLabel>
                <QuantityInput
                  type="number"
                  min="1"
                  max={selectedProduct.countInStock}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                />
              </QuantitySelector>
              
              <AddToCartButton onClick={handleAddToCart}>
                <FaShoppingCart /> Add to Cart
              </AddToCartButton>
            </AddToCartContainer>
          )}
        </ProductInfo>
      </ProductDetails>
    </ProductContainer>
  );
};

const ProductContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: var(--primary-color);
  margin-bottom: 20px;
  text-decoration: none;
  font-weight: 500;
  
  svg {
    margin-right: 5px;
  }
  
  &:hover {
    text-decoration: underline;
  }
`;

const ProductDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProductImagesSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const MainImageContainer = styled.div`
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
  height: 400px;
`;

const ProductMainImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ThumbnailsContainer = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const ThumbnailItem = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid ${props => props.isSelected ? 'var(--primary-color)' : 'transparent'};
  
  &:hover {
    opacity: 0.9;
  }
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProductTitle = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 10px;
  color: var(--dark-color);
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const ReviewCount = styled.span`
  margin-left: 10px;
  color: var(--grey-dark);
  font-size: 0.9rem;
`;

const ProductDescription = styled.p`
  margin-bottom: 20px;
  line-height: 1.6;
  color: var(--dark-color);
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
`;

const Price = styled.span`
  font-weight: bold;
  font-size: 1.5rem;
  color: var(--dark-color);
`;

const DiscountPrice = styled.span`
  font-weight: bold;
  font-size: 1.5rem;
  color: var(--primary-color);
`;

const OriginalPrice = styled.span`
  font-size: 1.1rem;
  color: var(--grey-dark);
  text-decoration: line-through;
`;

const ProductMeta = styled.div`
  margin-bottom: 15px;
`;

const MetaItem = styled.div`
  display: flex;
  margin-bottom: 5px;
`;

const MetaLabel = styled.span`
  font-weight: 500;
  width: 80px;
`;

const MetaValue = styled.span`
  color: var(--grey-dark);
`;

const StockInfo = styled.div`
  margin-bottom: 20px;
  font-weight: 500;
  color: ${props => props.inStock ? 'var(--success-color)' : 'var(--danger-color)'};
`;

const AddToCartContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const QuantityLabel = styled.label`
  font-weight: 500;
`;

const QuantityInput = styled.input`
  width: 60px;
  padding: 8px;
  border: 1px solid var(--grey);
  border-radius: 4px;
`;

const AddToCartButton = styled.button`
  padding: 12px 20px;
  background-color: var(--primary-color);
  color: var(--white);
  border: none;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: var(--primary-dark);
  }
`;

const ErrorMessage = styled.div`
  padding: 20px;
  background-color: var(--danger-light);
  color: var(--danger-color);
  border-radius: 4px;
  margin: 20px auto;
  max-width: 1200px;
  text-align: center;
`;

export default ProductPage; 