import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { toast } from 'react-toastify';

import { login } from '../features/auth/authSlice';
import Loader from '../components/common/Loader';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { user, loading, error, isError, message } = useSelector((state) => state.auth);
  
  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);
  
  useEffect(() => {
    if (error || (isError && message)) {
      toast.error(message || error || 'Login failed. Please try again.');
      console.error('Login error:', message || error);
    }
  }, [error, isError, message]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    console.log('Attempting login with:', { email });
    dispatch(login({ email, password }));
  };
  
  return (
    <LoginContainer>
      <FormContainer>
        <FormTitle>Sign In</FormTitle>
        
        {loading ? (
          <Loader />
        ) : (
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="email">Email Address</Label>
              <Input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormGroup>
            
            <Button type="submit" disabled={loading}>
              Sign In
            </Button>
            
            <FormText>
              Don't have an account? <FormLink to="/register">Sign Up</FormLink>
            </FormText>
          </Form>
        )}
      </FormContainer>
    </LoginContainer>
  );
};

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
`;

const FormContainer = styled.div`
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const FormTitle = styled.h1`
  font-size: 1.8rem;
  color: var(--dark-color);
  margin-bottom: 25px;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
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

const Button = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  &:disabled {
    background-color: var(--grey);
    cursor: not-allowed;
  }
`;

const FormText = styled.p`
  text-align: center;
  margin-top: 10px;
  color: var(--grey-dark);
`;

const FormLink = styled(Link)`
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

export default LoginPage; 