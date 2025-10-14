import React from 'react';
import { motion, easeOut, backOut } from 'framer-motion';
import BackgroundImage from '../../../assets/icons/ProccessSection.png';
import {
  MainContainer,
  TitleServing,
  SubtitleServing,
  Wrapper,
  Card,
  CardHeader,
  IconWrapper,
  County,
  City,
} from './OurProcess.styled';

interface ServiceArea {
  title: string;
  text: string;
  icon: JSX.Element;
}

const serviceAreas: ServiceArea[] = [
  {
    title: 'CALL US',
    text: "Call us to schedule your repair. We'll ask a few details and find the best time for you.",
    icon: (
      <svg
        width='20'
        height='20'
        viewBox='0 0 20 20'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M6.98356 7.37779C7.56356 8.58581 8.35422 9.71801 9.35553 10.7193C10.3568 11.7206 11.4891 12.5113 12.6971 13.0913C12.801 13.1412 12.8529 13.1661 12.9187 13.1853C13.1523 13.2534 13.4392 13.2045 13.637 13.0628C13.6927 13.0229 13.7403 12.9753 13.8356 12.88C14.1269 12.5887 14.2726 12.443 14.4191 12.3478C14.9715 11.9886 15.6837 11.9886 16.2361 12.3478C16.3825 12.443 16.5282 12.5887 16.8196 12.88L16.9819 13.0424C17.4248 13.4853 17.6462 13.7067 17.7665 13.9446C18.0058 14.4175 18.0058 14.9761 17.7665 15.449C17.6462 15.6869 17.4248 15.9083 16.9819 16.3512L16.8506 16.4825C16.4092 16.9239 16.1886 17.1446 15.8885 17.3131C15.5556 17.5001 15.0385 17.6346 14.6567 17.6334C14.3126 17.6324 14.0774 17.5657 13.607 17.4322C11.0792 16.7147 8.69387 15.361 6.70388 13.371C4.7139 11.381 3.36017 8.99569 2.6427 6.46786C2.50919 5.99749 2.44244 5.7623 2.44141 5.41818C2.44028 5.03633 2.57475 4.51925 2.76176 4.18633C2.9303 3.88631 3.15098 3.66563 3.59233 3.22428L3.72369 3.09292C4.16656 2.65005 4.388 2.42861 4.62581 2.30833C5.09878 2.0691 5.65734 2.0691 6.1303 2.30832C6.36812 2.42861 6.58955 2.65005 7.03242 3.09291L7.19481 3.25531C7.48615 3.54665 7.63182 3.69231 7.72706 3.8388C8.08622 4.3912 8.08622 5.10336 7.72706 5.65576C7.63182 5.80225 7.48615 5.94791 7.19481 6.23925C7.09955 6.33451 7.05192 6.38214 7.01206 6.43782C6.87038 6.63568 6.82146 6.92256 6.88957 7.15619C6.90873 7.22193 6.93367 7.27389 6.98356 7.37779Z'
          stroke='#242424'
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    ),
  },
  {
    title: 'WE RESPOND',
    text: 'Our team answers all your questions and confirms a convenient appointment.',
    icon: (
      <svg
        width='20'
        height='20'
        viewBox='0 0 20 20'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M8.33268 12.5001L5.76997 15.0948C5.4125 15.4568 5.23377 15.6377 5.08014 15.6505C4.94686 15.6616 4.81636 15.608 4.72931 15.5064C4.62898 15.3894 4.62898 15.1351 4.62898 14.6264V13.3264C4.62898 12.87 4.25524 12.5398 3.80369 12.4737V12.4737C2.7108 12.3136 1.8525 11.4553 1.69241 10.3624C1.66602 10.1822 1.66602 9.96718 1.66602 9.53712V5.66675C1.66602 4.26662 1.66602 3.56655 1.9385 3.03177C2.17818 2.56137 2.56063 2.17892 3.03104 1.93923C3.56582 1.66675 4.26588 1.66675 5.66602 1.66675H11.8327C13.2328 1.66675 13.9329 1.66675 14.4677 1.93923C14.9381 2.17892 15.3205 2.56137 15.5602 3.03177C15.8327 3.56655 15.8327 4.26662 15.8327 5.66675V9.16675M15.8327 18.3334L14.019 17.0725C13.7641 16.8952 13.6366 16.8066 13.4978 16.7438C13.3747 16.688 13.2453 16.6474 13.1123 16.6229C12.9625 16.5953 12.8073 16.5953 12.4968 16.5953H10.9993C10.0659 16.5953 9.59922 16.5953 9.2427 16.4137C8.92909 16.2539 8.67413 15.9989 8.51434 15.6853C8.33268 15.3288 8.33268 14.8621 8.33268 13.9287V11.8334C8.33268 10.9 8.33268 10.4333 8.51434 10.0768C8.67413 9.76316 8.92909 9.50819 9.2427 9.3484C9.59922 9.16675 10.0659 9.16675 10.9993 9.16675H15.666C16.5994 9.16675 17.0661 9.16675 17.4227 9.3484C17.7363 9.50819 17.9912 9.76316 18.151 10.0768C18.3327 10.4333 18.3327 10.9 18.3327 11.8334V14.0953C18.3327 14.8719 18.3327 15.2602 18.2058 15.5665C18.0367 15.9748 17.7122 16.2993 17.3038 16.4685C16.9975 16.5953 16.6093 16.5953 15.8327 16.5953V18.3334Z'
          stroke='#242424'
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    ),
  },
  {
    title: 'ON-SITE VISIT',
    text: 'Our technician arrives, inspects the issue, and provides a clear estimate.',
    icon: (
      <svg
        width='20'
        height='16'
        viewBox='0 0 20 16'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M4.16602 8.83325H6.66602M1.66602 5.49992L3.33268 6.33325L4.39155 3.15664C4.61011 2.50096 4.71939 2.17312 4.92209 1.93074C5.10108 1.7167 5.33095 1.55102 5.5906 1.4489C5.88465 1.33325 6.23022 1.33325 6.92137 1.33325H13.0773C13.7685 1.33325 14.1141 1.33325 14.4081 1.4489C14.6678 1.55102 14.8976 1.7167 15.0766 1.93074C15.2793 2.17312 15.3886 2.50096 15.6071 3.15664L16.666 6.33325L18.3327 5.49992M13.3327 8.83325H15.8327M5.66602 6.33325H14.3327C15.7328 6.33325 16.4329 6.33325 16.9677 6.60574C17.4381 6.84542 17.8205 7.22787 18.0602 7.69828C18.3327 8.23305 18.3327 8.93312 18.3327 10.3333V12.5833C18.3327 12.9705 18.3327 13.1641 18.3007 13.3251C18.1691 13.9862 17.6523 14.503 16.9912 14.6346C16.8302 14.6666 16.6366 14.6666 16.2493 14.6666H15.8327C14.9122 14.6666 14.166 13.9204 14.166 12.9999C14.166 12.7698 13.9795 12.5833 13.7493 12.5833H6.24935C6.01923 12.5833 5.83268 12.7698 5.83268 12.9999C5.83268 13.9204 5.08649 14.6666 4.16602 14.6666H3.74935C3.36214 14.6666 3.16853 14.6666 3.00753 14.6346C2.34638 14.503 1.82955 13.9862 1.69804 13.3251C1.66602 13.1641 1.66602 12.9705 1.66602 12.5833V10.3333C1.66602 8.93312 1.66602 8.23305 1.9385 7.69828C2.17818 7.22787 2.56063 6.84542 3.03104 6.60574C3.56582 6.33325 4.26588 6.33325 5.66602 6.33325Z'
          stroke='#242424'
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    ),
  },
  {
    title: 'REPAIR & FINISH',
    text: 'We repair your appliance on the spot whenever possible and make sure everything works perfectly before we leave.',
    icon: (
      <svg
        width='20'
        height='19'
        viewBox='0 0 20 19'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M4.99984 5.00008L8.74984 8.75008M4.99984 5.00008H2.49984L1.6665 2.50008L2.49984 1.66675L4.99984 2.50008V5.00008ZM16.049 2.28426L13.8593 4.47394C13.5293 4.80395 13.3643 4.96896 13.3025 5.15923C13.2481 5.3266 13.2481 5.50689 13.3025 5.67426C13.3643 5.86454 13.5293 6.02954 13.8593 6.35956L14.057 6.55727C14.387 6.88729 14.552 7.05229 14.7423 7.11412C14.9097 7.1685 15.09 7.1685 15.2574 7.11412C15.4476 7.05229 15.6126 6.88729 15.9426 6.55727L17.9909 4.50901C18.2115 5.04582 18.3332 5.63374 18.3332 6.25008C18.3332 8.78139 16.2811 10.8334 13.7498 10.8334C13.4447 10.8334 13.1465 10.8036 12.858 10.7467C12.4528 10.6668 12.2503 10.6268 12.1275 10.6391C11.9969 10.6521 11.9326 10.6717 11.8169 10.7336C11.7081 10.7918 11.599 10.9009 11.3807 11.1192L5.4165 17.0834C4.72615 17.7738 3.60686 17.7738 2.91651 17.0834C2.22615 16.393 2.22615 15.2738 2.91651 14.5834L8.88069 8.61922C9.09898 8.40094 9.20813 8.29179 9.26635 8.18299C9.32825 8.06731 9.34783 8.00297 9.36084 7.87242C9.37307 7.74963 9.33312 7.54707 9.25323 7.14195C9.19633 6.85346 9.1665 6.55526 9.1665 6.25008C9.1665 3.71878 11.2185 1.66675 13.7498 1.66675C14.5878 1.66675 15.3732 1.8916 16.049 2.28426ZM9.99988 12.5L14.5832 17.0833C15.2735 17.7737 16.3928 17.7737 17.0832 17.0833C17.7735 16.393 17.7735 15.2737 17.0832 14.5833L13.3126 10.8128C13.0457 10.7876 12.7854 10.7394 12.5338 10.6704C12.2096 10.5814 11.854 10.646 11.6162 10.8837L9.99988 12.5Z'
          stroke='#242424'
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    ),
  },
];

const iconSpinAnimation = {
  hidden: {
    opacity: 0,
    scale: 0,
    rotate: -180,
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.8,
      ease: backOut,
      delay: 0.3,
    },
  },
  hover: {
    rotate: 360,
    scale: 1.2,
    transition: {
      duration: 0.6,
      ease: easeOut,
    },
  },
};

const titleWaveAnimation = {
  hidden: {
    opacity: 0,
    y: 50,
    skewY: 5,
  },
  visible: {
    opacity: 1,
    y: 0,
    skewY: 0,
    transition: {
      duration: 0.8,
      ease: easeOut,
    },
  },
};

const cardStaggerAnimation = {
  hidden: {
    opacity: 0,
    x: -100,
    scale: 0.9,
  },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      delay: index * 0.2,
      ease: easeOut,
    },
  }),
  hover: {
    y: -15,
    scale: 1.05,
    rotateY: 10,
    boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
    transition: {
      duration: 0.4,
      ease: easeOut,
    },
  },
};

const textFlowAnimation = {
  hidden: {
    opacity: 0,
    x: 50,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.9,
      ease: easeOut,
      delay: 0.5,
    },
  },
};

const pulseGlowAnimation = {
  hidden: {
    opacity: 0,
    scale: 0.5,
    textShadow: '0 0 0px rgba(48, 152, 238, 0)',
  },
  visible: {
    opacity: 1,
    scale: 1,
    textShadow: [
      '0 0 0px rgba(48, 152, 238, 0)',
      '0 0 20px rgba(48, 152, 238, 0.8)',
      '0 0 10px rgba(48, 152, 238, 0.4)',
    ],
    transition: {
      duration: 1.5,
      ease: easeOut,
      delay: 0.2,
    },
  },
};

const OurProcess: React.FC = () => {
  return (
    <MainContainer $bg={BackgroundImage}>
      <motion.div
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.3 }}
        variants={titleWaveAnimation}
      >
        <TitleServing>Our Process</TitleServing>
      </motion.div>

      <motion.div
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.3 }}
        variants={textFlowAnimation}
      >
        <SubtitleServing>4 Simple Steps to Reliable Appliance Repair</SubtitleServing>
      </motion.div>

      <Wrapper>
        {serviceAreas.map((area, index) => (
          <motion.div
            key={index}
            custom={index}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.2 }}
            variants={cardStaggerAnimation}
            whileHover='hover'
          >
            <Card>
              <CardHeader>
                <motion.div variants={iconSpinAnimation} whileHover='hover'>
                  <IconWrapper>{area.icon}</IconWrapper>
                </motion.div>
              </CardHeader>

              <motion.div
                initial='hidden'
                whileInView='visible'
                viewport={{ once: true, amount: 0.3 }}
                variants={pulseGlowAnimation}
                transition={{ delay: index * 0.2 + 0.3 }}
              >
                <County>{area.title}</County>
              </motion.div>

              <motion.div
                initial='hidden'
                whileInView='visible'
                viewport={{ once: true, amount: 0.3 }}
                variants={textFlowAnimation}
                transition={{ delay: index * 0.2 + 0.4 }}
              >
                <City>{area.text}</City>
              </motion.div>
            </Card>
          </motion.div>
        ))}
      </Wrapper>
    </MainContainer>
  );
};

export default OurProcess;
