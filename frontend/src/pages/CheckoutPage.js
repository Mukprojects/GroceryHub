import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import emailjs from '@emailjs/browser';

import { createOrder, resetOrderState } from '../features/orders/orderSlice';
import { clearCart } from '../features/cart/cartSlice';
import Loader from '../components/common/Loader';
import OrderSuccess from '../components/common/OrderSuccess';

// EmailJS configuration constants
const EMAILJS_SERVICE_ID = 'service_default'; // Replace with your EmailJS service ID
const EMAILJS_TEMPLATE_ID = 'template_default'; // Replace with your EmailJS template ID
const EMAILJS_USER_ID = 'user_default'; // Replace with your EmailJS user ID

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { isLoading, isSuccess, isError, message, order } = useSelector((state) => state.orders);
  
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
    email: '',
  });
  
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  
  // Calculate prices
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingPrice = itemsPrice > 500 ? 0 : 50;
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    
    if (cartItems.length === 0 && !orderPlaced) {
      navigate('/cart');
    }
    
    if (isSuccess && order) {
      // Send confirmation email
      sendOrderConfirmationEmail(order, shippingAddress.email);
      
      // Show success message
      toast.success('Order placed successfully!');
      
      // Set order placed flag to prevent redirect back to cart
      setOrderPlaced(true);
      
      // Show success animation
      setShowSuccess(true);
      
      // Clear cart after successful order
      dispatch(clearCart());
      
      // Reset order state before navigating
      setTimeout(() => {
        dispatch(resetOrderState());
        // We'll let the user navigate manually from success screen
      }, 1500);
    }
    
    return () => {
      // Clean up order state when leaving the page
      if (isSuccess) {
        dispatch(resetOrderState());
      }
    };
  }, [user, navigate, cartItems, isSuccess, order, dispatch, shippingAddress.email, orderPlaced]);
  
  useEffect(() => {
    if (isError) {
      toast.error(message || 'Error creating order. Please try again.');
    }
  }, [isError, message]);
  
  const handleShippingChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleViewOrder = () => {
    navigate(`/order/${order._id}`);
  };
  
  // Function to send order confirmation email
  const sendOrderConfirmationEmail = (order, email) => {
    // Format order items for email
    const orderItemsList = order.orderItems.map(item => 
      `${item.name} (Qty: ${item.quantity}) - ₹${item.price.toFixed(2)}`
    ).join('\n');
    
    // Prepare email template parameters
    const templateParams = {
      to_email: email,
      to_name: user?.name || 'Valued Customer',
      order_id: order._id,
      order_items: orderItemsList,
      order_total: `₹${order.totalPrice.toFixed(2)}`,
      shipping_address: `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`,
      payment_method: order.paymentMethod
    };
    
    // Send email using EmailJS
    try {
      emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_USER_ID
      ).then(
        (response) => {
          console.log('Email sent successfully:', response);
          toast.success(`Order confirmation sent to ${email}`);
        },
        (error) => {
          console.error('Email sending failed:', error);
          toast.warning('Order placed, but email notification failed to send');
        }
      );
    } catch (error) {
      console.error('Error sending email:', error);
      // Don't show error to user since the order was still placed successfully
    }
    
    // As a fallback, log confirmation details to console
    console.log(`Order confirmation for order #${order._id} to ${email}`);
    console.log('Order details:', order);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if cart is empty
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    // Check if shipping address is filled
    const { address, city, postalCode, country, email } = shippingAddress;
    if (!address || !city || !postalCode || !country) {
      toast.error('Please fill in all shipping address fields');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    // Format the order items to include complete information
    const formattedOrderItems = cartItems.map(item => ({
      name: item.name,
      quantity: item.quantity,
      image: item.image,
      price: item.price,
      product: item.productId,
    }));
    
    try {
      // Show processing toast
      toast.info('Processing your order...', {
        autoClose: 2000
      });
      
      // Set order placed to true to prevent redirect
      setOrderPlaced(true);
      
      // Dispatch create order action
      dispatch(createOrder({
        orderItems: formattedOrderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      }));
    } catch (error) {
      toast.error('Error placing order. Please try again.');
      console.error('Order placement error:', error);
    }
  };
  
  if (showSuccess && order) {
    return (
      <CheckoutContainer>
        <CheckoutTitle>Order Confirmation</CheckoutTitle>
        <SuccessSection>
          <OrderSuccess 
            message="Order Placed Successfully!" 
            orderId={order._id} 
          />
          <ButtonContainer>
            <ViewOrderButton onClick={handleViewOrder}>
              View Order Details
            </ViewOrderButton>
            <ContinueShoppingButton onClick={() => navigate('/')}>
              Continue Shopping
            </ContinueShoppingButton>
          </ButtonContainer>
        </SuccessSection>
      </CheckoutContainer>
    );
  }
  
  return (
    <CheckoutContainer>
      <CheckoutTitle>Checkout</CheckoutTitle>
      
      {isLoading ? (
        <LoaderContainer>
          <Loader />
          <LoadingText>Processing your order...</LoadingText>
        </LoaderContainer>
      ) : (
        <CheckoutContent>
          <CheckoutForm onSubmit={handleSubmit}>
            <FormSection>
              <SectionTitle>Shipping Address</SectionTitle>
              
              <FormGroup>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter email for order confirmation"
                  value={shippingAddress.email}
                  onChange={handleShippingChange}
                  required
                />
                <HelpText>We'll send your order confirmation to this email</HelpText>
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="address">Address</Label>
                <Input
                  type="text"
                  id="address"
                  name="address"
                  placeholder="Enter address"
                  value={shippingAddress.address}
                  onChange={handleShippingChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="city">City</Label>
                <Input
                  type="text"
                  id="city"
                  name="city"
                  placeholder="Enter city"
                  value={shippingAddress.city}
                  onChange={handleShippingChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  placeholder="Enter postal code"
                  value={shippingAddress.postalCode}
                  onChange={handleShippingChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="country">Country</Label>
                <Input
                  type="text"
                  id="country"
                  name="country"
                  placeholder="Enter country"
                  value={shippingAddress.country}
                  onChange={handleShippingChange}
                  required
                />
              </FormGroup>
            </FormSection>
            
            <FormSection>
              <SectionTitle>Payment Method</SectionTitle>
              
              <PaymentOptions>
                <PaymentOption>
                  <input
                    type="radio"
                    id="cashOnDelivery"
                    name="paymentMethod"
                    value="Cash on Delivery"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <PaymentLabel htmlFor="cashOnDelivery">Cash on Delivery</PaymentLabel>
                </PaymentOption>
              </PaymentOptions>
            </FormSection>
            
            <OrderSummary>
              <SectionTitle>Order Summary</SectionTitle>
              
              {cartItems.length === 0 ? (
                <EmptyCartMessage>Your cart is empty</EmptyCartMessage>
              ) : (
                <>
                  <ItemsList>
                    {cartItems.map((item) => (
                      <OrderItem key={item.productId}>
                        <ItemName>{item.name}</ItemName>
                        <ItemQuantity>{item.quantity} x ₹{item.price.toFixed(2)}</ItemQuantity>
                        <ItemTotal>₹{(item.quantity * item.price).toFixed(2)}</ItemTotal>
                      </OrderItem>
                    ))}
                  </ItemsList>
                  
                  <SummaryDivider />
                  
                  <SummaryRow>
                    <SummaryLabel>Items</SummaryLabel>
                    <SummaryValue>₹{itemsPrice.toFixed(2)}</SummaryValue>
                  </SummaryRow>
                  
                  <SummaryRow>
                    <SummaryLabel>Shipping</SummaryLabel>
                    <SummaryValue>₹{shippingPrice.toFixed(2)}</SummaryValue>
                  </SummaryRow>
                  
                  <SummaryRow>
                    <SummaryLabel>Tax</SummaryLabel>
                    <SummaryValue>₹{taxPrice.toFixed(2)}</SummaryValue>
                  </SummaryRow>
                  
                  <SummaryDivider />
                  
                  <SummaryRow total>
                    <SummaryLabel>Total</SummaryLabel>
                    <SummaryValue>₹{totalPrice.toFixed(2)}</SummaryValue>
                  </SummaryRow>
                </>
              )}
              
              <PlaceOrderButton type="submit" disabled={isLoading || cartItems.length === 0}>
                {isLoading ? 'Processing...' : 'Place Order'}
              </PlaceOrderButton>
            </OrderSummary>
          </CheckoutForm>
        </CheckoutContent>
      )}
    </CheckoutContainer>
  );
};

const CheckoutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const CheckoutTitle = styled.h1`
  font-size: 1.8rem;
  color: var(--dark-color);
  margin-bottom: 30px;
`;

const CheckoutContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
`;

const CheckoutForm = styled.form`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const FormSection = styled.div`
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 1.3rem;
  color: var(--dark-color);
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
`;

const Label = styled.label`
  font-weight: 500;
  color: var(--dark-color);
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid var(--grey);
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    border-color: var(--primary-color);
    outline: none;
  }
`;

const HelpText = styled.small`
  color: var(--grey-dark);
  font-size: 0.85rem;
`;

const PaymentOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const PaymentOption = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const PaymentLabel = styled.label`
  font-weight: 400;
  cursor: pointer;
`;

const OrderSummary = styled.div`
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  height: fit-content;
  grid-column: 2;
  
  @media (max-width: 968px) {
    grid-column: 1;
  }
`;

const ItemsList = styled.div`
  margin-bottom: 20px;
  max-height: 200px;
  overflow-y: auto;
`;

const OrderItem = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid var(--grey-light);
  
  &:last-child {
    border-bottom: none;
  }
`;

const ItemName = styled.div`
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemQuantity = styled.div`
  font-size: 0.9rem;
  color: var(--grey-dark);
`;

const ItemTotal = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  text-align: right;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-weight: ${props => props.total ? '600' : '400'};
  font-size: ${props => props.total ? '1.1rem' : '1rem'};
`;

const SummaryLabel = styled.span``;

const SummaryValue = styled.span``;

const SummaryDivider = styled.hr`
  border: none;
  border-top: 1px solid var(--grey-light);
  margin: 15px 0;
`;

const PlaceOrderButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  margin-top: 20px;
  cursor: pointer;
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  &:disabled {
    background-color: var(--grey);
    cursor: not-allowed;
  }
`;

const SuccessSection = styled.div`
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  max-width: 600px;
  margin: 0 auto;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const ViewOrderButton = styled.button`
  padding: 12px 25px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  min-width: 200px;
  
  &:hover {
    background-color: var(--primary-dark);
  }
`;

const ContinueShoppingButton = styled.button`
  padding: 12px 25px;
  background-color: white;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  min-width: 200px;
  
  &:hover {
    background-color: var(--grey-light);
  }
`;

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
`;

const LoadingText = styled.p`
  margin-top: 20px;
  font-size: 1.1rem;
  color: var(--primary-color);
`;

const EmptyCartMessage = styled.div`
  text-align: center;
  padding: 20px 0;
  color: var(--grey-dark);
`;

export default CheckoutPage; 