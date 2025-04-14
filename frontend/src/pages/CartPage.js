import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaTrash, FaArrowLeft, FaShoppingCart } from 'react-icons/fa';

import { removeFromCart, updateCartItem } from '../features/cart/cartSlice';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { cartItems } = useSelector((state) => state.cart);
  
  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
  };
  
  const handleQuantityChange = (productId, quantity) => {
    dispatch(updateCartItem({ productId, quantity }));
  };
  
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  const handleCheckout = () => {
    navigate('/checkout');
  };
  
  return (
    <CartContainer>
      <CartHeader>
        <Title>Shopping Cart</Title>
        <BackToShopping to="/products">
          <FaArrowLeft /> Continue Shopping
        </BackToShopping>
      </CartHeader>
      
      {cartItems.length === 0 ? (
        <EmptyCart>
          <FaShoppingCart size={48} />
          <EmptyCartText>Your cart is empty</EmptyCartText>
          <ShopNowButton to="/products">Shop Now</ShopNowButton>
        </EmptyCart>
      ) : (
        <CartContent>
          <CartItems>
            <CartItemsHeader>
              <HeaderItem flex={3}>Product</HeaderItem>
              <HeaderItem flex={1}>Price</HeaderItem>
              <HeaderItem flex={1}>Quantity</HeaderItem>
              <HeaderItem flex={1}>Total</HeaderItem>
              <HeaderItem flex={0.5}></HeaderItem>
            </CartItemsHeader>
            
            {cartItems.map(item => (
              <CartItem key={item.productId}>
                <ItemDetail flex={3}>
                  <ItemImage src={item.image} alt={item.name} />
                  <ItemName>{item.name}</ItemName>
                </ItemDetail>
                
                <ItemPrice flex={1}>
                  ₹{item.price.toFixed(2)}
                </ItemPrice>
                
                <ItemQuantity flex={1}>
                  <QuantityInput
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.productId, Number(e.target.value))}
                  />
                </ItemQuantity>
                
                <ItemTotal flex={1}>
                  ₹{(item.price * item.quantity).toFixed(2)}
                </ItemTotal>
                
                <ItemRemove flex={0.5}>
                  <RemoveButton onClick={() => handleRemoveItem(item.productId)}>
                    <FaTrash />
                  </RemoveButton>
                </ItemRemove>
              </CartItem>
            ))}
          </CartItems>
          
          <CartSummary>
            <SummaryTitle>Order Summary</SummaryTitle>
            
            <SummaryRow>
              <SummaryLabel>Subtotal</SummaryLabel>
              <SummaryValue>₹{subtotal.toFixed(2)}</SummaryValue>
            </SummaryRow>
            
            <SummaryRow>
              <SummaryLabel>Shipping</SummaryLabel>
              <SummaryValue>Calculated at checkout</SummaryValue>
            </SummaryRow>
            
            <SummaryDivider />
            
            <SummaryRow total>
              <SummaryLabel>Total</SummaryLabel>
              <SummaryValue>₹{subtotal.toFixed(2)}</SummaryValue>
            </SummaryRow>
            
            <CheckoutButton onClick={handleCheckout}>
              Proceed to Checkout
            </CheckoutButton>
          </CartSummary>
        </CartContent>
      )}
    </CartContainer>
  );
};

const CartContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const CartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

const Title = styled.h1`
  font-size: 1.8rem;
  color: var(--dark-color);
`;

const BackToShopping = styled(Link)`
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--primary-color);
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const EmptyCart = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: var(--grey-dark);
`;

const EmptyCartText = styled.p`
  font-size: 1.2rem;
  margin: 20px 0;
`;

const ShopNowButton = styled(Link)`
  padding: 10px 20px;
  background-color: var(--primary-color);
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    background-color: var(--primary-dark);
  }
`;

const CartContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const CartItems = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const CartItemsHeader = styled.div`
  display: flex;
  background-color: var(--light-bg);
  padding: 15px;
  border-bottom: 1px solid var(--grey-light);
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const HeaderItem = styled.div`
  flex: ${props => props.flex};
  font-weight: 600;
  color: var(--dark-color);
`;

const CartItem = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid var(--grey-light);
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 10px;
  }
`;

const ItemDetail = styled.div`
  flex: ${props => props.flex};
  display: flex;
  align-items: center;
  gap: 10px;
  
  @media (max-width: 768px) {
    flex: 100%;
  }
`;

const ItemImage = styled.img`
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 4px;
`;

const ItemName = styled.span`
  font-weight: 500;
`;

const ItemPrice = styled.div`
  flex: ${props => props.flex};
  
  @media (max-width: 768px) {
    flex: 1;
  }
`;

const ItemQuantity = styled.div`
  flex: ${props => props.flex};
  
  @media (max-width: 768px) {
    flex: 1;
  }
`;

const QuantityInput = styled.input`
  width: 50px;
  padding: 8px;
  border: 1px solid var(--grey);
  border-radius: 4px;
  text-align: center;
`;

const ItemTotal = styled.div`
  flex: ${props => props.flex};
  font-weight: 600;
  
  @media (max-width: 768px) {
    flex: 1;
  }
`;

const ItemRemove = styled.div`
  flex: ${props => props.flex};
  text-align: center;
  
  @media (max-width: 768px) {
    flex: auto;
  }
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: var(--grey-dark);
  cursor: pointer;
  
  &:hover {
    color: var(--danger-color);
  }
`;

const CartSummary = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  height: fit-content;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const SummaryTitle = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 20px;
  color: var(--dark-color);
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-weight: ${props => props.total ? 'bold' : 'normal'};
  font-size: ${props => props.total ? '1.1rem' : '1rem'};
`;

const SummaryLabel = styled.span``;

const SummaryValue = styled.span``;

const SummaryDivider = styled.hr`
  border: none;
  border-top: 1px solid var(--grey-light);
  margin: 15px 0;
`;

const CheckoutButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 10px;
  
  &:hover {
    background-color: var(--primary-dark);
  }
`;

export default CartPage; 