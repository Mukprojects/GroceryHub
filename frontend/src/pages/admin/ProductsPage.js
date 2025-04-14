import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { getAllProducts } from '../../features/admin/adminSlice';

const ProductsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { allProducts, isLoading } = useSelector((state) => state.admin);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterCategory, setFilterCategory] = useState('');
  const productsPerPage = 10;

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  // Get unique categories
  const categories = [...new Set(allProducts.map(product => product.category))];

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get sort icon based on current sort state
  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort />;
    return sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };

  // Filter and sort products
  const filteredProducts = allProducts
    .filter(product => 
      (searchTerm === '' || 
       product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       product.brand.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterCategory === '' || product.category === filterCategory)
    )
    .sort((a, b) => {
      const aValue = a[sortField] || '';
      const bValue = b[sortField] || '';
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return sortDirection === 'asc' 
        ? aValue.toString().localeCompare(bValue.toString())
        : bValue.toString().localeCompare(aValue.toString());
    });

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container>
      <Header>
        <h1>Products Management</h1>
        <AddButton to="/admin/product/new">
          <FaPlus /> Add New Product
        </AddButton>
      </Header>

      <Controls>
        <SearchContainer>
          <SearchIcon>
            <FaSearch />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search by name or brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>
        
        <FilterContainer>
          <FilterSelect
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </FilterSelect>
        </FilterContainer>
      </Controls>

      {isLoading ? (
        <Loading>Loading products...</Loading>
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                <TableHeader onClick={() => handleSort('_id')}>
                  ID {getSortIcon('_id')}
                </TableHeader>
                <TableHeader onClick={() => handleSort('name')}>
                  Name {getSortIcon('name')}
                </TableHeader>
                <TableHeader onClick={() => handleSort('price')}>
                  Price {getSortIcon('price')}
                </TableHeader>
                <TableHeader onClick={() => handleSort('category')}>
                  Category {getSortIcon('category')}
                </TableHeader>
                <TableHeader onClick={() => handleSort('brand')}>
                  Brand {getSortIcon('brand')}
                </TableHeader>
                <TableHeader onClick={() => handleSort('countInStock')}>
                  Stock {getSortIcon('countInStock')}
                </TableHeader>
                <TableHeader>Actions</TableHeader>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>{product._id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>${product.price?.toFixed(2)}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.brand}</TableCell>
                  <TableCell>
                    <StockIndicator inStock={product.countInStock > 0}>
                      {product.countInStock}
                    </StockIndicator>
                  </TableCell>
                  <TableCell>
                    <ActionButtons>
                      <EditButton onClick={() => navigate(`/admin/product/${product._id}/edit`)}>
                        <FaEdit />
                      </EditButton>
                      <DeleteButton>
                        <FaTrash />
                      </DeleteButton>
                    </ActionButtons>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>

          <Pagination>
            <PaginationButton 
              disabled={currentPage === 1} 
              onClick={() => paginate(currentPage - 1)}
            >
              Previous
            </PaginationButton>
            
            <PageInfo>
              Page {currentPage} of {totalPages || 1}
            </PageInfo>
            
            <PaginationButton 
              disabled={currentPage === totalPages || totalPages === 0} 
              onClick={() => paginate(currentPage + 1)}
            >
              Next
            </PaginationButton>
          </Pagination>
        </>
      )}
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  padding: 20px;
  background-color: var(--white);
  border-radius: 8px;
  box-shadow: var(--box-shadow);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h1 {
    font-size: 24px;
    color: var(--dark-color);
  }
`;

const AddButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: var(--primary-color);
  color: var(--white);
  padding: 10px 15px;
  border-radius: 4px;
  font-weight: 500;
  transition: var(--transition);

  &:hover {
    background-color: var(--primary-dark);
  }
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const SearchContainer = styled.div`
  position: relative;
  width: 300px;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--grey-dark);
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 10px 10px 35px;
  border: 1px solid var(--grey);
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    border-color: var(--primary-color);
    outline: none;
  }
`;

const FilterContainer = styled.div`
  width: 200px;
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid var(--grey);
  border-radius: 4px;
  font-size: 14px;
  background-color: var(--white);

  &:focus {
    border-color: var(--primary-color);
    outline: none;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 12px;
  background-color: var(--grey-light);
  border-bottom: 2px solid var(--grey);
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    background-color: var(--grey);
  }
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: var(--grey-light);
  }

  &:hover {
    background-color: rgba(76, 175, 80, 0.1);
  }
`;

const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid var(--grey);
`;

const StockIndicator = styled.span`
  color: ${(props) => (props.inStock ? 'var(--success-color)' : 'var(--danger-color)')};
  font-weight: ${(props) => (props.inStock ? 'normal' : 'bold')};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const EditButton = styled.button`
  background-color: var(--info-color);
  color: var(--white);
  border: none;
  border-radius: 4px;
  padding: 6px 10px;
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    opacity: 0.8;
  }
`;

const DeleteButton = styled.button`
  background-color: var(--danger-color);
  color: var(--white);
  border: none;
  border-radius: 4px;
  padding: 6px 10px;
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    opacity: 0.8;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
`;

const PaginationButton = styled.button`
  background-color: var(--primary-color);
  color: var(--white);
  border: none;
  border-radius: 4px;
  padding: 8px 15px;
  cursor: pointer;
  transition: var(--transition);

  &:hover:not(:disabled) {
    background-color: var(--primary-dark);
  }

  &:disabled {
    background-color: var(--grey);
    cursor: not-allowed;
  }
`;

const PageInfo = styled.div`
  font-size: 14px;
  color: var(--grey-dark);
`;

const Loading = styled.div`
  text-align: center;
  padding: 20px;
  font-size: 18px;
  color: var(--grey-dark);
`;

export default ProductsPage; 