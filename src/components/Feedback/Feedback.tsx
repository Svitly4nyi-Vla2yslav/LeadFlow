import React from 'react';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
// @ts-ignore
import 'swiper/css';
import Joshua from '../../assets/icons/feedback/unnamed.png';
import avatarAlex from '../../assets/icons/feedback/Ellipse 4aleksey.png';
import avatarJill from '../../assets/icons/feedback/JillSteiner.png';
import avatarWendy from '../../assets/icons/feedback/Ellipse 4-Wendy Bailey.png';
import Jake from '../../assets/icons/feedback/JakeAvatar.png';
import Lucas from '../../assets/icons/feedback/WillLucas.png';
import Zaid from '../../assets/icons/feedback/ZaidBakoo.png';
import Claudia from '../../assets/icons/feedback/ClaudiaGilbert.png';
import avatarElizabeth from '../../assets/icons/feedback/Ellipse 4-Elizabeth Castorena.png';

import reviewImageAlex from '../../assets/icons/feedback/f5.webp';
import reviewImageJill from '../../assets/icons/feedback/f4.webp';
import reviewImageJoshua from '../../assets/icons/feedback/f2.webp';
import reviewImageWendy from '../../assets/icons/feedback/Review Image-Wendy Bailey.png';
import reviewImageJake from '../../assets/icons/feedback/f3.webp';
import reviewImageClaudia from '../../assets/icons/feedback/f6.webp';
import reviewImageLucas from '../../assets/icons/feedback/f7.webp';
import reviewImageZaid from '../../assets/icons/feedback/f8.webp';
import reviewImageElizabeth from '../../assets/icons/feedback/f1.webp';
// import { useMediaQuery } from 'react-responsive';

interface Review {
  avatar: string;
  name: string;
  time: string;
  text: string;
  image: string;
}

const reviews: Review[] = [
  {
    avatar: avatarAlex,
    name: 'Aleksei Sabitov',
    time: 'a week ago',
    text: `My Sub-Zero refrigerator stopped cooling, so the next day I called
      Airtexno Appliance Repair. Their technician arrived the same day
      and got straight to work. He diagnosed and repaired the issue
      within just a few hours, explained everything clearly, and even
      gave me helpful maintenance tips. The pricing was very reasonable.
      I’m extremely happy with the service and will definitely be using
      Airtexno Appliance Repair for all my future appliance needs.
      Highly recommend them for Sub-Zero refrigerator repair and more!`,
    image: reviewImageAlex,
  },
  {
    avatar: Joshua,
    name: 'Joshua Hopstone',
    time: '2 weeks ago',
    text: `I have hired Sunny of Airtexno several times for needed repairs to my high end Viking appliances. He is responsive, reliable, honest, fast, and reasonably priced. I would recommend him to anyone.`,
    image: reviewImageJoshua,
  },
  {
    avatar: avatarWendy,
    name: 'Wendy Bailey',
    time: 'a week ago',
    text: `I've had Sunny from Airtexno come to my house twice over the last
      year. Each time he has arrived on time, has diagnosed the issues
      with my cooktop and ovens correctly and has resolved my problems
      quickly. He is extremely knowledgeable and conscientious. I have
      been very pleased with his work, and highly recommend him!`,
    image: reviewImageWendy,
  },
  {
    avatar: Claudia,
    name: 'Claudia Gilbert',
    time: 'a month ago',
    text: `Excellent service!  Sunny responds quickly and has always been able to repair my appliances.  This time my freezer drawer was leaking (grandchildren had not closed it tightly and was slightly open overnight), I was unable to change the water filter and the light stopped working.  He cleaned the drain system & condenser coil, was able to pull the filter out & replace it  - and the light came back on. All is now working properly.  YAY! Efficient, knowledgeable and a nice person to have in your home.`,
    image: reviewImageClaudia,
  },
  {
    avatar: avatarJill,
    name: 'Jill Steiner',
    time: 'a week ago',
    text: `Sunny is amazing.  Always available to help even if it’s after hours.  Has solved problems for us with our GE washer and Thermador fridge/freezer.  Above all he’s very fair and honest with the situation. 100% would recommend.`,
    image: reviewImageJill,
  },
  {
    avatar: Lucas,
    name: 'Will Lucas',
    time: '6 months ago',
    text: `Sunny was referred by someone I trust and I was pleased to have been able to obtain his services for my microwave and oven combo.  Sunny is great to work with setting up schedule and task over phone and reassuring in person as he has a professional demeanor and sincerely takes pride in quality craftsmanship.  Gets the job done and does it right.  Meticulously wired with care he took time to ensure best connection with best materials.  Reasonable pricing and someone I would gladly have back to help appliance installation in my home.`,
    image: reviewImageLucas,
  },
  {
    avatar: Jake,
    name: 'Jake',
    time: '4 days ago',
    text: `Sunny was great, he has done 1 repair on my washer and an estimate on my fridge. He was very accommodating and had great communication. Very honest and respectful. I will use him for feature repairs. Thank you Sunny.`,
    image: reviewImageJake,
  },
  {
    avatar: avatarElizabeth,
    name: 'Elizabeth Castorena',
    time: 'a week ago',
    text: `Replaced a refrigerator door that had been dented. Did an
      excellent job hooking up the ice maker, water dispenser, etc. from
      new door into the refrigerator. Sunny is extremely knowledgeable
      and thorough. Will definitely use Airtexno again.`,
    image: reviewImageElizabeth,
  },
  {
    avatar: Zaid,
    name: 'Zaid Bakoo',
    time: 'a week ago',
    text: `Airtexno was simply amazing. Great customer service and support. Technician was very knowledgeable and responsive. He fixed two fan motors on my True cooler. Highly recommend this company for all your needs.`,
    image: reviewImageZaid,
  },
];

export const TextContainer = styled.div`
  padding: 0px 16px;
  margin-bottom: 24px;
  max-width: 1440px;
  margin: 0 auto;

  display: flex;
  flex-direction: column;
  gap: 8px;

  @media screen and (min-width: 768px) {
    padding: 0px 32px;
    margin-bottom: 32px;
    gap: 12px;
  }

  @media screen and (min-width: 1440px) {
    padding: 0px 40px;
    margin-bottom: 40px;
    gap: 16px;
  }
`;

export const TitleFeedback = styled.h2`
  font-family: var(--second-family);
  font-weight: 400;
  font-size: 32px;
  line-height: 90%;
  color: var(--black-500);

  span {
    color: var(--blue-500);
  }

  @media screen and (min-width: 768px) {
    font-size: 48px;
  }

  @media screen and (min-width: 1440px) {
    font-size: 72px;
  }
`;

export const TextFeedback = styled.p`
  font-family: var(--font-family);
  font-weight: 400;
  font-size: 12px;
  line-height: 90%;
  text-transform: uppercase;
  color: var(--black-500);

  @media screen and (min-width: 768px) {
    font-size: 14px;
  }

  @media screen and (min-width: 1440px) {
    font-size: 17px;
  }
`;

const SwiperContainer = styled.div`
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 16px;

  @media screen and (min-width: 768px) {
    padding: 0 24px;
  }

  @media screen and (min-width: 1440px) {
    padding: 0 40px;
  }

  .swiper {
    overflow: hidden;
  }

  .swiper-slide {
    height: auto;
    display: flex;
  }
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background-color: #f5faff;
  border-radius: 12px;
  height: fit-content;
  /* min-height: 380px; */

  @media screen and (min-width: 768px) {
    padding: 20px;
    gap: 16px;
    /* min-height: 420px; */
  }

  @media screen and (min-width: 1440px) {
    padding: 24px;
    /* height: fit-content; */
  }
`;

const Header = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  @media screen and (min-width: 768px) {
    gap: 16px;
  }
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;

  @media screen and (min-width: 768px) {
    width: 48px;
    height: 48px;
  }

  @media screen and (min-width: 1440px) {
    width: 56px;
    height: 56px;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  @media screen and (min-width: 768px) {
    gap: 4px;
  }
`;

const Name = styled.p`
  color: #242424;
  font-family: 'Geist', sans-serif;
  font-size: 14px;
  font-weight: 500;

  @media screen and (min-width: 768px) {
    font-size: 16px;
  }
`;

const Time = styled.p`
  color: rgba(33, 33, 33, 0.5);
  font-family: 'Geist', sans-serif;
  font-size: 12px;
  font-weight: 400;

  @media screen and (min-width: 768px) {
    font-size: 14px;
  }
`;

const Text = styled.p`
  color: #242424;
  font-family: 'Geist', sans-serif;
  font-size: 13px;
  line-height: 1.4;
  flex-grow: 1;
  overflow: visible;
  display: block;

  @media screen and (min-width: 768px) {
    font-size: 14px;
  }

  @media screen and (min-width: 1440px) {
    font-size: 15px;
  }
`;

const ReviewImage = styled.img`
  width: 100%;
  height: fit-content;
  border-radius: 8px;
  object-fit: cover;
  margin-top: auto;

  @media screen and (min-width: 768px) {
    min-height: 250px;
  }

  @media screen and (min-width: 1440px) {
    min-height: 320px;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  margin: 0 auto;
  padding: 0 16px;

  @media screen and (min-width: 768px) {
    padding: 0 32px;
  }

  @media screen and (min-width: 1440px) {
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 60px;
  }
`;

const ReviewCardContainer: React.FC = () => {
  // const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  // const isTablet = useMediaQuery({ query: '(min-width: 768px) and (max-width: 1439px)' });
  // const isDesktop = useMediaQuery({ query: '(min-width: 1440px)' });

  return (
    <Wrapper style={{ padding: '32px 0' }}>
      <TextContainer>
        <TextFeedback>Your Feedback Matters</TextFeedback>
        <TitleFeedback>
          Discover why clients <span>trust</span> our repairs
        </TitleFeedback>
      </TextContainer>

      <SwiperContainer>
        <Swiper
          direction='horizontal'
          spaceBetween={16}
          autoplay={{
            delay: 6000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          speed={11000}
          loop={true}
          modules={[Autoplay]}
          grabCursor={true}
          centeredSlides={false}
          breakpoints={{
            // Мобільні пристрої
            320: {
              slidesPerView: 1,
              spaceBetween: 12,
            },
            // Планшети
            768: {
              slidesPerView: 2,
              spaceBetween: 16,
            },
            // Десктоп
            1440: {
              slidesPerView: 3, // 3 слайди для десктопу
              spaceBetween: 24,
            },
          }}
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={index}>
              <Card>
                <Header>
                  <Avatar src={review.avatar} alt={review.name} loading='lazy' decoding='async' />
                  <UserInfo>
                    <Name>{review.name}</Name>
                    <Time>{review.time}</Time>
                  </UserInfo>
                </Header>
                <Text>{review.text}</Text>
                <ReviewImage
                  src={review.image}
                  alt={`Review by ${review.name}`}
                  loading='lazy'
                  decoding='async'
                />
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </SwiperContainer>
    </Wrapper>
  );
};

export default ReviewCardContainer;
