import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { FaFilter } from 'react-icons/fa';

import { getProducts } from '../features/products/productSlice';
import { getCategoryBySlug } from '../features/categories/categorySlice';
import ProductCard from '../components/products/ProductCard';
import Loader from '../components/common/Loader';

const CategoryPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  
  const { loading: productsLoading, products, error: productsError } = useSelector(
    (state) => state.products
  );
  
  const { loading: categoryLoading, selectedCategory, error: categoryError } = useSelector(
    (state) => state.categories
  );
  
  const [sortOption, setSortOption] = useState('latest');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  useEffect(() => {
    if (slug) {
      console.log(`Loading category with slug: ${slug}`);
      dispatch(getCategoryBySlug(slug));
      dispatch(getProducts({ categorySlug: slug }));
    }
  }, [dispatch, slug]);
  
  useEffect(() => {
    if (products) {
      console.log(`Filtered products: ${products.length}`);
      const filtered = [...products];
      
      // Filter by price range
      const inPriceRange = filtered.filter(
        product => product.price >= priceRange[0] && product.price <= priceRange[1]
      );
      
      // Sort products
      switch (sortOption) {
        case 'price-low':
          inPriceRange.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          inPriceRange.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          inPriceRange.sort((a, b) => b.rating - a.rating);
          break;
        case 'latest':
        default:
          // Assuming createdAt is available
          inPriceRange.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
      }
      
      setFilteredProducts(inPriceRange);
    }
  }, [products, sortOption, priceRange]);
  
  const handlePriceChange = (e, index) => {
    const newPriceRange = [...priceRange];
    newPriceRange[index] = Number(e.target.value);
    setPriceRange(newPriceRange);
  };
  
  const isLoading = productsLoading || categoryLoading;
  const error = productsError || categoryError;
  
  if (isLoading) return <Loader />;
  
  if (error) return <ErrorMessage>{error}</ErrorMessage>;
  
  if (!selectedCategory) return <ErrorMessage>Category not found</ErrorMessage>;
  
  return (
    <CategoryContainer>
      <CategoryHeader>
        <CategoryTitle>{selectedCategory.name}</CategoryTitle>
        <CategoryDescription>{selectedCategory.description}</CategoryDescription>
      </CategoryHeader>
      
      <ContentWrapper>
        <Sidebar>
          <FilterSection>
            <FilterTitle>
              <FaFilter /> Filters
            </FilterTitle>
            
            <FilterGroup>
              <FilterLabel>Price Range</FilterLabel>
              <PriceInputs>
                <PriceInput
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange(e, 0)}
                  min="0"
                  placeholder="Min"
                />
                <span>to</span>
                <PriceInput
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(e, 1)}
                  min="0"
                  placeholder="Max"
                />
              </PriceInputs>
              <PriceRangeSlider
                type="range"
                min="0"
                max="1000"
                value={priceRange[1]}
                onChange={(e) => handlePriceChange(e, 1)}
              />
            </FilterGroup>
          </FilterSection>
        </Sidebar>
        
        <MainContent>
          <SortContainer>
            <SortLabel>Sort by:</SortLabel>
            <SortSelect
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="latest">Latest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </SortSelect>
          </SortContainer>
          
          {filteredProducts.length === 0 ? (
            <NoProducts>No products found in this category</NoProducts>
          ) : (
            <ProductsGrid>
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </ProductsGrid>
          )}
        </MainContent>
      </ContentWrapper>
    </CategoryContainer>
  );
};

const CategoryContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const CategoryHeader = styled.div`
  margin-bottom: 30px;
  text-align: center;
`;

const CategoryTitle = styled.h1`
  font-size: 2rem;
  color: var(--dark-color);
  margin-bottom: 10px;
`;

const CategoryDescription = styled.p`
  color: var(--grey-dark);
  line-height: 1.6;
`;

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 30px;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.aside`
  @media (max-width: 968px) {
    order: 1;
  }
`;

const FilterSection = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const FilterTitle = styled.h3`
  font-size: 1.1rem;
  color: var(--dark-color);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FilterGroup = styled.div`
  margin-bottom: 20px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterLabel = styled.label`
  display: block;
  font-weight: 500;
  margin-bottom: 10px;
`;

const PriceInputs = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`;

const PriceInput = styled.input`
  width: 70px;
  padding: 8px;
  border: 1px solid var(--grey);
  border-radius: 4px;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const PriceRangeSlider = styled.input`
  width: 100%;
  margin: 10px 0;
`;

const MainContent = styled.main`
  @media (max-width: 968px) {
    order: 2;
  }
`;

const SortContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const SortLabel = styled.span`
  margin-right: 10px;
  font-weight: 500;
`;

const SortSelect = styled.select`
  padding: 8px 10px;
  border: 1px solid var(--grey);
  border-radius: 4px;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const NoProducts = styled.div`
  text-align: center;
  padding: 40px;
  background-color: white;
  border-radius: 8px;
  color: var(--grey-dark);
  font-size: 1.1rem;
`;

const ErrorMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: var(--danger-color);
  font-weight: 500;
`;

export default CategoryPage; 