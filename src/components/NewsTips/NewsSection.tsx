import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, useScroll, useTransform, easeOut, backOut } from 'framer-motion';
import {
  ArticleContainer,
  BackButton,
  ArticleTitle,
  ArticleImage,
  ArticleContent,
  ArticleText,
} from './NewsSection.styles';
import image from '../../assets/icons/news&tips/News Article 2 Image Container (3).png';
import image1 from '../../assets/icons/equipment/Image3.png';
import image2 from '../../assets/icons/news&tips/t1.webp';
import image3 from '../../assets/icons/news&tips/bosch-dishwasher-door-open.jpg';
import image4 from '../../assets/icons/news&tips/tips.png';
import image5 from '../../assets/icons/news&tips/News Article 2 Image Container (7).png';
import ArticlesListContainer from './Details';

interface Article {
  id: number;
  image: string;
  title: string;
  description: string;
  content: string;
}

const articles: Article[] = [
  {
    id: 1,
    image: image5,
    title: 'HOW TO MAINTAIN YOUR REFRIGERATOR AND AVOID COSTLY REPAIRS',
    description:
      'Keep your fridge running smoothly with easy maintenance tips to prevent expensive breakdowns.',
    content: `A refrigerator is one of the hardest-working appliances in your home. A little regular maintenance can help you avoid expensive breakdowns.

Clean the Condenser Coils
Dust and debris on condenser coils make your fridge work harder and increase energy bills. Clean the coils every 6–12 months with a vacuum or coil brush.

Check the Door Seals
Worn or dirty gaskets let cold air escape. Wipe the seals with warm soapy water and replace them if they are cracked or loose.

Replace the Water Filter
If your refrigerator has a water dispenser or ice maker, replace the filter every 6 months. This keeps the water clean and prevents clogs in the system.

Keep Temperatures Set Correctly
The ideal setting is 37°F for the fridge and 0°F for the freezer. Incorrect settings can cause food spoilage or frost buildup.

Pro Tip: If your fridge still isn't cooling properly, it may need professional service. In Thousand Oaks and Ventura County, Airtexno specializes in Sub-Zero, Thermador, Viking, and GE Monogram refrigerators.`,
  },
  {
    id: 2,
    image: image1,
    title: 'TOP 5 SIGNS YOUR OVEN OR RANGE NEEDS REPAIR',
    description:
      'Gas range clicking? Oven not heating evenly? Discover common signs your oven needs professional attention.',
    content: `Your oven and range are the heart of your kitchen. Here are five signs that it's time to call a technician.

1. Burners Keep Clicking
Gas burners should stop clicking once the flame ignites. Constant clicking often means a faulty igniter or dirty electrode.

2. Uneven Baking
If food cooks unevenly, the heating element or temperature sensor may be failing.

3. Gas Smell
This is a serious issue—turn off the gas supply immediately and call a professional.

4. Oven Won't Heat
If your oven doesn't heat up, it could be a bad igniter, control board, or thermostat.

5. Knobs or Controls Don't Respond
When buttons or knobs stop working, the electronic control board might need replacement.

Pro Tip: Airtexno repairs premium brands like Thermador, Wolf, Viking, and GE Monogram in Thousand Oaks and surrounding areas.`,
  },
  {
    id: 3,
    image: image2,
    title: 'WASHER & DRYER MAINTENANCE TIPS EVERY HOMEOWNER SHOULD KNOW',
    description:
      'Extend the life of your laundry appliances with simple maintenance practices to avoid breakdowns.',
    content: `Your washer and dryer handle heavy loads every week. With proper care, they'll last for years.

Clean the Washer Filter
Most washers have a drain filter that catches lint, coins, and debris. Clean it every few months to prevent clogs.

Balance the Washer
If your washer shakes or "walks" across the floor, adjust the leveling legs to keep it stable.

Clean the Dryer Lint Trap
Always remove lint after each load. A clogged lint trap reduces efficiency and can become a fire hazard.

Check the Dryer Vent
At least once a year, clean the vent hose and outside exhaust. Poor airflow causes overheating and long drying times.

Pro Tip: If your washer isn't spinning or your dryer isn't heating, call Airtexno. We service Whirlpool, LG, Samsung, Maytag, and more in Ventura County.`,
  },
  {
    id: 4,
    image: image3,
    title: 'DISHWASHER NOT DRAINING? COMMON CAUSES AND EASY FIXES',
    description:
      'Learn how to troubleshoot and fix common dishwasher drainage problems quickly and effectively.',
    content: `A dishwasher that won't drain is a common household problem. Here's what to check:

1. Clogged Filter
Food particles often block the filter at the bottom. Remove and rinse it under warm water.

2. Drain Hose Issues
Make sure the hose isn't kinked or clogged. Check for blockages near the sink connection.

3. Air Gap or High Loop
California plumbing code requires a dishwasher air gap or high loop. If it's clogged, water can back up.

4. Broken Drain Pump
If you hear the motor but no water drains, the pump may have failed.

Pro Tip: Airtexno installs and repairs dishwashers in Thousand Oaks, Westlake Village, and Camarillo. We specialize in KitchenAid, Bosch, and GE models.`,
  },
  {
    id: 5,
    image: image4,
    title: 'WHEN TO REPLACE VS. REPAIR YOUR APPLIANCE: EXPERT ADVICE',
    description:
      'Make smart decisions about whether to repair or replace your appliances based on cost, age, and efficiency.',
    content: `Every homeowner faces the repair-or-replace question. Here's how to decide.

Consider the Age
Refrigerators: 10–15 years
Ovens: 10–20 years
Washers/Dryers: 8–12 years
Dishwashers: 7–12 years

Compare the Costs
If the repair costs more than 50% of a new appliance, replacement is usually smarter.

Think About Energy Efficiency
New appliances are often more energy-efficient, which saves money in the long run.

Brand & Build Quality
High-end brands like Sub-Zero, Thermador, and Viking are worth repairing because parts are available and the units are built to last.

Pro Tip: Not sure what to do? Airtexno provides honest advice and upfront estimates, so you don't waste money on unnecessary repairs.`,
  },
  {
    id: 6,
    image: image,
    title: 'WHY OEM PARTS MATTER IN APPLIANCE REPAIR',
    description:
      'Discover the importance of using genuine manufacturer parts for reliable and long-lasting appliance repairs.',
    content: `When repairing appliances, you’ll often hear the term OEM parts. Here’s why they matter.

What Are OEM Parts?
OEM stands for Original Equipment Manufacturer. These are the exact parts your appliance was originally built with.

Why Choose OEM Over Aftermarket? <br/>
 • Reliability: Designed to fit perfectly and work as intended.
 <br/> • Warranty Protection: Helps maintain your manufacturer’s warranty.
 <br/> • Longevity: Aftermarket parts may fail sooner or perform inconsistently.

Examples:
Using a genuine Sub-Zero compressor instead of an aftermarket one ensures proper cooling performance. An OEM KitchenAid dishwasher pump will last longer and run quieter.

Pro Tip: At Airtexno, we only use genuine OEM or manufacturer-approved parts for all appliance repairs in Thousand Oaks and Ventura County.`,
  },
];

// Унікальні анімаційні варіанти
const pageVariants = {
  hidden: {
    opacity: 0,
    x: -100,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: easeOut,
    },
  },
  exit: {
    opacity: 0,
    x: 100,
    transition: {
      duration: 0.5,
      ease: easeOut,
    },
  },
};

const backButtonVariants = {
  hidden: {
    opacity: 0,
    y: -30,
    rotate: -10,
  },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: {
      duration: 0.6,
      ease: backOut,
      delay: 0.1,
    },
  },
  hover: {
    scale: 1.05,
    x: -5,
    transition: {
      duration: 0.2,
      ease: easeOut,
    },
  },
  tap: {
    scale: 0.95,
  },
};

const titleVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.9,
    textShadow: '0 0 0px rgba(0,0,0,0)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    textShadow: ['0 0 0px rgba(0,0,0,0)', '0 0 30px rgba(0,0,0,0.3)', '0 0 10px rgba(0,0,0,0.1)'],
    transition: {
      duration: 1,
      ease: backOut,
      delay: 0.2,
    },
  },
};

const imageVariants = {
  hidden: {
    opacity: 0,
    scale: 1.2,
    rotate: -5,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 1.2,
      ease: backOut,
      delay: 0.3,
    },
  },
};

const contentVariants = {
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
      delay: 0.4,
    },
  },
};

const textRevealVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    skewY: 2,
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    skewY: 0,
    transition: {
      duration: 0.6,
      ease: easeOut,
      delay: 0.5 + i * 0.05,
    },
  }),
};

const ArticleDetail: React.FC<{ articleId?: number }> = ({ articleId }) => {
  const { id } = useParams<{ id: string }>();
  const currentArticleId = articleId || parseInt(id || '1');
  const article = articles.find(a => a.id === currentArticleId);

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.9]);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 500);
      }
    }
  }, [article]);

  if (!article) {
    return <div>Article not found</div>;
  }

  // Розділяємо контент на параграфи для анімації
  const paragraphs = article.content.split('\n\n');

  return (
    <motion.div
      variants={pageVariants}
      initial='hidden'
      animate='visible'
      exit='exit'
      style={{ y, opacity }}
    >
      <ArticleContainer id='ap'>
        <motion.div variants={backButtonVariants} whileHover='hover' whileTap='tap'>
          <BackButton to='/tips'>← Back to Tips</BackButton>
        </motion.div>

        <motion.div variants={titleVariants}>
          <ArticleTitle>{article.title}</ArticleTitle>
        </motion.div>

        <motion.div variants={imageVariants}>
          <ArticleImage src={article.image} alt={article.title} />
        </motion.div>

        <motion.div variants={contentVariants}>
          <ArticleContent>
            {paragraphs.map((paragraph, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={textRevealVariants}
                initial='hidden'
                animate='visible'
              >
                <ArticleText dangerouslySetInnerHTML={{ __html: paragraph }} />
                {index < paragraphs.length - 1 && (
                  <>
                    <br />
                  </>
                )}
              </motion.div>
            ))}
          </ArticleContent>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <ArticlesListContainer />
        </motion.div>
      </ArticleContainer>
    </motion.div>
  );
};

export default ArticleDetail;
