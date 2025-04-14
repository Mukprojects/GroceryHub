import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <div className="container">
        <FooterContent>
          <FooterSection>
            <h3>GroceryHub</h3>
            <p>Your one-stop shop for fresh groceries delivered to your doorstep. We provide high-quality fruits, vegetables, dairy, and more at competitive prices.</p>
            <SocialLinks>
              <SocialLink href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebook />
              </SocialLink>
              <SocialLink href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </SocialLink>
              <SocialLink href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </SocialLink>
            </SocialLinks>
          </FooterSection>
          
          <FooterSection>
            <h3>Quick Links</h3>
            <FooterLinks>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/products">Products</Link>
              </li>
              <li>
                <Link to="/cart">Cart</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </FooterLinks>
          </FooterSection>
          
          <FooterSection>
            <h3>Categories</h3>
            <FooterLinks>
              <li>
                <Link to="/category/fruits">Fruits</Link>
              </li>
              <li>
                <Link to="/category/vegetables">Vegetables</Link>
              </li>
              <li>
                <Link to="/category/dairy">Dairy</Link>
              </li>
              <li>
                <Link to="/category/bakery">Bakery</Link>
              </li>
              <li>
                <Link to="/category/beverages">Beverages</Link>
              </li>
            </FooterLinks>
          </FooterSection>
          
          <FooterSection>
            <h3>Contact Us</h3>
            <ContactInfo>
              <ContactItem>
                <FaMapMarkerAlt />
                <p>123 Grocery Street, Foodville, FV 12345</p>
              </ContactItem>
              <ContactItem>
                <FaPhone />
                <p>+1 (123) 456-7890</p>
              </ContactItem>
              <ContactItem>
                <FaEnvelope />
                <p>support@groceryhub.com</p>
              </ContactItem>
            </ContactInfo>
          </FooterSection>
        </FooterContent>
        
        <FooterBottom>
          <p>&copy; {currentYear} GroceryHub. All rights reserved.</p>
          <FooterBottomLinks>
            <li>
              <Link to="/privacy">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/terms">Terms of Service</Link>
            </li>
          </FooterBottomLinks>
        </FooterBottom>
      </div>
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  background-color: var(--dark-color);
  color: var(--light-color);
  padding: 50px 0 20px;
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
`;

const FooterSection = styled.div`
  h3 {
    color: var(--white);
    font-size: 18px;
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
  
  p {
    font-size: 14px;
    line-height: 1.6;
    margin-bottom: 20px;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 15px;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--white);
  transition: var(--transition);
  
  &:hover {
    background-color: var(--primary-color);
    transform: translateY(-3px);
  }
`;

const FooterLinks = styled.ul`
  li {
    margin-bottom: 10px;
    
    a {
      color: var(--grey);
      text-decoration: none;
      transition: var(--transition);
      font-size: 14px;
      
      &:hover {
        color: var(--primary-color);
        padding-left: 5px;
      }
    }
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  
  svg {
    margin-top: 3px;
    color: var(--primary-light);
  }
  
  p {
    margin: 0;
    font-size: 14px;
  }
`;

const FooterBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 20px;
  
  p {
    font-size: 14px;
    margin: 0;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
`;

const FooterBottomLinks = styled.ul`
  display: flex;
  gap: 20px;
  
  li {
    a {
      color: var(--grey);
      text-decoration: none;
      font-size: 14px;
      transition: var(--transition);
      
      &:hover {
        color: var(--primary-color);
      }
    }
  }
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

export default Footer; 