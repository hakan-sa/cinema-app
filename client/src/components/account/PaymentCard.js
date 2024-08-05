import React from 'react';
import './PaymentCard.css';
import { Container, Row, Button } from 'react-bootstrap';


const PaymentCard = ({
  firstName,
  lastName,
  cardNumber,
  expirationDate,
  deletePaymentCardHandler,
}) => {
  // Extract month and year from expiration date
  const expirationMonth = expirationDate.slice(5, 7);
  const expirationYear = expirationDate.slice(2, 4);
  const formattedExpirationDate = `${expirationMonth}/${expirationYear}`;

  const lastFourDigits = cardNumber.slice(-4);
  const maskedCardNumber = `**** **** **** ${lastFourDigits}`;

  return (
    <Container className="payment-card">
      <Row className="payment-card-row justify-content-between align-items-center">
        {firstName} {lastName}
      </Row>
      <Row className="payment-card-row">{maskedCardNumber}</Row>
      <Row className="payment-card-row">{formattedExpirationDate}</Row>
      <Button variant="outline-danger" onClick={deletePaymentCardHandler} size="sm">Delete</Button>
    </Container>
  );
};

export default PaymentCard;
