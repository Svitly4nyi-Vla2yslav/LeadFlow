import React from 'react';
import { ContactContainer } from './Contact.styled';
import { ContactForm } from '../../components/ContactComponents/ContactForm';
import ReviewCardContainer from '../../components/Feedback/Feedback';

const Contact: React.FC = () => {
  return (
    <ContactContainer  id='ap'>
      <ContactForm />
      <ReviewCardContainer />
    </ContactContainer>
  );
};

export default Contact;
