import React from 'react';
import {
  Container,
  Title,
  ContentWrapper,
  ImageContainer,
  Image,
  Description,
  PrimaryButton,
  SecondaryButton,
  ButtonRow,
  ButtonTextBlack,
  ButtonTextWhite,
  TextWrapper,
  TextAndIconWrap,
  TabletContainer,
  TabletContentWrapper,
  TabletImageRow,
  TabletImage,
  TabletDescription,
  TabletButtonRow,
  TabletSecondaryButton,
  TabletButtonTextBlack,
  MainWrapImage,
  DeckstopTitleWrapp,
  DeckstopImageContainer,
  RatingIcon,
} from './Refridge.styled';
import fridge from '../../assets/icons/frigde/fridge.png';
import fridge1 from '../../assets/icons/frigde/fridge1.png';
import rating from '../../assets/icons/frigde/star-red.svg';
import { useMediaQuery } from 'react-responsive';

export const Fridge: React.FC = () => {
  const isTablet = useMediaQuery({ query: '(min-width: 768px) and (max-width: 1439px)' });
  const isDesktop = useMediaQuery({ query: '(min-width: 1440px)' });

  if (isDesktop) {
    return (
      <TabletContainer>
        <DeckstopTitleWrapp>
          <Title>
            <span>Refrigerator</span> Repair <span> in </span> Thousand Oaks and Nearby Cities
          </Title>

          <TabletDescription>
            Expert refrigerator repair in Thousand Oaks & nearby areas. We service Sub-Zero, Viking,
            Thermador, KitchenAid, LG, Whirlpool and more — with same-day service available.
          </TabletDescription>

          <TabletButtonRow>
            <PrimaryButton to='/contact#ap'>
              <ButtonTextWhite>Contact Us</ButtonTextWhite>
            </PrimaryButton>

            <TabletSecondaryButton>
              <a href='tel:+18055002705'>
                <TabletButtonTextBlack>Call Us</TabletButtonTextBlack>
              </a>
            </TabletSecondaryButton>
          </TabletButtonRow>

          <RatingIcon src={rating} alt='⭐⭐⭐⭐⭐' loading='lazy' />
        </DeckstopTitleWrapp>

        <DeckstopImageContainer>
          <TabletContentWrapper>
            <TabletImageRow>
              <MainWrapImage>
                <TabletImage
                  src={fridge1}
                  alt='Why Airtexno Image 1'
                  className='main-image'
                  loading='lazy'
                />

                <TextWrapper className='tablet-text-wrapper'>
                  {[
                    { icon: '🔧', text: 'Free Diagnostic With Repair' },
                    { icon: '⏱️', text: 'Same-Day Service Available' },
                    { icon: '🚚', text: 'OEM Parts From Our Own Warehouse' },
                  ].map((item, index) => (
                    <TextAndIconWrap key={index}>
                      <span style={{ fontSize: '20px' }}>{item.icon}</span>
                      <p>{item.text}</p>
                    </TextAndIconWrap>
                  ))}
                </TextWrapper>
              </MainWrapImage>

              <TabletImage
                src={fridge}
                alt='Why Airtexno Image 2'
                className='secondary-image'
                loading='lazy'
              />
            </TabletImageRow>
          </TabletContentWrapper>
        </DeckstopImageContainer>
      </TabletContainer>
    );
  }

  if (isTablet) {
    return (
      <TabletContainer>
        <Title>
          <span>Refrigerator</span> Repair <span> in </span> Thousand Oaks and Nearby Cities
        </Title>

        <TabletContentWrapper>
          <TabletImageRow>
            <MainWrapImage>
              <TabletImage
                src={fridge1}
                alt='Why Airtexno Image 1'
                className='main-image'
                loading='lazy'
              />

              <TextWrapper className='tablet-text-wrapper'>
                {[
                  { icon: '🔧', text: 'Free Diagnostic With Repair' },
                  { icon: '⏱️', text: 'Same-Day Service Available' },
                  { icon: '🚚', text: 'OEM Parts From Our Own Warehouse' },
                ].map((item, index) => (
                  <TextAndIconWrap key={index}>
                    <span style={{ fontSize: '18px' }}>{item.icon}</span>
                    <p>{item.text}</p>
                  </TextAndIconWrap>
                ))}
              </TextWrapper>
            </MainWrapImage>

            <TabletImage
              src={fridge}
              alt='Why Airtexno Image 2'
              className='secondary-image'
              loading='lazy'
            />
          </TabletImageRow>

          <TabletDescription>
            Expert refrigerator repair in Thousand Oaks & nearby areas. We service Sub-Zero, Viking,
            Thermador, KitchenAid, LG, Whirlpool and more — with same-day service available.
          </TabletDescription>

          <TabletButtonRow>
            <PrimaryButton to='/contact#ap'>
              <ButtonTextWhite>Contact Us</ButtonTextWhite>
            </PrimaryButton>

            <TabletSecondaryButton>
              <a href='tel:+18055002705'>
                <TabletButtonTextBlack>Call Us</TabletButtonTextBlack>
              </a>
            </TabletSecondaryButton>
          </TabletButtonRow>
        </TabletContentWrapper>
      </TabletContainer>
    );
  }

  return (
    <Container>
      <Title>
        <span>Refrigerator</span> Repair <span> in </span> Thousand Oaks and Nearby Cities
      </Title>

      <ContentWrapper>
        <ImageContainer>
          <Image src={fridge1} alt='Why Airtexno Image 1' loading='lazy' />

          <TextWrapper>
            {[
              { icon: '🔧', text: 'Free Diagnostic With Repair' },
              { icon: '⏱️', text: 'Same-Day Service Available' },
              { icon: '🚚', text: 'OEM Parts From Our Own Warehouse' },
            ].map((item, index) => (
              <TextAndIconWrap key={index}>
                <span style={{ fontSize: '16px' }}>{item.icon}</span>
                <p>{item.text}</p>
              </TextAndIconWrap>
            ))}
          </TextWrapper>
        </ImageContainer>

        <Description>
          Expert refrigerator repair in Thousand Oaks & nearby areas. We service Sub-Zero, Viking,
          Thermador, KitchenAid, LG, Whirlpool and more — with same-day service available.
        </Description>

        <ButtonRow>
          <PrimaryButton to='/contact#ap'>
            <ButtonTextWhite>Contact Us</ButtonTextWhite>
          </PrimaryButton>

          <SecondaryButton>
            <a href='tel:+18055002705'>
              <ButtonTextBlack>Call Us</ButtonTextBlack>
            </a>
          </SecondaryButton>
        </ButtonRow>
      </ContentWrapper>
    </Container>
  );
};
