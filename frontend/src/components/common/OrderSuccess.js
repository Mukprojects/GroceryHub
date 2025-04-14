import React from 'react';
import Lottie from 'react-lottie';
import styled from 'styled-components';

// Success animation JSON
const successAnimationData = {
  "v": "5.5.7",
  "meta": { "g": "LottieFiles AE 0.1.20", "a": "", "k": "", "d": "", "tc": "" },
  "fr": 30,
  "ip": 0,
  "op": 60,
  "w": 300,
  "h": 300,
  "nm": "success",
  "ddd": 0,
  "assets": [],
  "layers": [
    {
      "ddd": 0,
      "ind": 1,
      "ty": 4,
      "nm": "check",
      "sr": 1,
      "ks": {
        "o": { "a": 0, "k": 100, "ix": 11 },
        "r": { "a": 0, "k": 0, "ix": 10 },
        "p": { "a": 0, "k": [150, 150, 0], "ix": 2 },
        "a": { "a": 0, "k": [0, 0, 0], "ix": 1 },
        "s": { "a": 0, "k": [100, 100, 100], "ix": 6 }
      },
      "ao": 0,
      "shapes": [
        {
          "ty": "gr",
          "it": [
            {
              "ind": 0,
              "ty": "sh",
              "ix": 1,
              "ks": {
                "a": 0,
                "k": {
                  "i": [[0, 0], [0, 0], [0, 0]],
                  "o": [[0, 0], [0, 0], [0, 0]],
                  "v": [[-45, 0], [-15, 30], [45, -30]],
                  "c": false
                },
                "ix": 2
              },
              "nm": "Path 1",
              "mn": "ADBE Vector Shape - Group",
              "hd": false
            },
            {
              "ty": "st",
              "c": { "a": 0, "k": [1, 1, 1, 1], "ix": 3 },
              "o": { "a": 0, "k": 100, "ix": 4 },
              "w": { "a": 0, "k": 15, "ix": 5 },
              "lc": 2,
              "lj": 2,
              "bm": 0,
              "nm": "Stroke 1",
              "mn": "ADBE Vector Graphic - Stroke",
              "hd": false
            },
            {
              "ty": "tr",
              "p": { "a": 0, "k": [0, 0], "ix": 2 },
              "a": { "a": 0, "k": [0, 0], "ix": 1 },
              "s": { "a": 0, "k": [100, 100], "ix": 3 },
              "r": { "a": 0, "k": 0, "ix": 6 },
              "o": { "a": 0, "k": 100, "ix": 7 },
              "sk": { "a": 0, "k": 0, "ix": 4 },
              "sa": { "a": 0, "k": 0, "ix": 5 },
              "nm": "Transform"
            }
          ],
          "nm": "Shape 1",
          "np": 3,
          "cix": 2,
          "bm": 0,
          "ix": 1,
          "mn": "ADBE Vector Group",
          "hd": false
        },
        {
          "ty": "tm",
          "s": {
            "a": 1,
            "k": [
              {
                "i": { "x": [0.833], "y": [0.833] },
                "o": { "x": [0.167], "y": [0.167] },
                "t": 20,
                "s": [0]
              },
              { "t": 35, "s": [100] }
            ],
            "ix": 1
          },
          "e": { "a": 0, "k": 0, "ix": 2 },
          "o": { "a": 0, "k": 0, "ix": 3 },
          "m": 1,
          "ix": 2,
          "nm": "Trim Paths 1",
          "mn": "ADBE Vector Filter - Trim",
          "hd": false
        }
      ],
      "ip": 0,
      "op": 60,
      "st": 0,
      "bm": 0
    },
    {
      "ddd": 0,
      "ind": 2,
      "ty": 4,
      "nm": "circle",
      "sr": 1,
      "ks": {
        "o": { "a": 0, "k": 100, "ix": 11 },
        "r": { "a": 0, "k": 0, "ix": 10 },
        "p": { "a": 0, "k": [150, 150, 0], "ix": 2 },
        "a": { "a": 0, "k": [0, 0, 0], "ix": 1 },
        "s": {
          "a": 1,
          "k": [
            {
              "i": { "x": [0.833, 0.833, 0.833], "y": [0.833, 0.833, 0.833] },
              "o": { "x": [0.167, 0.167, 0.167], "y": [0.167, 0.167, 0.167] },
              "t": 0,
              "s": [0, 0, 100]
            },
            {
              "i": { "x": [0.833, 0.833, 0.833], "y": [0.833, 0.833, 0.833] },
              "o": { "x": [0.167, 0.167, 0.167], "y": [0.167, 0.167, 0.167] },
              "t": 15,
              "s": [110, 110, 100]
            },
            { "t": 20, "s": [100, 100, 100] }
          ],
          "ix": 6
        }
      },
      "ao": 0,
      "shapes": [
        {
          "ty": "gr",
          "it": [
            {
              "d": 1,
              "ty": "el",
              "s": { "a": 0, "k": [200, 200], "ix": 2 },
              "p": { "a": 0, "k": [0, 0], "ix": 3 },
              "nm": "Ellipse Path 1",
              "mn": "ADBE Vector Shape - Ellipse",
              "hd": false
            },
            {
              "ty": "fl",
              "c": { "a": 0, "k": [0.3, 0.7, 0.3, 1], "ix": 4 },
              "o": { "a": 0, "k": 100, "ix": 5 },
              "r": 1,
              "bm": 0,
              "nm": "Fill 1",
              "mn": "ADBE Vector Graphic - Fill",
              "hd": false
            },
            {
              "ty": "tr",
              "p": { "a": 0, "k": [0, 0], "ix": 2 },
              "a": { "a": 0, "k": [0, 0], "ix": 1 },
              "s": { "a": 0, "k": [100, 100], "ix": 3 },
              "r": { "a": 0, "k": 0, "ix": 6 },
              "o": { "a": 0, "k": 100, "ix": 7 },
              "sk": { "a": 0, "k": 0, "ix": 4 },
              "sa": { "a": 0, "k": 0, "ix": 5 },
              "nm": "Transform"
            }
          ],
          "nm": "Ellipse 1",
          "np": 3,
          "cix": 2,
          "bm": 0,
          "ix": 1,
          "mn": "ADBE Vector Group",
          "hd": false
        }
      ],
      "ip": 0,
      "op": 60,
      "st": 0,
      "bm": 0
    }
  ],
  "markers": []
};

const OrderSuccess = ({ message, orderId }) => {
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: successAnimationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <SuccessContainer>
      <AnimationWrapper>
        <Lottie options={defaultOptions} height={200} width={200} />
      </AnimationWrapper>
      
      <SuccessMessage>{message || 'Order Placed Successfully!'}</SuccessMessage>
      
      {orderId && (
        <OrderId>Order ID: <span>{orderId}</span></OrderId>
      )}
      
      <SuccessText>
        Thank you for your order! A confirmation email has been sent to your provided email address.
      </SuccessText>
    </SuccessContainer>
  );
};

const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  text-align: center;
`;

const AnimationWrapper = styled.div`
  margin-bottom: 20px;
`;

const SuccessMessage = styled.h2`
  font-size: 1.8rem;
  color: var(--primary-color);
  margin-bottom: 15px;
`;

const OrderId = styled.div`
  font-size: 1.1rem;
  margin-bottom: 20px;
  
  span {
    font-weight: bold;
    color: var(--primary-color);
  }
`;

const SuccessText = styled.p`
  font-size: 1rem;
  color: var(--grey-dark);
  max-width: 500px;
  line-height: 1.5;
`;

export default OrderSuccess; 