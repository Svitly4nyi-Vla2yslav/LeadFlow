import React from 'react';
import { motion, useScroll, useTransform, easeOut, backOut } from 'framer-motion';
import {
  Container,
  Subtitle,
  Title,
  Description,
  ButtonGroup,
  PrimaryButton,
  SecondaryButton,
  ContentWrapper,
  HeaderWrapper,
  MainContent,
} from './Professional.styled';
import {
  SwiperContainer,
  SwiperWrapper,
  SwiperTrack,
  SwiperSlide,
  SlideContent,
} from './Professional.styled';

interface ServiceCard {
  title: string;
  description: string;
  price: string;
}

interface VerticalSwiperProps {
  services: ServiceCard[];
}

const Professional: React.FC = () => {
  const services: ServiceCard[] = [
    {
      title: 'NOT HEATING / NO HEAT',
      description:
        "If your dryer isn’t heating, the issue could be a faulty heating element, blown fuse, or thermostat problem. We’ll diagnose and repair it so your dryer works like new.",
      price: 'from <span>$200</span>',
    },
    {
      title: 'DRUM NOT SPINNING',
      description:
        "A drum that won’t spin often points to a broken belt, worn motor, or damaged pulley. Our team will restore proper rotation and get your laundry back on track.",
      price: 'from <span>$200</span>',
    },
    {
      title: 'TAKES TOO LONG TO DRY',
      description:
        'If your clothes take multiple cycles to dry, clogged vents, a weak heater, or sensor issues could be to blame. We’ll make your dryer efficient again.',
      price: 'from <span>$200</span>',
    },
    {
      title: "LOUD NOISES / VIBRATIONS",
      description:
        "Buzzing, squealing, or banging noises may come from worn bearings, loose parts, or a failing motor. We’ll eliminate the noise and restore quiet operation.",
      price: 'from <span>$200</span>',
    },
    {
      title: 'DRYER WON’T START / NOT TURNING ON',
      description:
        'If your dryer won’t start or power on, faulty door switches, control boards, or wiring problems might be the cause. We’ll find the issue and get your dryer running again.',
      price: 'from <span>$200</span>',
    },
  ];

  // Анімаційні варіанти для заголовків
  const titleVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
      rotate: -2,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: easeOut,
      },
    },
  };

  const contentVariants = {
    hidden: {
      opacity: 0,
      x: -30,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: easeOut,
        delay: 0.2,
      },
    },
  };

  const buttonVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: easeOut,
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
      ease: easeOut,
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  return (
    <Container>
      <ContentWrapper>
        <HeaderWrapper>
          <motion.div
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.3 }}
            variants={titleVariants}
          >
            <Subtitle>Common Dryer Problems We Repair</Subtitle>
          </motion.div>

          <motion.div
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.3 }}
            variants={titleVariants}
            transition={{ delay: 0.1 }}
          >
            <Title>
              Professional Dryer Repair <span>& Installation Services</span>
            </Title>
          </motion.div>
        </HeaderWrapper>

        <MainContent>
          <VerticalSwiper services={services} />

          <motion.div
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.3 }}
            variants={contentVariants}
          >
            <Description>
              Having issues with your dryer? Call us today — we'll fix it and restore normal
              operation fast.
            </Description>

            <ButtonGroup>
              <motion.div variants={buttonVariants} whileHover='hover' whileTap='tap'>
                <PrimaryButton to='/contact#ap'>Contact Us</PrimaryButton>
              </motion.div>

              <motion.div
                variants={buttonVariants}
                whileHover='hover'
                whileTap='tap'
                transition={{ delay: 0.1 }}
              >
                <a href='tel:+18055002705'>
                  <SecondaryButton>Call Us</SecondaryButton>
                </a>
              </motion.div>
            </ButtonGroup>
          </motion.div>
        </MainContent>
      </ContentWrapper>
    </Container>
  );
};

const VerticalSwiper: React.FC<VerticalSwiperProps> = ({ services }) => {
  const { scrollY } = useScroll();

  // Паралакс ефект для слайдера
  const y = useTransform(scrollY, [0, 1000], [0, 200]);
  const rotate = useTransform(scrollY, [0, 800], [0, 1]);

  // Подвоюємо масив для безперервної прокрутки
  const duplicatedServices = [...services, ...services];

  // Анімаційні варіанти для слайдів
  const slideVariants = {
    hidden: (_index: number) => ({
      opacity: 0,
      y: 100,
      scale: 0.8,
      rotateX: -45,
      filter: 'blur(5px)',
    }),
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.7,
        delay: index * 0.1,
        ease: backOut,
      },
    }),
    hover: {
      scale: 1.02,
      y: -5,
      rotateY: 3,
      boxShadow: '0 15px 30px rgba(0,0,0,0.15)',
      transition: {
        duration: 0.3,
        ease: easeOut,
      },
    },
  };

  const contentVariants = {
    hidden: {
      opacity: 0,
      x: -20,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: easeOut,
        delay: 0.2,
      },
    },
  };

  return (
    <motion.div style={{ y, rotate }}>
      <SwiperContainer>
        <SwiperWrapper>
          <SwiperTrack>
            {duplicatedServices.map((service, index) => (
              <motion.div
                key={index}
                custom={index}
                initial='hidden'
                whileInView='visible'
                viewport={{ once: true, amount: 0.2 }}
                variants={slideVariants}
                whileHover='hover'
              >
                <SwiperSlide>
                  <motion.div variants={contentVariants}>
                    <SlideContent>
                      <h3>{service.title}</h3>
                      <p>{service.description}</p>
                      <p dangerouslySetInnerHTML={{ __html: service.price }} />
                    </SlideContent>
                  </motion.div>
                </SwiperSlide>
              </motion.div>
            ))}
          </SwiperTrack>
        </SwiperWrapper>
      </SwiperContainer>
    </motion.div>
  );
};

export default Professional;