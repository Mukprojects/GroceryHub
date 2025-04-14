import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowLeft, FaSearch, FaSort, FaEye } from 'react-icons/fa';
import { format } from 'date-fns';

import { getAllOrders } from '../../features/admin/adminSlice';
import Loader from '../../components/common/Loader';

const OrdersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user } = useSelector((state) => state.auth);
  const { allOrders, isLoading } = useSelector((state) => state.admin);
  
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'desc',
  });
  
  useEffect(() => {
    // Redirect if user is not logged in
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Fetch all orders
    dispatch(getAllOrders());
  }, [user, navigate, dispatch]);
  
  useEffect(() => {
    // Apply filters and sorting to orders
    let result = [...allOrders];
    
    // Apply search filter
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      result = result.filter(
        (order) =>
          order._id.toLowerCase().includes(lowerCaseSearch) ||
          (order.user?.name && order.user.name.toLowerCase().includes(lowerCaseSearch)) ||
          (order.user?.email && order.user.email.toLowerCase().includes(lowerCaseSearch))
      );
    }
    
    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        // Handle nested properties
        if (sortConfig.key === 'user.name') {
          aValue = a.user?.name || '';
          bValue = b.user?.name || '';
        } else if (sortConfig.key === 'user.email') {
          aValue = a.user?.email || '';
          bValue = b.user?.email || '';
        }
        
        // Handle dates
        if (sortConfig.key === 'createdAt' || sortConfig.key === 'paidAt' || sortConfig.key === 'deliveredAt') {
          aValue = aValue ? new Date(aValue).getTime() : 0;
          bValue = bValue ? new Date(bValue).getTime() : 0;
        }
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredOrders(result);
  }, [allOrders, searchTerm, sortConfig]);
  
  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
    }));
  };
  
  const handleViewOrder = (orderId) => {
    navigate(`/order/${orderId}`);
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Not Available';
    return format(new Date(dateString), 'dd MMM yyyy, h:mm a');
  };
  
  return (
    <PageContainer>
      <PageHeader>
        <BackButton onClick={() => navigate('/admin')}>
          <FaArrowLeft /> Back to Dashboard
        </BackButton>
        <PageTitle>All Orders</PageTitle>
      </PageHeader>
      
      <FilterContainer>
        <SearchContainer>
          <SearchIcon>
            <FaSearch />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search orders by ID, customer name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>
        
        <OrdersStats>
          <StatItem>
            Total Orders: <span>{allOrders.length}</span>
          </StatItem>
          <StatItem>
            Pending: <span>{allOrders.filter(order => !order.isDelivered).length}</span>
          </StatItem>
          <StatItem>
            Delivered: <span>{allOrders.filter(order => order.isDelivered).length}</span>
          </StatItem>
        </OrdersStats>
      </FilterContainer>
      
      {isLoading ? (
        <LoaderWrapper>
          <Loader />
        </LoaderWrapper>
      ) : filteredOrders.length === 0 ? (
        <NoOrdersMessage>
          {searchTerm ? 'No orders found for your search.' : 'No orders found.'}
        </NoOrdersMessage>
      ) : (
        <TableContainer>
          <OrdersTable>
            <thead>
              <tr>
                <TableHeader onClick={() => handleSort('_id')}>
                  Order ID {sortConfig.key === '_id' && (
                    <SortIcon direction={sortConfig.direction}>
                      <FaSort />
                    </SortIcon>
                  )}
                </TableHeader>
                <TableHeader onClick={() => handleSort('user.name')}>
                  Customer {sortConfig.key === 'user.name' && (
                    <SortIcon direction={sortConfig.direction}>
                      <FaSort />
                    </SortIcon>
                  )}
                </TableHeader>
                <TableHeader onClick={() => handleSort('createdAt')}>
                  Date {sortConfig.key === 'createdAt' && (
                    <SortIcon direction={sortConfig.direction}>
                      <FaSort />
                    </SortIcon>
                  )}
                </TableHeader>
                <TableHeader onClick={() => handleSort('totalPrice')}>
                  Total {sortConfig.key === 'totalPrice' && (
                    <SortIcon direction={sortConfig.direction}>
                      <FaSort />
                    </SortIcon>
                  )}
                </TableHeader>
                <TableHeader onClick={() => handleSort('isPaid')}>
                  Payment {sortConfig.key === 'isPaid' && (
                    <SortIcon direction={sortConfig.direction}>
                      <FaSort />
                    </SortIcon>
                  )}
                </TableHeader>
                <TableHeader onClick={() => handleSort('isDelivered')}>
                  Delivery {sortConfig.key === 'isDelivered' && (
                    <SortIcon direction={sortConfig.direction}>
                      <FaSort />
                    </SortIcon>
                  )}
                </TableHeader>
                <TableHeader>Actions</TableHeader>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>
                    <OrderID>{order._id.substring(0, 12)}...</OrderID>
                  </TableCell>
                  <TableCell>
                    <CustomerName>{order.user?.name || 'Guest User'}</CustomerName>
                    <CustomerEmail>{order.shippingAddress?.email || order.user?.email || 'No email'}</CustomerEmail>
                  </TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell>
                    <OrderPrice>₹{order.totalPrice?.toFixed(2)}</OrderPrice>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={order.isPaid ? 'success' : 'warning'}>
                      {order.isPaid ? 'Paid' : 'Pending'}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={order.isDelivered ? 'success' : 'warning'}>
                      {order.isDelivered ? 'Delivered' : 'Pending'}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    <ActionButton onClick={() => handleViewOrder(order._id)}>
                      <FaEye /> View
                    </ActionButton>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </OrdersTable>
        </TableContainer>
      )}
    </PageContainer>
  );
};

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: var(--primary-color);
  font-weight: 500;
  padding: 0;
  margin-bottom: 15px;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const PageTitle = styled.h1`
  font-size: 1.8rem;
  color: var(--dark-color);
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  flex-wrap: wrap;
  gap: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 500px;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--grey-dark);
`;

const SearchInput = styled.input`
  padding: 12px 12px 12px 40px;
  border: 1px solid var(--grey);
  border-radius: 4px;
  font-size: 1rem;
  width: 100%;
  
  &:focus {
    border-color: var(--primary-color);
    outline: none;
  }
`;

const OrdersStats = styled.div`
  display: flex;
  gap: 20px;
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const StatItem = styled.div`
  font-size: 0.9rem;
  color: var(--grey-dark);
  
  span {
    font-weight: 600;
    color: var(--dark-color);
  }
`;

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 50px 0;
`;

const NoOrdersMessage = styled.div`
  text-align: center;
  padding: 50px 0;
  color: var(--grey-dark);
  font-size: 1.1rem;
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
`;

const OrdersTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid var(--grey-light);
  color: var(--dark-color);
  font-weight: 600;
  cursor: pointer;
  position: relative;
  white-space: nowrap;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }
`;

const SortIcon = styled.span`
  margin-left: 5px;
  display: inline-block;
  transform: ${props => props.direction === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

const TableRow = styled.tr`
  &:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }
`;

const TableCell = styled.td`
  padding: 15px;
  border-bottom: 1px solid var(--grey-light);
  color: var(--dark-color);
`;

const OrderID = styled.div`
  font-family: monospace;
  font-weight: 600;
`;

const CustomerName = styled.div`
  font-weight: 500;
`;

const CustomerEmail = styled.div`
  font-size: 0.85rem;
  color: var(--grey-dark);
`;

const OrderPrice = styled.div`
  font-weight: 600;
  color: var(--primary-color);
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  background-color: ${props => props.status === 'success' 
    ? 'rgba(76, 175, 80, 0.1)' 
    : props.status === 'warning'
      ? 'rgba(255, 152, 0, 0.1)'
      : 'rgba(244, 67, 54, 0.1)'};
  color: ${props => props.status === 'success' 
    ? '#4caf50' 
    : props.status === 'warning'
      ? '#ff9800'
      : '#f44336'};
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  background-color: var(--primary-light);
  color: var(--primary-color);
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background-color: var(--primary-lighter);
  }
`;

export default OrdersPage; 