import React from 'react';
import { motion, easeOut } from 'framer-motion';
import {
  Blue,
  Section,
  TextWrapper,
  Title,
  Text,
  BlueCard,
  ImageSection,
  CenteredSlideContainer,
  TeamContainer,
  TeamImage,
  Content,
  Description,
  ImageContainer,
} from './OurMission.styled';
import Person from '../../../assets/icons/equipment/aNew1.jpg';
import Team from '../../../assets/icons/about/Team Image.png';
import { useMediaQuery } from 'react-responsive';

const OurMission: React.FC = () => {
  const isLargeDesktop = useMediaQuery({ query: '(min-width: 1440px)' });

  // Прості анімаційні варіанти
  const fadeInUp = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: easeOut,
      },
    },
  };

  const fadeInLeft = {
    hidden: {
      opacity: 0,
      x: -30,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: easeOut,
      },
    },
  };

  const fadeInRight = {
    hidden: {
      opacity: 0,
      x: 30,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: easeOut,
      },
    },
  };

  return (
    <Section>
      <TextWrapper>
        <motion.div
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
        >
          <Title>
            Our mission is to provide <Blue>reliable</Blue> and <Blue>efficient</Blue>
            appliance repair services that improve<Blue>everyday </Blue>life{' '}
          </Title>
        </motion.div>
      </TextWrapper>

      <Content>
        <ImageSection>
          <ImageContainer>
            <motion.div
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInLeft}
            >
              <img src={Person} alt='image' />
            </motion.div>

            <CenteredSlideContainer>
              <motion.div
                initial='hidden'
                whileInView='visible'
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeInUp}
                transition={{ delay: 0.2 }}
              >
                <Text>
                  “Our focus is to fix every appliance properly and reliably. We take on the hardest
                  jobs, train new technicians, and make sure every client feels confident in our
                  work.”
                </Text>
              </motion.div>

              <motion.div
                initial='hidden'
                whileInView='visible'
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeInUp}
                transition={{ delay: 0.3 }}
              >
                <BlueCard>Sunny</BlueCard>
              </motion.div>

              <motion.div
                initial='hidden'
                whileInView='visible'
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeInUp}
                transition={{ delay: 0.4 }}
              >
                <Text>Lead Technician</Text>
              </motion.div>
            </CenteredSlideContainer>
          </ImageContainer>

          <motion.div
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            transition={{ delay: 0.5 }}
          >
            <Description>
              As a local and trusted appliance repair team, our mission is to keep your home running
              smoothly with fast, reliable, and affordable service. We know how important it is when
              your refrigerator, washer, dryer, or oven stops working — it can interrupt your whole
              day. That's why our focus is on quick, professional repairs that last.
              <br />
              <br />
              Our technicians bring years of hands-on experience, training, and the right tools to
              handle even the toughest jobs. Whether it's fixing a cooling issue in a Sub-Zero
              refrigerator, replacing a drain pump in an LG washer, or repairing an igniter in a
              Viking oven — we've seen it all and we know how to get it done.
              {isLargeDesktop && (
                <>
                  {/* <br />
                  <br />
                    Our technicians bring years of hands-on experience, training, and the right tools to
              handle even the toughest jobs. Whether it's fixing a cooling issue in a Sub-Zero
              refrigerator, replacing a drain pump in an LG washer, or repairing an igniter in a
              Viking oven — we've seen it all and we know how to get it done. */}
                </>
              )}
            </Description>
          </motion.div>
        </ImageSection>

        <TeamContainer>
          {/* {!isLargeDesktop && (
            <motion.div
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
              transition={{ delay: 0.6 }}
            >
              <Description>
                <br />
                  Our technicians bring years of hands-on experience, training, and the right tools to
              handle even the toughest jobs. Whether it's fixing a cooling issue in a Sub-Zero
              refrigerator, replacing a drain pump in an LG washer, or repairing an igniter in a
              Viking oven — we've seen it all and we know how to get it done.
              </Description>
            </motion.div>
          )} */}

          <motion.div
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInRight}
            transition={{ delay: 0.7 }}
          >
            <TeamImage src={Team} alt='team' />
          </motion.div>
        </TeamContainer>
      </Content>
    </Section>
  );
};

export default OurMission;
