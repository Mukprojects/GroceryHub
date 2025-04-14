import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowLeft, FaSave, FaUpload, FaImage } from 'react-icons/fa';
import { createProduct, getProductById, updateProduct } from '../../features/admin/adminSlice';

const ProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isNewProduct = id === 'new';
  
  const { selectedProduct, isLoading, error } = useSelector((state) => state.admin);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    brand: '',
    category: '',
    countInStock: '',
    isFeatured: false,
    isOnSale: false,
    salePrice: '',
    nutrition: { calories: '', protein: '', carbs: '', fat: '' }
  });
  
  const [imagePreview, setImagePreview] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Populate form with product data when editing
  useEffect(() => {
    if (!isNewProduct) {
      dispatch(getProductById(id));
    }
  }, [dispatch, id, isNewProduct]);

  useEffect(() => {
    if (!isNewProduct && selectedProduct) {
      setFormData({
        name: selectedProduct.name || '',
        price: selectedProduct.price || '',
        description: selectedProduct.description || '',
        image: selectedProduct.image || '',
        brand: selectedProduct.brand || '',
        category: selectedProduct.category || '',
        countInStock: selectedProduct.countInStock || '',
        isFeatured: selectedProduct.isFeatured || false,
        isOnSale: selectedProduct.isOnSale || false,
        salePrice: selectedProduct.salePrice || '',
        nutrition: {
          calories: selectedProduct.nutrition?.calories || '',
          protein: selectedProduct.nutrition?.protein || '',
          carbs: selectedProduct.nutrition?.carbs || '',
          fat: selectedProduct.nutrition?.fat || ''
        }
      });
      
      if (selectedProduct.image) {
        setImagePreview(selectedProduct.image);
      }
    }
  }, [selectedProduct, isNewProduct]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('nutrition.')) {
      const nutritionField = name.split('.')[1];
      setFormData({
        ...formData,
        nutrition: {
          ...formData.nutrition,
          [nutritionField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name) errors.name = 'Name is required';
    if (!formData.price) errors.price = 'Price is required';
    else if (isNaN(formData.price) || formData.price <= 0) 
      errors.price = 'Price must be a positive number';
    
    if (!formData.category) errors.category = 'Category is required';
    if (!formData.brand) errors.brand = 'Brand is required';
    
    if (!formData.countInStock) errors.countInStock = 'Stock count is required';
    else if (isNaN(formData.countInStock) || parseInt(formData.countInStock) < 0)
      errors.countInStock = 'Stock count must be a non-negative number';
    
    if (formData.isOnSale && (!formData.salePrice || isNaN(formData.salePrice) || formData.salePrice <= 0))
      errors.salePrice = 'Sale price must be a positive number';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    
    // Create FormData for image upload
    const productData = new FormData();
    
    // Add all form fields to FormData
    Object.keys(formData).forEach(key => {
      if (key === 'nutrition') {
        productData.append(key, JSON.stringify(formData[key]));
      } else {
        productData.append(key, formData[key]);
      }
    });
    
    // Add uploaded image if there is one
    if (uploadedImage) {
      productData.append('image', uploadedImage);
    }
    
    try {
      if (isNewProduct) {
        await dispatch(createProduct(productData)).unwrap();
      } else {
        productData.append('_id', id);
        await dispatch(updateProduct({ id, productData })).unwrap();
      }
      navigate('/admin/products');
    } catch (error) {
      console.error('Failed to save product:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/admin/products')}>
          <FaArrowLeft /> Back to Products
        </BackButton>
        <h1>{isNewProduct ? 'Create New Product' : 'Edit Product'}</h1>
      </Header>

      {isLoading && !isNewProduct ? (
        <Loading>Loading product data...</Loading>
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : (
        <Form onSubmit={handleSubmit}>
          <FormGrid>
            <FormSection>
              <SectionTitle>Product Information</SectionTitle>
              
              <FormGroup>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={formErrors.name}
                />
                {formErrors.name && <ErrorText>{formErrors.name}</ErrorText>}
              </FormGroup>
              
              <FormRow>
                <FormGroup flex="1">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    error={formErrors.price}
                  />
                  {formErrors.price && <ErrorText>{formErrors.price}</ErrorText>}
                </FormGroup>
                
                <FormGroup flex="1">
                  <Label htmlFor="countInStock">Stock Count</Label>
                  <Input
                    type="number"
                    min="0"
                    id="countInStock"
                    name="countInStock"
                    value={formData.countInStock}
                    onChange={handleInputChange}
                    error={formErrors.countInStock}
                  />
                  {formErrors.countInStock && <ErrorText>{formErrors.countInStock}</ErrorText>}
                </FormGroup>
              </FormRow>
              
              <FormRow>
                <FormGroup flex="1">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    type="text"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    error={formErrors.category}
                  />
                  {formErrors.category && <ErrorText>{formErrors.category}</ErrorText>}
                </FormGroup>
                
                <FormGroup flex="1">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    type="text"
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    error={formErrors.brand}
                  />
                  {formErrors.brand && <ErrorText>{formErrors.brand}</ErrorText>}
                </FormGroup>
              </FormRow>
              
              <FormGroup>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </FormSection>
            
            <FormSection>
              <SectionTitle>Product Image</SectionTitle>
              
              <ImageUploadContainer>
                {imagePreview ? (
                  <ImagePreview src={imagePreview} alt="Product Preview" />
                ) : (
                  <ImagePlaceholder>
                    <FaImage size={48} />
                    <p>No image uploaded</p>
                  </ImagePlaceholder>
                )}
                
                <UploadButton htmlFor="image-upload">
                  <FaUpload /> Choose Image
                </UploadButton>
                <HiddenInput
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                
                <Input
                  type="text"
                  name="image"
                  placeholder="Or enter image URL"
                  value={formData.image}
                  onChange={handleInputChange}
                />
              </ImageUploadContainer>
            </FormSection>
            
            <FormSection>
              <SectionTitle>Additional Options</SectionTitle>
              
              <CheckboxGroup>
                <Checkbox
                  type="checkbox"
                  id="isFeatured"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleInputChange}
                />
                <CheckboxLabel htmlFor="isFeatured">Featured Product</CheckboxLabel>
              </CheckboxGroup>
              
              <CheckboxGroup>
                <Checkbox
                  type="checkbox"
                  id="isOnSale"
                  name="isOnSale"
                  checked={formData.isOnSale}
                  onChange={handleInputChange}
                />
                <CheckboxLabel htmlFor="isOnSale">On Sale</CheckboxLabel>
              </CheckboxGroup>
              
              {formData.isOnSale && (
                <FormGroup>
                  <Label htmlFor="salePrice">Sale Price ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    id="salePrice"
                    name="salePrice"
                    value={formData.salePrice}
                    onChange={handleInputChange}
                    error={formErrors.salePrice}
                  />
                  {formErrors.salePrice && <ErrorText>{formErrors.salePrice}</ErrorText>}
                </FormGroup>
              )}
            </FormSection>
            
            <FormSection>
              <SectionTitle>Nutrition Information</SectionTitle>
              
              <FormRow>
                <FormGroup flex="1">
                  <Label htmlFor="nutrition.calories">Calories</Label>
                  <Input
                    type="number"
                    id="nutrition.calories"
                    name="nutrition.calories"
                    value={formData.nutrition.calories}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                
                <FormGroup flex="1">
                  <Label htmlFor="nutrition.protein">Protein (g)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    id="nutrition.protein"
                    name="nutrition.protein"
                    value={formData.nutrition.protein}
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </FormRow>
              
              <FormRow>
                <FormGroup flex="1">
                  <Label htmlFor="nutrition.carbs">Carbs (g)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    id="nutrition.carbs"
                    name="nutrition.carbs"
                    value={formData.nutrition.carbs}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                
                <FormGroup flex="1">
                  <Label htmlFor="nutrition.fat">Fat (g)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    id="nutrition.fat"
                    name="nutrition.fat"
                    value={formData.nutrition.fat}
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </FormRow>
            </FormSection>
          </FormGrid>
          
          <SubmitButtonContainer>
            <SubmitButton type="submit" disabled={submitting}>
              <FaSave /> {submitting ? 'Saving...' : 'Save Product'}
            </SubmitButton>
          </SubmitButtonContainer>
        </Form>
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
  align-items: center;
  margin-bottom: 30px;
  gap: 20px;

  h1 {
    font-size: 24px;
    color: var(--dark-color);
    margin: 0;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: var(--grey);
  color: var(--dark-color);
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    background-color: var(--grey-dark);
    color: var(--white);
  }
`;

const Form = styled.form`
  width: 100%;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
  gap: 30px;
  margin-bottom: 30px;
`;

const FormSection = styled.div`
  background-color: var(--grey-light);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  color: var(--dark-color);
  margin-top: 0;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--grey);
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  flex: ${props => props.flex || 'auto'};
`;

const FormRow = styled.div`
  display: flex;
  gap: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--grey-dark);
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid ${props => props.error ? 'var(--danger-color)' : 'var(--grey)'};
  border-radius: 4px;
  font-size: 14px;
  transition: var(--transition);

  &:focus {
    border-color: ${props => props.error ? 'var(--danger-color)' : 'var(--primary-color)'};
    outline: none;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid var(--grey);
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;
  min-height: 100px;

  &:focus {
    border-color: var(--primary-color);
    outline: none;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const Checkbox = styled.input`
  margin-right: 10px;
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  cursor: pointer;
  user-select: none;
`;

const ImageUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 200px;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 200px;
  border: 2px dashed var(--grey);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--grey-dark);
  gap: 10px;
`;

const UploadButton = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: var(--primary-color);
  color: var(--white);
  padding: 10px 15px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    background-color: var(--primary-dark);
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const SubmitButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background-color: var(--success-color);
  color: var(--white);
  border: none;
  border-radius: 4px;
  padding: 12px 30px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  min-width: 200px;

  &:hover:not(:disabled) {
    background-color: var(--success-dark);
  }

  &:disabled {
    background-color: var(--grey);
    cursor: not-allowed;
  }
`;

const ErrorText = styled.p`
  color: var(--danger-color);
  font-size: 12px;
  margin-top: 5px;
  margin-bottom: 0;
`;

const ErrorMessage = styled.div`
  background-color: var(--danger-light);
  color: var(--danger-color);
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  border-left: 4px solid var(--danger-color);
`;

const Loading = styled.div`
  text-align: center;
  padding: 20px;
  font-size: 18px;
  color: var(--grey-dark);
`;

export default ProductEditPage; 