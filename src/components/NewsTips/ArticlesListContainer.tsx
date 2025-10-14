import React, { useEffect } from 'react';
import { motion, useScroll, useTransform, easeOut, useAnimation } from 'framer-motion';
import {
  StyledContainer,
  StyledArticleCard,
  StyledImage,
  StyledTitle,
  StyledDescription,
  StyledNavLink,
  TipsContainer,
  Titel,
} from './ArticlesListContainer.styles';
import image from '../../assets/icons/news&tips/News Article 2 Image Container (3).png';
import image1 from '../../assets/icons/equipment/Image3.png';
import image2 from '../../assets/icons/news&tips/t1.webp';
import image3 from '../../assets/icons/news&tips/bosch-dishwasher-door-open.jpg';
import image4 from '../../assets/icons/news&tips/tips.png';
import image5 from '../../assets/icons/news&tips/News Article 2 Image Container (7).png';

interface Article {
  id: number;
  image: string;
  title: string;
  description: string;
  path: string;
}

const articles: Article[] = [
  {
    id: 1,
    image: image5,
    title: 'HOW TO MAINTAIN YOUR REFRIGERATOR AND AVOID COSTLY REPAIRS',
    description:
      'Keep your fridge running smoothly with easy maintenance tips to prevent expensive breakdowns.',
    path: '/tips/refrigerator-maintenance#ap',
  },
  {
    id: 2,
    image: image1,
    title: 'TOP 5 SIGNS YOUR OVEN OR RANGE NEEDS REPAIR',
    description:
      'Gas range clicking? Oven not heating evenly? Discover common signs your oven needs professional attention.',
    path: '/tips/oven-repair-signs#ap',
  },
  {
    id: 3,
    image: image2,
    title: 'WASHER & DRYER MAINTENANCE TIPS EVERY HOMEOWNER SHOULD KNOW',
    description:
      'Extend the life of your laundry appliances with simple maintenance practices to avoid breakdowns.',
    path: '/tips/laundry-appliance-maintenance#ap',
  },
  {
    id: 4,
    image: image3,
    title: 'DISHWASHER NOT DRAINING? COMMON CAUSES AND EASY FIXES',
    description:
      'Learn how to troubleshoot and fix common dishwasher drainage problems quickly and effectively.',
    path: '/tips/dishwasher-drainage#ap',
  },
  {
    id: 5,
    image: image4,
    title: 'WHEN TO REPLACE VS. REPAIR YOUR APPLIANCE: EXPERT ADVICE',
    description:
      'Make smart decisions about whether to repair or replace your appliances based on cost, age, and efficiency.',
    path: '/tips/repair-vs-replace#ap',
  },
  {
    id: 6,
    image: image,
    title: 'WHY OEM PARTS MATTER IN APPLIANCE REPAIR',
    description:
      'Discover the importance of using genuine manufacturer parts for reliable and long-lasting appliance repairs.',
    path: '/tips/oem-parts#ap',
  },
];

// Прості анімаційні варіанти
const titleVariants = {
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

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easeOut,
    },
  },
  hover: {
    y: -5,
    transition: {
      duration: 0.3,
      ease: easeOut,
    },
  },
};

const imageVariants = {
  hidden: {
    opacity: 0,
    scale: 1.05,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: easeOut,
    },
  },
  hover: {
    scale: 1.03,
    transition: {
      duration: 0.3,
      ease: easeOut,
    },
  },
};

const contentVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: easeOut,
    },
  },
};

const ArticlesListContainer: React.FC = () => {
  const { scrollY } = useScroll();
  const controls = useAnimation();

  // М'який паралакс ефект для заголовка
  const titleY = useTransform(scrollY, [0, 300], [0, 30]);

  // Запускаємо анімацію при монтуванні компонента
  useEffect(() => {
    controls.start('visible');
  }, [controls]);

  return (
    <TipsContainer id='app'>
      <motion.div
        style={{ y: titleY }}
        initial='hidden'
        animate={controls}
        variants={titleVariants}
      >
        <Titel>
          News & <span>Tips</span>{' '}
        </Titel>
      </motion.div>

      <StyledContainer>
        {articles.map((article, index) => (
          <StyledNavLink to={article.path} key={article.id}>
            <motion.div
              initial='hidden'
              animate={controls}
              variants={cardVariants}
              transition={{ delay: index * 0.1 }}
              whileHover='hover'
            >
              <StyledArticleCard>
                <motion.div
                  variants={imageVariants}
                  transition={{ delay: index * 0.1 }}
                  whileHover='hover'
                >
                  <StyledImage src={article.image} alt={article.title} />
                </motion.div>

                <motion.div variants={contentVariants} transition={{ delay: index * 0.1 + 0.2 }}>
                  <div>
                    <StyledTitle>{article.title}</StyledTitle>
                    <StyledDescription>{article.description}</StyledDescription>
                  </div>
                </motion.div>
              </StyledArticleCard>
            </motion.div>
          </StyledNavLink>
        ))}
      </StyledContainer>
    </TipsContainer>
  );
};

export default ArticlesListContainer;
