import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaBars, FaTimes, FaSearch } from 'react-icons/fa';
import styled from 'styled-components';
import { logout, reset } from '../../features/auth/authSlice';
import { getCategories } from '../../features/categories/categorySlice';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const { categories } = useSelector((state) => state.categories);
  
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);
  
  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${searchTerm}`);
      setSearchTerm('');
      setIsMobileMenuOpen(false);
    }
  };
  
  return (
    <HeaderContainer>
      <div className="container">
        <HeaderContent>
          <Logo>
            <Link to="/">
              <h1>GroceryHub</h1>
            </Link>
          </Logo>
          
          <SearchForm onSubmit={handleSearch}>
            <SearchInput
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchButton type="submit">
              <FaSearch />
            </SearchButton>
          </SearchForm>
          
          <NavMenu className={isMobileMenuOpen ? 'active' : ''}>
            <ul>
              <li>
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" onClick={() => setIsMobileMenuOpen(false)}>
                  Products
                </Link>
              </li>
            </ul>
          </NavMenu>
          
          <NavActions>
            <CartLink to="/cart">
              <FaShoppingCart />
              {cartItems.length > 0 && (
                <CartBadge>{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</CartBadge>
              )}
            </CartLink>
            
            {user ? (
              <UserMenu>
                <UserMenuToggle onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                  <FaUser />
                  <span>{user.name ? user.name.split(' ')[0] : 'User'}</span>
                </UserMenuToggle>
                <UserMenuDropdown className={isDropdownOpen ? 'show' : ''}>
                  <li>
                    <Link to="/profile" onClick={() => setIsDropdownOpen(false)}>
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin" onClick={() => setIsDropdownOpen(false)}>
                      Admin Panel
                    </Link>
                  </li>
                  <li>
                    <button type="button" onClick={onLogout}>
                      <FaSignOutAlt /> Logout
                    </button>
                  </li>
                </UserMenuDropdown>
              </UserMenu>
            ) : (
              <AuthLinks>
                <Link to="/login" className="btn btn-sm">
                  Login
                </Link>
                <Link to="/register" className="btn btn-outline btn-sm">
                  Register
                </Link>
              </AuthLinks>
            )}
            
            <MobileMenuToggle
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </MobileMenuToggle>
          </NavActions>
        </HeaderContent>
      </div>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  background-color: var(--white);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 15px 0;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div`
  a {
    display: flex;
    align-items: center;
    text-decoration: none;
    
    h1 {
      color: var(--primary-color);
      font-size: 24px;
      margin: 0;
    }
  }
`;

const SearchForm = styled.form`
  display: flex;
  margin: 0 20px;
  flex: 1;
  max-width: 500px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 10px 15px;
  border: 1px solid var(--grey);
  border-right: none;
  border-radius: 4px 0 0 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const SearchButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0 15px;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  
  &:hover {
    background-color: var(--primary-dark);
  }
`;

const NavMenu = styled.nav`
  @media (max-width: 768px) {
    position: fixed;
    top: 70px;
    left: -100%;
    width: 70%;
    height: calc(100vh - 70px);
    background-color: var(--white);
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    transition: left 0.3s ease;
    z-index: 99;
    
    &.active {
      left: 0;
    }
    
    ul {
      flex-direction: column;
      padding: 20px;
      
      li {
        margin: 15px 0;
      }
    }
  }
  
  ul {
    display: flex;
    gap: 20px;
    
    li {
      position: relative;
      
      a, button {
        color: var(--dark-color);
        text-decoration: none;
        font-weight: 500;
        transition: color 0.3s ease;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        font-size: 16px;
        display: flex;
        align-items: center;
        
        &:hover {
          color: var(--primary-color);
        }
      }
      
      &.dropdown {
        position: relative;
        
        .dropdown-toggle {
          display: flex;
          align-items: center;
          
          &::after {
            content: '▼';
            font-size: 10px;
            margin-left: 5px;
          }
        }
        
        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          min-width: 200px;
          background-color: var(--white);
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          border-radius: 4px;
          padding: 10px 0;
          display: none;
          flex-direction: column;
          gap: 0;
          z-index: 10;
          
          &.show {
            display: block;
          }
          
          li {
            margin: 0;
            
            a {
              padding: 8px 15px;
              display: block;
              
              &:hover {
                background-color: var(--grey-light);
              }
            }
          }
        }
      }
    }
  }
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const CartLink = styled(Link)`
  position: relative;
  color: var(--dark-color);
  font-size: 20px;
  
  &:hover {
    color: var(--primary-color);
  }
`;

const CartBadge = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: var(--primary-color);
  color: white;
  font-size: 10px;
  font-weight: bold;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AuthLinks = styled.div`
  display: flex;
  gap: 10px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const UserMenu = styled.div`
  position: relative;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const UserMenuToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: none;
  color: var(--dark-color);
  font-size: 16px;
  cursor: pointer;
  
  &:hover {
    color: var(--primary-color);
  }
`;

const UserMenuDropdown = styled.ul`
  position: absolute;
  top: 100%;
  right: 0;
  min-width: 150px;
  background-color: var(--white);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 10px 0;
  display: none;
  z-index: 10;
  
  &.show {
    display: block;
  }
  
  li {
    margin: 0;
    
    a, button {
      padding: 8px 15px;
      display: flex;
      align-items: center;
      gap: 5px;
      color: var(--dark-color);
      text-decoration: none;
      font-weight: normal;
      width: 100%;
      text-align: left;
      border: none;
      background: none;
      cursor: pointer;
      transition: background-color 0.3s ease;
      
      &:hover {
        background-color: var(--grey-light);
        color: var(--primary-color);
      }
    }
  }
`;

const MobileMenuToggle = styled.button`
  display: none;
  background: none;
  border: none;
  color: var(--dark-color);
  font-size: 20px;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

export default Header; 