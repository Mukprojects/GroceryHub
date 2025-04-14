import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { FaArrowLeft } from 'react-icons/fa';

import { getOrderById } from '../features/orders/orderSlice';
import Loader from '../components/common/Loader';

const OrderPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  const { isLoading, isError, message, order } = useSelector((state) => state.orders);
  
  useEffect(() => {
    if (!order || order._id !== id) {
      dispatch(getOrderById(id));
    }
  }, [dispatch, id, order]);
  
  if (isLoading) return <Loader />;
  
  if (isError) return <ErrorMessage>{message || 'Error loading order'}</ErrorMessage>;
  
  if (!order) return <ErrorMessage>Order not found</ErrorMessage>;
  
  return (
    <OrderContainer>
      <BackLink to="/profile">
        <FaArrowLeft /> Back to Profile
      </BackLink>
      
      <OrderTitle>Order #{order._id}</OrderTitle>
      
      <OrderContent>
        <OrderDetails>
          <DetailSection>
            <SectionTitle>Shipping</SectionTitle>
            <AddressInfo>
              <p><strong>Name:</strong> {order.user?.name}</p>
              <p><strong>Email:</strong> {order.shippingAddress.email || order.user?.email}</p>
              <p>
                <strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
              </p>
              <DeliveryStatus delivered={order.isDelivered}>
                {order.isDelivered
                  ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}`
                  : 'Not Delivered'}
              </DeliveryStatus>
            </AddressInfo>
          </DetailSection>
          
          <DetailSection>
            <SectionTitle>Payment</SectionTitle>
            <PaymentInfo>
              <p><strong>Method:</strong> {order.paymentMethod}</p>
              <PaymentStatus paid={order.isPaid}>
                {order.isPaid
                  ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}`
                  : 'Not Paid'}
              </PaymentStatus>
            </PaymentInfo>
          </DetailSection>
          
          <DetailSection>
            <SectionTitle>Order Items</SectionTitle>
            <OrderItems>
              {order.orderItems.map((item) => (
                <OrderItem key={item._id || item.productId}>
                  <ItemImage src={item.image} alt={item.name} />
                  <ItemName>
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                  </ItemName>
                  <ItemPrice>
                    {item.quantity} x ₹{item.price} = ₹{(item.quantity * item.price).toFixed(2)}
                  </ItemPrice>
                </OrderItem>
              ))}
            </OrderItems>
          </DetailSection>
        </OrderDetails>
        
        <OrderSummary>
          <SummaryTitle>Order Summary</SummaryTitle>
          
          <SummaryRow>
            <SummaryLabel>Items</SummaryLabel>
            <SummaryValue>₹{order.itemsPrice?.toFixed(2)}</SummaryValue>
          </SummaryRow>
          
          <SummaryRow>
            <SummaryLabel>Shipping</SummaryLabel>
            <SummaryValue>₹{order.shippingPrice?.toFixed(2)}</SummaryValue>
          </SummaryRow>
          
          <SummaryRow>
            <SummaryLabel>Tax</SummaryLabel>
            <SummaryValue>₹{order.taxPrice?.toFixed(2)}</SummaryValue>
          </SummaryRow>
          
          <SummaryDivider />
          
          <SummaryRow total>
            <SummaryLabel>Total</SummaryLabel>
            <SummaryValue>₹{order.totalPrice?.toFixed(2)}</SummaryValue>
          </SummaryRow>
        </OrderSummary>
      </OrderContent>
    </OrderContainer>
  );
};

const OrderContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
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

const OrderTitle = styled.h1`
  font-size: 1.8rem;
  color: var(--dark-color);
  margin-bottom: 30px;
`;

const OrderContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const OrderDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const DetailSection = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const SectionTitle = styled.h2`
  font-size: 1.3rem;
  color: var(--dark-color);
  margin-bottom: 15px;
`;

const AddressInfo = styled.div`
  line-height: 1.6;
  
  p {
    margin-bottom: 8px;
  }
`;

const DeliveryStatus = styled.p`
  margin-top: 15px;
  padding: 8px;
  border-radius: 4px;
  background-color: ${props => props.delivered ? 'var(--success-light)' : 'var(--warning-light)'};
  color: ${props => props.delivered ? 'var(--success-color)' : 'var(--warning-color)'};
  display: inline-block;
`;

const PaymentInfo = styled.div`
  line-height: 1.6;
  
  p {
    margin-bottom: 8px;
  }
`;

const PaymentStatus = styled.p`
  margin-top: 15px;
  padding: 8px;
  border-radius: 4px;
  background-color: ${props => props.paid ? 'var(--success-light)' : 'var(--warning-light)'};
  color: ${props => props.paid ? 'var(--success-color)' : 'var(--warning-color)'};
  display: inline-block;
`;

const OrderItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const OrderItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--grey-light);
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const ItemImage = styled.img`
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 4px;
`;

const ItemName = styled.div`
  flex: 2;
  
  a {
    color: var(--dark-color);
    text-decoration: none;
    
    &:hover {
      color: var(--primary-color);
    }
  }
`;

const ItemPrice = styled.div`
  flex: 1;
  text-align: right;
  font-weight: 500;
`;

const OrderSummary = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  height: fit-content;
`;

const SummaryTitle = styled.h2`
  font-size: 1.3rem;
  color: var(--dark-color);
  margin-bottom: 20px;
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

const ErrorMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: var(--danger-color);
  font-weight: 500;
`;

export default OrderPage;