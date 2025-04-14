import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { FaStar, FaShoppingCart, FaHeart, FaShare, FaCheck, FaTimes } from 'react-icons/fa';
import { getProductDetails } from '../features/products/productSlice';
import { addToCart } from '../features/cart/cartSlice';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';
import Rating from '../components/common/Rating';

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  const { product, isLoading, error } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  
  useEffect(() => {
    dispatch(getProductDetails(id));
  }, [dispatch, id]);
  
  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity }));
  };
  
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    setQuantity(value);
  };
  
  const handleSubmitReview = (e) => {
    e.preventDefault();
    
    // TODO: Implement review submission logic
    console.log({ rating, comment });
    
    // Reset form
    setRating(0);
    setComment('');
    setReviewSubmitted(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setReviewSubmitted(false);
    }, 3000);
  };
  
  if (isLoading) {
    return <Loader />;
  }
  
  if (error) {
    return <Message variant="danger">{error}</Message>;
  }
  
  if (!product) {
    return <Message>Product not found</Message>;
  }
  
  const discountPercentage = product.discount
    ? Math.round(((product.regularPrice - product.price) / product.regularPrice) * 100)
    : 0;
  
  return (
    <ProductDetailContainer className="container">
      <Breadcrumbs>
        <Link to="/">Home</Link> &gt; <Link to="/products">Products</Link> &gt;{' '}
        <span>{product.name}</span>
      </Breadcrumbs>
      
      <ProductGrid>
        <ImageSection>
          {product.discount > 0 && (
            <DiscountBadge>{discountPercentage}% OFF</DiscountBadge>
          )}
          
          {!product.countInStock && (
            <OutOfStockBadge>Out of Stock</OutOfStockBadge>
          )}
          
          <MainImage src={product.image} alt={product.name} />
          
          {product.images && product.images.length > 0 && (
            <ThumbnailsContainer>
              <Thumbnail src={product.image} alt={product.name} active />
              {product.images.map((img, index) => (
                <Thumbnail key={index} src={img} alt={`${product.name} ${index + 1}`} />
              ))}
            </ThumbnailsContainer>
          )}
        </ImageSection>
        
        <InfoSection>
          <h1>{product.name}</h1>
          
          <RatingContainer>
            <Rating value={product.averageRating} text={`${product.numReviews} reviews`} />
          </RatingContainer>
          
          <PriceContainer>
            {product.discount > 0 ? (
              <>
                <CurrentPrice>${product.price.toFixed(2)}</CurrentPrice>
                <RegularPrice>${product.regularPrice.toFixed(2)}</RegularPrice>
                <Discount>Save ${(product.regularPrice - product.price).toFixed(2)}</Discount>
              </>
            ) : (
              <CurrentPrice>${product.price.toFixed(2)}</CurrentPrice>
            )}
          </PriceContainer>
          
          <StockStatus inStock={product.countInStock > 0}>
            {product.countInStock > 0 ? (
              <>
                <FaCheck /> In Stock ({product.countInStock} available)
              </>
            ) : (
              <>
                <FaTimes /> Out of Stock
              </>
            )}
          </StockStatus>
          
          {product.countInStock > 0 && (
            <AddToCartContainer>
              <QuantitySelector>
                <label htmlFor="quantity">Quantity:</label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={handleQuantityChange}
                  disabled={!product.countInStock}
                >
                  {[...Array(Math.min(product.countInStock, 10)).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </QuantitySelector>
              
              <AddToCartButton onClick={handleAddToCart} disabled={!product.countInStock}>
                <FaShoppingCart /> Add to Cart
              </AddToCartButton>
            </AddToCartContainer>
          )}
          
          <ActionsContainer>
            <ActionButton>
              <FaHeart /> Add to Wishlist
            </ActionButton>
            <ActionButton>
              <FaShare /> Share
            </ActionButton>
          </ActionsContainer>
          
          <Categories>
            <strong>Categories:</strong>
            {product.category && (
              <CategoryBadge to={`/products?category=${product.category.slug}`}>
                {product.category.name}
              </CategoryBadge>
            )}
          </Categories>
        </InfoSection>
      </ProductGrid>
      
      <TabsContainer>
        <TabsList>
          <Tab
            active={activeTab === 'description'}
            onClick={() => setActiveTab('description')}
          >
            Description
          </Tab>
          <Tab
            active={activeTab === 'specifications'}
            onClick={() => setActiveTab('specifications')}
          >
            Specifications
          </Tab>
          <Tab
            active={activeTab === 'reviews'}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews ({product.numReviews})
          </Tab>
        </TabsList>
        
        <TabContent>
          {activeTab === 'description' && (
            <div>
              <p>{product.description}</p>
            </div>
          )}
          
          {activeTab === 'specifications' && (
            <SpecificationsTable>
              <tbody>
                {product.specifications && product.specifications.map((spec, index) => (
                  <tr key={index}>
                    <td>{spec.name}</td>
                    <td>{spec.value}</td>
                  </tr>
                ))}
                
                {/* Fallback specifications if not provided */}
                {(!product.specifications || product.specifications.length === 0) && (
                  <>
                    <tr>
                      <td>Brand</td>
                      <td>{product.brand || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td>Weight</td>
                      <td>{product.weight || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td>Dimensions</td>
                      <td>{product.dimensions || 'N/A'}</td>
                    </tr>
                  </>
                )}
              </tbody>
            </SpecificationsTable>
          )}
          
          {activeTab === 'reviews' && (
            <ReviewsSection>
              <h3>Customer Reviews</h3>
              
              {product.reviews && product.reviews.length === 0 && (
                <Message>No reviews yet</Message>
              )}
              
              {product.reviews && product.reviews.map((review) => (
                <ReviewItem key={review._id}>
                  <ReviewHeader>
                    <h4>{review.name}</h4>
                    <Rating value={review.rating} />
                  </ReviewHeader>
                  <ReviewDate>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </ReviewDate>
                  <p>{review.comment}</p>
                </ReviewItem>
              ))}
              
              <ReviewFormContainer>
                <h3>Write a Review</h3>
                
                {reviewSubmitted && (
                  <Message variant="success">
                    Review submitted successfully!
                  </Message>
                )}
                
                {isAuthenticated ? (
                  <form onSubmit={handleSubmitReview}>
                    <FormGroup>
                      <label htmlFor="rating">Rating</label>
                      <div className="rating-select">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <StarButton
                            key={value}
                            type="button"
                            active={rating >= value}
                            onClick={() => setRating(value)}
                          >
                            <FaStar />
                          </StarButton>
                        ))}
                      </div>
                    </FormGroup>
                    
                    <FormGroup>
                      <label htmlFor="comment">Comment</label>
                      <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                        rows={4}
                      ></textarea>
                    </FormGroup>
                    
                    <SubmitButton type="submit" disabled={!rating}>
                      Submit Review
                    </SubmitButton>
                  </form>
                ) : (
                  <Message>
                    Please <Link to="/login">sign in</Link> to write a review
                  </Message>
                )}
              </ReviewFormContainer>
            </ReviewsSection>
          )}
        </TabContent>
      </TabsContainer>
    </ProductDetailContainer>
  );
};

const ProductDetailContainer = styled.div`
  padding: 30px 0;
`;

const Breadcrumbs = styled.div`
  margin-bottom: 20px;
  font-size: 14px;
  
  a {
    color: var(--primary-color);
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  span {
    color: var(--grey-dark);
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ImageSection = styled.div`
  position: relative;
  background-color: var(--white);
  border-radius: 8px;
  padding: 20px;
  box-shadow: var(--box-shadow);
`;

const MainImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 4px;
`;

const ThumbnailsContainer = styled.div`
  display: flex;
  margin-top: 15px;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 5px;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--grey-light);
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--primary-color);
  }
`;

const Thumbnail = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  opacity: ${(props) => (props.active ? 1 : 0.6)};
  border: ${(props) => (props.active ? '2px solid var(--primary-color)' : 'none')};
  
  &:hover {
    opacity: 1;
  }
`;

const DiscountBadge = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: var(--secondary-color);
  color: var(--white);
  padding: 5px 10px;
  font-weight: bold;
  border-radius: 4px;
  z-index: 1;
`;

const OutOfStockBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: var(--danger-color);
  color: var(--white);
  padding: 5px 10px;
  font-weight: bold;
  border-radius: 4px;
  z-index: 1;
`;

const InfoSection = styled.div`
  h1 {
    font-size: 1.8rem;
    margin-bottom: 15px;
  }
`;

const RatingContainer = styled.div`
  margin-bottom: 20px;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 20px;
`;

const CurrentPrice = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--primary-color);
  margin-right: 10px;
`;

const RegularPrice = styled.div`
  font-size: 1.2rem;
  text-decoration: line-through;
  color: var(--grey-dark);
  margin-right: 10px;
`;

const Discount = styled.div`
  background-color: var(--secondary-color);
  color: white;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: bold;
`;

const StockStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 20px;
  font-weight: 500;
  color: ${(props) => (props.inStock ? 'var(--success-color)' : 'var(--danger-color)')};
`;

const AddToCartContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  
  select {
    padding: 10px;
    border: 1px solid var(--grey);
    border-radius: 4px;
    font-size: 16px;
    min-width: 70px;
  }
`;

const AddToCartButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 25px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  &:disabled {
    background-color: var(--grey);
    cursor: not-allowed;
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 15px;
  background-color: var(--white);
  color: var(--dark-color);
  border: 1px solid var(--grey);
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: var(--grey-light);
    border-color: var(--grey-dark);
  }
`;

const Categories = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 15px;
  flex-wrap: wrap;
`;

const CategoryBadge = styled(Link)`
  display: inline-block;
  padding: 5px 10px;
  background-color: var(--grey-light);
  color: var(--dark-color);
  text-decoration: none;
  border-radius: 20px;
  font-size: 0.9rem;
  
  &:hover {
    background-color: var(--grey);
  }
`;

const TabsContainer = styled.div`
  margin-top: 40px;
`;

const TabsList = styled.div`
  display: flex;
  border-bottom: 1px solid var(--grey);
`;

const Tab = styled.button`
  padding: 12px 20px;
  background-color: transparent;
  border: none;
  border-bottom: 3px solid ${(props) => (props.active ? 'var(--primary-color)' : 'transparent')};
  color: ${(props) => (props.active ? 'var(--primary-color)' : 'var(--dark-color)')};
  font-weight: ${(props) => (props.active ? 'bold' : 'normal')};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: var(--primary-color);
  }
`;

const TabContent = styled.div`
  padding: 25px 0;
  
  p {
    line-height: 1.6;
  }
`;

const SpecificationsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  td {
    padding: 12px 15px;
    border-bottom: 1px solid var(--grey-light);
  }
  
  tr td:first-child {
    width: 30%;
    font-weight: 600;
    background-color: var(--grey-light);
  }
`;

const ReviewsSection = styled.div`
  h3 {
    margin-bottom: 20px;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -8px;
      width: 40px;
      height: 2px;
      background-color: var(--primary-color);
    }
  }
`;

const ReviewItem = styled.div`
  background-color: var(--white);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: var(--box-shadow-light);
  
  p {
    margin-top: 10px;
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h4 {
    margin: 0;
  }
`;

const ReviewDate = styled.div`
  font-size: 0.8rem;
  color: var(--grey-dark);
  margin-top: 5px;
`;

const ReviewFormContainer = styled.div`
  margin-top: 40px;
  background-color: var(--white);
  border-radius: 8px;
  padding: 20px;
  box-shadow: var(--box-shadow-light);
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
  }
  
  textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid var(--grey);
    border-radius: 4px;
    font-size: 14px;
    
    &:focus {
      border-color: var(--primary-color);
      outline: none;
    }
  }
  
  .rating-select {
    display: flex;
    gap: 5px;
  }
`;

const StarButton = styled.button`
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${(props) => (props.active ? 'var(--warning-color)' : 'var(--grey)')};
  
  &:hover {
    color: var(--warning-color);
  }
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  &:disabled {
    background-color: var(--grey);
    cursor: not-allowed;
  }
`;

export default ProductDetailPage; 