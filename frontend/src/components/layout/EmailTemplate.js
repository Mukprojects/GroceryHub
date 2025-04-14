import React from 'react';
import styled from 'styled-components';

/*
This component represents the structure of the email that will be sent to users.
This doesn't need to be rendered in the app - it's a reference for creating 
your EmailJS template.

To set up EmailJS:
1. Sign up at https://www.emailjs.com/ (there's a free tier)
2. Create a service (connecting to Gmail, etc.)
3. Create an email template with variables like:
   - {{to_name}}
   - {{order_id}}
   - {{order_items}}
   - {{order_total}}
   - {{shipping_address}}
   - {{payment_method}}
4. Update the EMAILJS constants in CheckoutPage.js with your:
   - Service ID
   - Template ID
   - User ID (public key)
*/

const EmailTemplate = () => {
  return (
    <Container>
      <Header>
        <Logo>GroceryStore</Logo>
        <Title>Order Confirmation</Title>
      </Header>
      
      <Content>
        <Greeting>Dear {{to_name}},</Greeting>
        
        <Paragraph>
          Thank you for your order! We're happy to confirm that your order 
          has been received and is being processed.
        </Paragraph>
        
        <OrderDetails>
          <OrderId>Order #: {{order_id}}</OrderId>
          
          <SectionTitle>Items Ordered:</SectionTitle>
          <Items>{{order_items}}</Items>
          
          <TotalAmount>Total: {{order_total}}</TotalAmount>
          
          <SectionTitle>Shipping Address:</SectionTitle>
          <Address>{{shipping_address}}</Address>
          
          <SectionTitle>Payment Method:</SectionTitle>
          <PaymentMethod>{{payment_method}}</PaymentMethod>
        </OrderDetails>
        
        <Paragraph>
          We'll notify you when your order has been shipped. If you have any questions, 
          please reply to this email or contact our customer service.
        </Paragraph>
        
        <ThankYou>Thank you for shopping with us!</ThankYou>
      </Content>
      
      <Footer>
        <FooterText>© 2023 GroceryStore. All rights reserved.</FooterText>
      </Footer>
    </Container>
  );
};

const Container = styled.div`
  font-family: Arial, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
`;

const Header = styled.div`
  background-color: #4caf50;
  color: white;
  padding: 20px;
  text-align: center;
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const Title = styled.div`
  font-size: 18px;
`;

const Content = styled.div`
  padding: 20px;
  background-color: #fff;
`;

const Greeting = styled.p`
  font-size: 16px;
  margin-bottom: 20px;
`;

const Paragraph = styled.p`
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 20px;
  color: #333;
`;

const OrderDetails = styled.div`
  border: 1px solid #eee;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 20px;
`;

const OrderId = styled.div`
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 15px;
  color: #4caf50;
`;

const SectionTitle = styled.div`
  font-weight: bold;
  margin-top: 15px;
  margin-bottom: 5px;
  font-size: 14px;
`;

const Items = styled.div`
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-line;
`;

const TotalAmount = styled.div`
  font-weight: bold;
  font-size: 16px;
  margin-top: 15px;
  margin-bottom: 15px;
  color: #4caf50;
`;

const Address = styled.div`
  font-size: 14px;
  line-height: 1.5;
`;

const PaymentMethod = styled.div`
  font-size: 14px;
`;

const ThankYou = styled.p`
  font-size: 16px;
  font-weight: bold;
  margin-top: 25px;
  color: #4caf50;
`;

const Footer = styled.div`
  background-color: #f5f5f5;
  padding: 15px;
  text-align: center;
`;

const FooterText = styled.div`
  font-size: 12px;
  color: #777;
`;

export default EmailTemplate; 