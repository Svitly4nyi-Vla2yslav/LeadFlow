import React, { useState } from 'react';
import {
  FooterWrapper,
  FooterContent,
  InfoBlock,
  FullWidthText,
  LinksWrapper,
  BottomBlock,
  LogoSVG,
  Divider,
  Text,
  CopyrightContainer,
  ModalOverlay,
  ModalContent,
  CloseButton,
  TextO,
} from './Footer.styled';
import ContentContainer from './PoliciesContent';

const Footer: React.FC = () => {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  const handlePrivacyClick = () => {
    setShowPrivacyPolicy(true);
  };

  const handleCloseModal = () => {
    setShowPrivacyPolicy(false);
  };

  return (
    <>
      <FooterWrapper>
        <FooterContent>
          <InfoBlock>
            <FullWidthText>
              <a
                href='https://maps.app.goo.gl/cJF4BwHPJFbYsQAMA'
                target='_blank'
                rel='noopener noreferrer'
              >
                801 Tioga pl, Newbury Park, CA 91320
              </a>{' '}
              <br />
              <a href='tel:+18055002705'>+1 (805) 500-2705</a>
              <br /> <a href='mailto:Airtexnola@gmail.com'>Airtexnola@gmail.com</a>
            </FullWidthText>

            <LinksWrapper>
              <Text to='/home#hero'>Home</Text>
              <Text to='/service#all'>Services</Text>
              <Text to='/about#ap'>About Us</Text>
              <Text to='/tips#app'>Tips</Text>
              <Text to='/contact#ap'>Contacts</Text>
  <TextO onClick={handlePrivacyClick} style={{ cursor: 'pointer' }}>            
                Privacy and Terms
              </TextO>
            </LinksWrapper>
          </InfoBlock>

          <BottomBlock>
            <LogoSVG viewBox='0 0 343 56' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M0 54.8045L19.396 1.71207H26.1359L45.457 54.8045H39.9152L34.2238 38.8768H11.2332L5.5417 54.8045H0ZM12.9556 33.9414H32.5013L22.7659 6.27353L12.9556 33.9414Z'
                fill='#3098EE'
              />
              <path d='M51.2842 54.8045V1.71207H56.3765V54.8045H51.2842Z' fill='#3098EE' />
              <path
                d='M67.6308 54.8045V1.71207H87.1016C90.896 1.71207 94.1161 2.36015 96.7622 3.6563C99.4581 4.9026 101.53 6.69727 102.978 9.04032C104.426 11.3834 105.15 14.2 105.15 17.4902C105.15 19.933 104.575 22.1015 103.427 23.9959C102.329 25.8903 100.856 27.4108 99.0088 28.5574C97.1616 29.704 95.1646 30.3521 93.0178 30.5016L92.6433 29.8286C96.1381 29.8286 98.8341 30.6262 100.731 32.2215C102.678 33.7669 103.802 36.2097 104.101 39.5498L105.449 54.8045H100.282L99.0088 39.9984C98.8091 37.5557 97.9354 35.761 96.3877 34.6144C94.84 33.418 92.3438 32.8197 88.8989 32.8197H72.7232V54.8045H67.6308ZM72.7232 27.8844H87.9254C91.5699 27.8844 94.4407 26.987 96.5375 25.1924C98.6843 23.3478 99.7577 20.7555 99.7577 17.4155C99.7577 13.9258 98.6843 11.2587 96.5375 9.41421C94.3907 7.56968 91.2205 6.64742 87.0267 6.64742H72.7232V27.8844Z'
                fill='#3098EE'
              />
              <path
                d='M125.684 54.8045V9.1151H109.359V1.71207H150.098V9.1151H133.772V54.8045H125.684Z'
                fill='white'
              />
              <path
                d='M153.991 54.8045V1.71207H188.589V9.1151H162.079V24.5941H187.691V31.7728H162.079V47.4014H189.188V54.8045H153.991Z'
                fill='white'
              />
              <path
                d='M192.736 54.8045L210.41 28.1835L192.886 1.71207H202.397L215.502 21.9021L228.383 1.71207H237.819L220.295 28.0339L238.043 54.8045H228.533L215.352 34.3153L202.172 54.8045H192.736Z'
                fill='white'
              />
              <path
                d='M243.289 54.8045V1.71207H253.549L278.112 45.0085V1.71207H286.2V54.8045H275.566L251.377 12.4801V54.8045H243.289Z'
                fill='white'
              />
              <path
                d='M318.137 56.0009C312.995 56.0009 308.577 54.9042 304.882 52.7107C301.188 50.4674 298.342 47.2768 296.345 43.1391C294.348 39.0014 293.349 34.066 293.349 28.333C293.349 22.6001 294.348 17.6647 296.345 13.527C298.342 9.33943 301.188 6.12397 304.882 3.88063C308.577 1.63729 312.995 0.515625 318.137 0.515625C323.329 0.515625 327.773 1.63729 331.467 3.88063C335.212 6.12397 338.057 9.33943 340.004 13.527C342.001 17.6647 343 22.6001 343 28.333C343 34.066 342.001 39.0014 340.004 43.1391C338.057 47.2768 335.212 50.4674 331.467 52.7107C327.773 54.9042 323.329 56.0009 318.137 56.0009ZM318.137 48.5979C321.582 48.5979 324.528 47.8003 326.974 46.205C329.47 44.6097 331.367 42.3165 332.665 39.3254C333.964 36.2844 334.613 32.6203 334.613 28.333C334.613 24.0458 333.964 20.3817 332.665 17.3407C331.367 14.2997 329.47 11.9816 326.974 10.3863C324.528 8.74121 321.582 7.91865 318.137 7.91865C314.742 7.91865 311.822 8.74121 309.375 10.3863C306.929 11.9816 305.032 14.2997 303.684 17.3407C302.386 20.3817 301.737 24.0458 301.737 28.333C301.737 32.6203 302.386 36.2844 303.684 39.3254C305.032 42.3165 306.929 44.6097 309.375 46.205C311.822 47.8003 314.742 48.5979 318.137 48.5979Z'
                fill='white'
              />
            </LogoSVG>

            <Divider opacity={0.5} />

            <CopyrightContainer>
              <TextO size='14px' weight='500'>
                Designed by TRBN
              </TextO>

              <TextO size='14px'>Copyright © 2025 Airtexno - All Rights Reserved.</TextO>
            </CopyrightContainer>
          </BottomBlock>
        </FooterContent>
      </FooterWrapper>

      {showPrivacyPolicy && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <CloseButton onClick={handleCloseModal}>×</CloseButton>
            <ContentContainer />
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default Footer;
