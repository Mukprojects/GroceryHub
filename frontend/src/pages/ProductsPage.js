import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getProducts } from '../features/products/productSlice';
import { getCategories } from '../features/categories/categorySlice';
import ProductCard from '../components/products/ProductCard';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';
import { FaFilter, FaSearch, FaSortAmountDown, FaTimes } from 'react-icons/fa';

const ProductsPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  
  const { products, isLoading, pagination } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);
  
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    sort: '-createdAt', // Default sort by newest
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);
  
  useEffect(() => {
    // Parse query parameters from URL
    const searchParams = new URLSearchParams(location.search);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';
    const sort = searchParams.get('sort') || '-createdAt';
    const page = parseInt(searchParams.get('page')) || 1;
    
    setFilters({
      search,
      category,
      minPrice,
      maxPrice,
      sort,
    });
    
    setCurrentPage(page);
    
    // Fetch products with filters
    dispatch(
      getProducts({
        page,
        search,
        category,
        minPrice,
        maxPrice,
        sort,
      })
    );
  }, [dispatch, location.search]);
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const applyFilters = () => {
    const searchParams = new URLSearchParams();
    
    if (filters.search) searchParams.append('search', filters.search);
    if (filters.category) searchParams.append('category', filters.category);
    if (filters.minPrice) searchParams.append('minPrice', filters.minPrice);
    if (filters.maxPrice) searchParams.append('maxPrice', filters.maxPrice);
    if (filters.sort) searchParams.append('sort', filters.sort);
    
    // Reset to page 1 when filters change
    searchParams.append('page', 1);
    
    navigate(`/products?${searchParams.toString()}`);
    setShowFilters(false);
  };
  
  const resetFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      sort: '-createdAt',
    });
    
    navigate('/products');
    setShowFilters(false);
  };
  
  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.pages) return;
    
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('page', page);
    
    navigate(`/products?${searchParams.toString()}`);
    setCurrentPage(page);
    
    // Scroll to top
    window.scrollTo(0, 0);
  };
  
  return (
    <ProductsPageContainer>
      <div className="container">
        <HeaderSection>
          <h1>Our Products</h1>
          <FilterToggle onClick={() => setShowFilters(!showFilters)}>
            {showFilters ? <FaTimes /> : <FaFilter />}
            {showFilters ? 'Close Filters' : 'Filters'}
          </FilterToggle>
        </HeaderSection>
        
        <ContentContainer>
          <FiltersSection className={showFilters ? 'show' : ''}>
            <h3>Filters</h3>
            
            <FormGroup>
              <label htmlFor="search">Search</label>
              <SearchInputContainer>
                <SearchInput
                  type="text"
                  id="search"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search products..."
                />
                <SearchIcon>
                  <FaSearch />
                </SearchIcon>
              </SearchInputContainer>
            </FormGroup>
            
            <FormGroup>
              <label htmlFor="category">Category</label>
              <Select
                id="category"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category._id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </FormGroup>
            
            <FormGroup>
              <label htmlFor="minPrice">Min Price</label>
              <Input
                type="number"
                id="minPrice"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="Min Price"
                min="0"
              />
            </FormGroup>
            
            <FormGroup>
              <label htmlFor="maxPrice">Max Price</label>
              <Input
                type="number"
                id="maxPrice"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="Max Price"
                min="0"
              />
            </FormGroup>
            
            <FormGroup>
              <label htmlFor="sort">Sort By</label>
              <Select
                id="sort"
                name="sort"
                value={filters.sort}
                onChange={handleFilterChange}
              >
                <option value="-createdAt">Newest</option>
                <option value="createdAt">Oldest</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="-averageRating">Highest Rated</option>
              </Select>
            </FormGroup>
            
            <FilterActions>
              <button
                type="button"
                className="btn btn-outline"
                onClick={resetFilters}
              >
                Reset
              </button>
              <button type="button" className="btn" onClick={applyFilters}>
                Apply Filters
              </button>
            </FilterActions>
          </FiltersSection>
          
          <ProductsSection>
            <SortBar>
              <div>
                <FaSortAmountDown />
                <span>Sort:</span>
                <Select
                  name="sort"
                  value={filters.sort}
                  onChange={(e) => {
                    handleFilterChange(e);
                    applyFilters();
                  }}
                  className="sort-select"
                >
                  <option value="-createdAt">Newest</option>
                  <option value="createdAt">Oldest</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="-averageRating">Highest Rated</option>
                </Select>
              </div>
              <ResultCount>
                {pagination.total} Products Found
              </ResultCount>
            </SortBar>
            
            {isLoading ? (
              <Loader />
            ) : products.length === 0 ? (
              <Message>No products found</Message>
            ) : (
              <ProductGrid>
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </ProductGrid>
            )}
            
            {pagination.pages > 1 && (
              <Pagination>
                <PaginationButton
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Prev
                </PaginationButton>
                
                <PageNumbers>
                  {[...Array(pagination.pages).keys()].map((x) => (
                    <PageNumber
                      key={x + 1}
                      active={x + 1 === currentPage}
                      onClick={() => handlePageChange(x + 1)}
                    >
                      {x + 1}
                    </PageNumber>
                  ))}
                </PageNumbers>
                
                <PaginationButton
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.pages}
                >
                  Next
                </PaginationButton>
              </Pagination>
            )}
          </ProductsSection>
        </ContentContainer>
      </div>
    </ProductsPageContainer>
  );
};

const ProductsPageContainer = styled.div`
  padding: 20px 0 40px;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  
  h1 {
    font-size: 2rem;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -10px;
      width: 60px;
      height: 3px;
      background-color: var(--primary-color);
    }
  }
`;

const FilterToggle = styled.button`
  display: none;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  @media (max-width: 768px) {
    display: flex;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  gap: 30px;
`;

const FiltersSection = styled.div`
  width: 250px;
  background-color: var(--white);
  border-radius: 8px;
  padding: 20px;
  box-shadow: var(--box-shadow);
  align-self: flex-start;
  position: sticky;
  top: 90px;
  
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
  
  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: -100%;
    bottom: 0;
    width: 80%;
    max-width: 300px;
    z-index: 1000;
    overflow-y: auto;
    transition: left 0.3s ease;
    
    &.show {
      left: 0;
    }
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid var(--grey);
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    border-color: var(--primary-color);
    outline: none;
  }
`;

const SearchInputContainer = styled.div`
  position: relative;
  width: 100%;
`;

const SearchInput = styled(Input)`
  padding-right: 35px;
`;

const SearchIcon = styled.div`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--grey-dark);
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid var(--grey);
  border-radius: 4px;
  font-size: 14px;
  background-color: var(--white);
  cursor: pointer;
  
  &:focus {
    border-color: var(--primary-color);
    outline: none;
  }
  
  &.sort-select {
    width: auto;
    padding: 5px 10px;
    margin-left: 10px;
  }
`;

const FilterActions = styled.div`
  display: flex;
  gap: 10px;
  
  button {
    flex: 1;
  }
`;

const ProductsSection = styled.div`
  flex: 1;
`;

const SortBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px 15px;
  background-color: var(--white);
  border-radius: 4px;
  box-shadow: var(--box-shadow);
  
  > div {
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

const ResultCount = styled.div`
  font-size: 14px;
  color: var(--grey-dark);
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 25px;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
`;

const PageNumbers = styled.div`
  display: flex;
  align-items: center;
`;

const PageNumber = styled.button`
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 5px;
  border-radius: 50%;
  border: none;
  background-color: ${(props) =>
    props.active ? 'var(--primary-color)' : 'var(--grey-light)'};
  color: ${(props) => (props.active ? 'var(--white)' : 'var(--dark-color)')};
  cursor: pointer;
  
  &:hover {
    background-color: ${(props) =>
      props.active ? 'var(--primary-dark)' : 'var(--grey)'};
  }
`;

const PaginationButton = styled.button`
  padding: 8px 15px;
  margin: 0 5px;
  background-color: var(--primary-color);
  color: var(--white);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  &:disabled {
    background-color: var(--grey);
    cursor: not-allowed;
  }
`;

export default ProductsPage; 