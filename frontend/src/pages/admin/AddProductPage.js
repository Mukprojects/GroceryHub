import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaUpload } from 'react-icons/fa';

import { createProduct, resetAdminState } from '../../features/admin/adminSlice';
import Loader from '../../components/common/Loader';

const AddProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user } = useSelector((state) => state.auth);
  const { isLoading, isSuccess, isError, message } = useSelector((state) => state.admin);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    category: '',
    stock: '',
    image: '',
    brand: '',
  });
  
  const [previewImage, setPreviewImage] = useState('');
  
  useEffect(() => {
    // Redirect if user is not logged in
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Reset admin state on component mount
    dispatch(resetAdminState());
    
    // Handle success and errors
    if (isSuccess) {
      toast.success('Product added successfully!');
      navigate('/admin/products');
    }
    
    if (isError) {
      toast.error(message || 'Failed to add product');
    }
    
    // Cleanup on unmount
    return () => {
      dispatch(resetAdminState());
    };
  }, [user, navigate, dispatch, isSuccess, isError, message]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    // Create a preview URL for the image
    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);
    
    // In a real application, you would upload this to a server and get a URL back
    // For now, we'll just use the file name for demo purposes
    setFormData({
      ...formData,
      image: file.name,
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const { name, description, price, category, stock, image } = formData;
    
    // Basic validation
    if (!name || !description || !price || !category || !stock || !image) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Prepare product data
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : 0,
      stock: parseInt(formData.stock),
      // Generate a slug from the name
      slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
      // Add image URL (in a real app, this would be a full URL)
      image: `/images/products/${formData.image}`,
    };
    
    // Dispatch action to create product
    dispatch(createProduct(productData));
  };
  
  return (
    <PageContainer>
      <PageHeader>
        <BackButton onClick={() => navigate('/admin')}>
          <FaArrowLeft /> Back to Dashboard
        </BackButton>
        <PageTitle>Add New Product</PageTitle>
      </PageHeader>
      
      {isLoading ? (
        <LoaderWrapper>
          <Loader />
        </LoaderWrapper>
      ) : (
        <FormWrapper>
          <ProductForm onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="description">Description *</Label>
              <TextArea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
                rows="4"
                required
              />
            </FormGroup>
            
            <PriceContainer>
              <FormGroup>
                <Label htmlFor="price">Price (₹) *</Label>
                <Input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="discountPrice">Discount Price (₹)</Label>
                <Input
                  type="number"
                  id="discountPrice"
                  name="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </FormGroup>
            </PriceContainer>
            
            <FormGroupRow>
              <FormGroup>
                <Label htmlFor="category">Category *</Label>
                <Select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="fruits">Fruits</option>
                  <option value="vegetables">Vegetables</option>
                  <option value="dairy">Dairy</option>
                  <option value="bakery">Bakery</option>
                  <option value="meat">Meat</option>
                  <option value="beverages">Beverages</option>
                  <option value="snacks">Snacks</option>
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="stock">Stock *</Label>
                <Input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="Enter stock quantity"
                  min="0"
                  required
                />
              </FormGroup>
            </FormGroupRow>
            
            <FormGroup>
              <Label htmlFor="brand">Brand</Label>
              <Input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Enter brand name"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Product Image *</Label>
              <ImageUploadContainer>
                <ImagePreview>
                  {previewImage ? (
                    <PreviewImg src={previewImage} alt="Product preview" />
                  ) : (
                    <UploadPlaceholder>
                      <FaUpload />
                      <span>Upload Image</span>
                    </UploadPlaceholder>
                  )}
                </ImagePreview>
                <UploadInput
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />
                <UploadButton type="button" onClick={() => document.getElementById('image').click()}>
                  Choose File
                </UploadButton>
              </ImageUploadContainer>
            </FormGroup>
            
            <ButtonGroup>
              <SubmitButton type="submit" disabled={isLoading}>
                {isLoading ? 'Adding...' : 'Add Product'}
              </SubmitButton>
              <CancelButton type="button" onClick={() => navigate('/admin')}>
                Cancel
              </CancelButton>
            </ButtonGroup>
          </ProductForm>
        </FormWrapper>
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

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 50px 0;
`;

const FormWrapper = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 30px;
`;

const ProductForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FormGroupRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
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

const TextArea = styled.textarea`
  padding: 12px;
  border: 1px solid var(--grey);
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    border-color: var(--primary-color);
    outline: none;
  }
`;

const Select = styled.select`
  padding: 12px;
  border: 1px solid var(--grey);
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    border-color: var(--primary-color);
    outline: none;
  }
`;

const PriceContainer = styled(FormGroupRow)``;

const ImageUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ImagePreview = styled.div`
  width: 100%;
  height: 200px;
  border: 2px dashed var(--grey);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const PreviewImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const UploadPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: var(--grey-dark);
  
  svg {
    font-size: 2rem;
  }
`;

const UploadInput = styled.input`
  display: none;
`;

const UploadButton = styled.button`
  padding: 12px;
  background-color: var(--grey-light);
  color: var(--dark-color);
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background-color: var(--grey);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const SubmitButton = styled.button`
  padding: 12px 25px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  &:disabled {
    background-color: var(--grey);
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  padding: 12px 25px;
  background-color: white;
  color: var(--dark-color);
  border: 1px solid var(--grey);
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background-color: var(--grey-light);
  }
`;

export default AddProductPage; 