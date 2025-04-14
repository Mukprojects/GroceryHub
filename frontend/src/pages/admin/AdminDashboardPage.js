import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaBox, FaShoppingCart, FaMoneyBillWave, FaUsers, FaChartLine } from 'react-icons/fa';

import { getOrderStatistics } from '../../features/admin/adminSlice';
import Loader from '../../components/common/Loader';

const AdminDashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user } = useSelector((state) => state.auth);
  const { orderStats, isLoading } = useSelector((state) => state.admin);
  
  useEffect(() => {
    // Redirect if user is not admin
    if (!user) {
      navigate('/login');
      return;
    }
    
    // For this demo, we're considering all logged-in users as admins
    // In a real app, you would check user.isAdmin or a similar role property
    
    // Fetch order statistics
    dispatch(getOrderStatistics());
  }, [user, navigate, dispatch]);
  
  if (isLoading) {
    return (
      <DashboardContainer>
        <DashboardTitle>Admin Dashboard</DashboardTitle>
        <LoaderWrapper>
          <Loader />
        </LoaderWrapper>
      </DashboardContainer>
    );
  }
  
  return (
    <DashboardContainer>
      <DashboardTitle>Admin Dashboard</DashboardTitle>
      
      <AdminActions>
        <ActionLink to="/admin/products">
          <FaBox /> Manage Products
        </ActionLink>
        <ActionLink to="/admin/orders">
          <FaShoppingCart /> View Orders
        </ActionLink>
        <ActionLink to="/admin/add-product">
          <FaBox /> Add New Product
        </ActionLink>
      </AdminActions>
      
      <StatsGrid>
        <StatCard>
          <StatIcon>
            <FaShoppingCart />
          </StatIcon>
          <StatContent>
            <StatValue>{orderStats.totalOrders}</StatValue>
            <StatLabel>Total Orders</StatLabel>
          </StatContent>
        </StatCard>
        
        <StatCard>
          <StatIcon>
            <FaMoneyBillWave />
          </StatIcon>
          <StatContent>
            <StatValue>₹{orderStats.totalSales.toFixed(2)}</StatValue>
            <StatLabel>Revenue</StatLabel>
          </StatContent>
        </StatCard>
        
        <StatCard>
          <StatIcon>
            <FaChartLine />
          </StatIcon>
          <StatContent>
            <StatValue>{orderStats.pendingOrders}</StatValue>
            <StatLabel>Pending Orders</StatLabel>
          </StatContent>
        </StatCard>
        
        <StatCard>
          <StatIcon className="completed">
            <FaBox />
          </StatIcon>
          <StatContent>
            <StatValue>{orderStats.deliveredOrders}</StatValue>
            <StatLabel>Delivered Orders</StatLabel>
          </StatContent>
        </StatCard>
      </StatsGrid>
      
      <SectionTitle>Quick Actions</SectionTitle>
      
      <ButtonsContainer>
        <ActionButton onClick={() => navigate('/admin/add-product')}>
          Add New Product
        </ActionButton>
        <ActionButton onClick={() => navigate('/admin/orders')}>
          View All Orders
        </ActionButton>
      </ButtonsContainer>
    </DashboardContainer>
  );
};

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const DashboardTitle = styled.h1`
  font-size: 1.8rem;
  color: var(--dark-color);
  margin-bottom: 30px;
`;

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 50px 0;
`;

const AdminActions = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ActionLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 25px;
  background-color: var(--primary-color);
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  svg {
    font-size: 1.2rem;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 40px;
  
  @media (max-width: 968px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const StatIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: rgba(76, 175, 80, 0.1);
  color: var(--primary-color);
  font-size: 1.5rem;
  margin-right: 15px;
  
  &.completed {
    background-color: rgba(33, 150, 243, 0.1);
    color: #2196f3;
  }
`;

const StatContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--dark-color);
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: var(--grey-dark);
  margin-top: 5px;
`;

const SectionTitle = styled.h2`
  font-size: 1.3rem;
  color: var(--dark-color);
  margin-bottom: 20px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 15px;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const ActionButton = styled.button`
  padding: 12px 20px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background-color: var(--primary-dark);
  }
`;

export default AdminDashboardPage; 