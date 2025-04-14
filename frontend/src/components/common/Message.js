import React from 'react';
import styled from 'styled-components';

const Message = ({ variant = 'info', children }) => {
  return <MessageContainer variant={variant}>{children}</MessageContainer>;
};

const MessageContainer = styled.div`
  padding: 15px;
  margin: 15px 0;
  border-radius: 5px;
  text-align: center;
  
  ${({ variant }) => {
    switch (variant) {
      case 'success':
        return `
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        `;
      case 'error':
        return `
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        `;
      case 'warning':
        return `
          background-color: #fff3cd;
          color: #856404;
          border: 1px solid #ffeeba;
        `;
      case 'info':
      default:
        return `
          background-color: #d1ecf1;
          color: #0c5460;
          border: 1px solid #bee5eb;
        `;
    }
  }}
`;

export default Message; 