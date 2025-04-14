import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getFeaturedProducts } from '../features/products/productSlice';
import ProductCard from '../components/products/ProductCard';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';
import FruitBoxScene from '../components/three/FruitBoxScene';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const HomePage = () => {
  const dispatch = useDispatch();
  
  // Refs for GSAP animations
  const heroRef = useRef(null);
  const heroContentRef = useRef(null);
  const featuredRef = useRef(null);
  const featureRef = useRef(null);
  
  const { featuredProducts, isLoading: productsLoading } = useSelector(
    (state) => state.products
  );
  
  useEffect(() => {
    dispatch(getFeaturedProducts());
  }, [dispatch]);
  
  // GSAP animations
  useEffect(() => {
    // Hero section animation
    if (heroRef.current && heroContentRef.current) {
      gsap.fromTo(heroContentRef.current.children, 
        { 
          y: 100, 
          opacity: 0 
        },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1, 
          stagger: 0.2,
          ease: "power3.out"
        }
      );
    }
    
    // Featured section animation
    if (featuredRef.current) {
      gsap.fromTo(featuredRef.current,
        { 
          opacity: 0,
          y: 50
        },
        { 
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: featuredRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
    
    // Features section animation
    if (featureRef.current) {
      const featureCards = featureRef.current.querySelectorAll('.feature-card');
      
      gsap.fromTo(featureCards,
        { 
          opacity: 0,
          y: 50 
        },
        { 
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          scrollTrigger: {
            trigger: featureRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  }, []);
  
  return (
    <>
      <HeroSection ref={heroRef}>
        <div className="container">
          <HeroContent ref={heroContentRef}>
            <h1>Fresh Groceries Delivered to Your Doorstep</h1>
            <p>
              Shop from our wide range of fresh fruits, vegetables, dairy products,
              and more. Get them delivered to your home in no time!
            </p>
            <Link to="/products" className="btn btn-lg">
              Shop Now
            </Link>
          </HeroContent>
        </div>
      </HeroSection>
      
      {/* 3D Fruit Box Interactive Scene */}
      <section className="py-3">
        <div className="container">
          <SectionTitle textAlign="center">
            <h2>Shop Fresh Produce</h2>
            <p>Interact with our freshest picks - hover and click to explore</p>
          </SectionTitle>
          
          <FruitBoxScene />
        </div>
      </section>
      
      <section className="py-3" ref={featuredRef}>
        <div className="container">
          <SectionTitle>
            <h2>Featured Products</h2>
            <Link to="/products">View All</Link>
          </SectionTitle>
          
          {productsLoading ? (
            <Loader />
          ) : featuredProducts.length === 0 ? (
            <Message>No featured products found</Message>
          ) : (
            <ProductGrid>
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </ProductGrid>
          )}
        </div>
      </section>
      
      <FeatureSection ref={featureRef}>
        <div className="container">
          <FeatureGrid>
            <FeatureCard className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Free Delivery</h3>
              <p>Free delivery on orders above $50</p>
            </FeatureCard>
            
            <FeatureCard className="feature-card">
              <div className="feature-icon">🍎</div>
              <h3>Fresh Products</h3>
              <p>Handpicked fresh items every day</p>
            </FeatureCard>
            
            <FeatureCard className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Best Prices</h3>
              <p>Prices you can't beat in the market</p>
            </FeatureCard>
            
            <FeatureCard className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3>Easy Returns</h3>
              <p>Not satisfied? Get a refund easily</p>
            </FeatureCard>
          </FeatureGrid>
        </div>
      </FeatureSection>
    </>
  );
};

const HeroSection = styled.section`
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
    url('https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')
      center/cover no-repeat;
  padding: 120px 0;
  color: var(--white);
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(76, 175, 80, 0.3) 0%, rgba(0, 0, 0, 0) 70%);
  }
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  
  h1 {
    font-size: 3.5rem;
    margin-bottom: 25px;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
    
    @media (max-width: 768px) {
      font-size: 2.5rem;
    }
  }
  
  p {
    font-size: 1.3rem;
    margin-bottom: 35px;
    text-shadow: 0 1px 5px rgba(0, 0, 0, 0.5);
    
    @media (max-width: 768px) {
      font-size: 1.1rem;
    }
  }
  
  .btn {
    font-size: 1.2rem;
    padding: 15px 30px;
    border-radius: 30px;
    background-color: var(--primary-color);
    border: none;
    transition: transform 0.3s, box-shadow 0.3s;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 25px rgba(0, 0, 0, 0.3);
    }
  }
`;

const SectionTitle = styled.div`
  display: flex;
  flex-direction: ${props => props.textAlign === 'center' ? 'column' : 'row'};
  justify-content: ${props => props.textAlign === 'center' ? 'center' : 'space-between'};
  align-items: center;
  margin-bottom: 40px;
  text-align: ${props => props.textAlign || 'left'};
  
  h2 {
    font-size: 2rem;
    position: relative;
    margin-bottom: ${props => props.textAlign === 'center' ? '15px' : '0'};
    
    &::after {
      content: '';
      position: absolute;
      left: ${props => props.textAlign === 'center' ? '50%' : '0'};
      transform: ${props => props.textAlign === 'center' ? 'translateX(-50%)' : 'none'};
      bottom: -10px;
      width: 60px;
      height: 3px;
      background-color: var(--primary-color);
    }
  }
  
  p {
    color: var(--grey-dark);
    margin-top: 10px;
  }
  
  a {
    font-weight: 500;
    position: relative;
    
    &:after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 2px;
      background-color: var(--primary-color);
      transition: width 0.3s ease;
    }
    
    &:hover:after {
      width: 100%;
    }
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
`;

const FeatureSection = styled.section`
  background-color: #f9f9f9;
  padding: 80px 0;
  margin-top: 60px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 10% 10%, rgba(76, 175, 80, 0.1) 0%, rgba(255, 255, 255, 0) 50%),
      radial-gradient(circle at 90% 90%, rgba(255, 152, 0, 0.1) 0%, rgba(255, 255, 255, 0) 50%);
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  position: relative;
  z-index: 1;
`;

const FeatureCard = styled.div`
  background-color: white;
  padding: 30px 20px;
  border-radius: 12px;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  }
  
  .feature-icon {
    font-size: 2.5rem;
    margin-bottom: 20px;
  }
  
  h3 {
    font-size: 1.4rem;
    margin-bottom: 15px;
    color: var(--dark-color);
  }
  
  p {
    color: var(--grey-dark);
    font-size: 1rem;
  }
`;

export default HomePage; 