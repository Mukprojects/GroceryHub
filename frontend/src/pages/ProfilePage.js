import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';

import { register } from '../features/auth/authSlice';
import Loader from '../components/common/Loader';

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user, loading, error } = useSelector((state) => state.auth);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user, navigate]);
  
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  
  const validatePassword = (password) => {
    if (password && password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return false;
    }
    setPasswordError('');
    return true;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (password && !validatePassword(password)) {
      toast.error(passwordError);
      return;
    }
    
    // If password is empty, don't update it
    const userData = {
      name,
      email,
      ...(password && { password })
    };
    
    // Use register with the updated user data 
    // This will replace the current user information
    dispatch(register(userData));
    toast.success('Profile updated successfully');
  };
  
  return (
    <ProfileContainer>
      <ProfileTitle>My Profile</ProfileTitle>
      
      {loading ? (
        <Loader />
      ) : (
        <ProfileContent>
          <FormContainer>
            <FormTitle>Update Profile</FormTitle>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="name">Name</Label>
                <Input
                  type="text"
                  id="name"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  placeholder="Enter new password (leave blank to keep current)"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validatePassword(e.target.value);
                  }}
                />
                {passwordError && <ErrorText>{passwordError}</ErrorText>}
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </FormGroup>
              
              <UpdateButton type="submit" disabled={loading}>
                Update Profile
              </UpdateButton>
            </Form>
          </FormContainer>
        </ProfileContent>
      )}
    </ProfileContainer>
  );
};

const ProfileContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const ProfileTitle = styled.h1`
  font-size: 1.8rem;
  color: var(--dark-color);
  margin-bottom: 30px;
`;

const ProfileContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
`;

const FormContainer = styled.div`
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const FormTitle = styled.h2`
  font-size: 1.3rem;
  color: var(--dark-color);
  margin-bottom: 20px;
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

const UpdateButton = styled.button`
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

const ErrorText = styled.p`
  color: var(--danger-color);
  font-size: 0.85rem;
  margin-top: 5px;
`;

export default ProfilePage; 