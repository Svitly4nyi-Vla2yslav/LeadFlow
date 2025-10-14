// BurgerMenu.tsx
import { useEffect, useState } from 'react';
import { AnimatePresence, easeInOut } from 'framer-motion';
import {
  Wrapper,
  BurgerButton,
  Line,
  MenuOverlay,
  MenuLink,
  MenuItem,
  Divider,
  ServiceLinkMobile,
  ArrowDownMobile,
  DropdownMenuMobile,
  DropdownItemMobile,
  StyledNavLinkDrop,
  ServiceContentWrapper,
} from './MobileMenu.styled';
import { styled } from 'styled-components';
import { useLocation } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 100vw;
  overflow: auto;
  margin-top: 40px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 8px;
  flex-shrink: 0;
  width: 166px;
`;

const Item = styled.p`
  color: #242424;
  font-family: 'Geist', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.25em;
  width: 100%;
`;

const FooterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.875rem;
  width: 92%;
  overflow: auto;
  position: absolute;
  bottom: 2%;

  &::before {
    content: '';
    position: absolute;
    top: 8%;
    left: 0;
    width: 100%;
    border-top: 1px solid rgba(195, 187, 187, 1);
  }
`;

const OverlayBar = styled.div`
  background: rgba(33, 33, 33, 0.3);
  width: 100%;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  width: 100%;
`;

const TextBold = styled.p`
  color: #242424;
  font-family: 'Geist', sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.2em;
  width: fit-content;
`;

const TextNormal = styled.p`
  color: #242424;
  font-family: 'Geist', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.2em;
  width: fit-content;
`;

const topLineVariants = {
  open: { rotate: 45, y: 8 },
  closed: { rotate: 0, y: 0 },
};

const middleLineVariants = {
  open: { opacity: 0 },
  closed: { opacity: 1 },
};

const bottomLineVariants = {
  open: { rotate: -45, y: -8 },
  closed: { rotate: 0, y: 0 },
};

const menuVariants = {
  open: { opacity: 1, x: 0 },
  closed: { opacity: 0, x: '-100%' },
};

const dropdownVariants = {
  open: {
    opacity: 1,
    height: 'auto',
    transition: {
      duration: 0.3,
      ease: easeInOut,
    },
  },
  closed: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.3,
      ease: easeInOut,
    },
  },
};

type NavLink = {
  to: string;
  label: string;
  active?: boolean;
  isService?: boolean;
  subItems?: Array<{
    to: string;
    label: string;
  }>;
};

type BurgerMenuProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const BurgerMenu = ({ isOpen, setIsOpen }: BurgerMenuProps) => {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const location = useLocation();
  const [isBurgerOpen] = useState(false);

  const isDarkMode = ['/contact', '/service', '/tips', '/pricing', '/fridge', '/dryer', '/oven-repair'].some(path =>
    location.pathname.startsWith(path)
  );

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const closeMenu = () => {
    setIsOpen(false);
    setIsServicesOpen(false);
  };

  // const toggleServicesMenu = (e?: React.SyntheticEvent) => {
  //   e?.preventDefault();
  //   e?.stopPropagation();
  //   setIsServicesOpen(prev => !prev);
  // };

  const isActivePage = (path: string) => {
    const currentPath = location.pathname;
    if (path === '/home#hero') {
      return currentPath === '/' || currentPath === '/home';
    }
    return currentPath.startsWith(path.split('#')[0]);
  };

  const isOverlayOpen = isServicesOpen || isBurgerOpen;
  const navLinks: NavLink[] = [
    { to: '/home#hero', label: 'Home' },
    {
      to: '/service#all',
      label: 'Services',
      isService: true,
      subItems: [
        { to: '/fridge#ap', label: 'Refrigerator Repair' },
        { to: '/dryer#ap', label: 'Dryer Repair' },
        { to: '/oven-repair#ap', label: 'Oven Repair' },
      ],
    },
    { to: '/about#ap', label: 'About Us' },
    { to: '/tips#app', label: 'Tips' },
    { to: '/contact#ap', label: 'Contact' },
  ];

  return (
    <Wrapper>
      <BurgerButton
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        <Line
          $isOpen={isOpen}
          $darkMode={isDarkMode}
          animate={isOpen ? 'open' : 'closed'}
          variants={topLineVariants}
        />
        <Line
          $isOpen={isOpen}
          $darkMode={isDarkMode}
          animate={isOpen ? 'open' : 'closed'}
          variants={middleLineVariants}
        />
        <Line
          $isOpen={isOpen}
          $darkMode={isDarkMode}
          animate={isOpen ? 'open' : 'closed'}
          variants={bottomLineVariants}
        />
      </BurgerButton>
      <AnimatePresence>
        {isOpen && (
          <MenuOverlay
            initial='closed'
            animate='open'
            exit='closed'
            variants={menuVariants}
            transition={{ duration: 0.3 }}
          >
            {navLinks.map((link, index) => {
              const isActive = isActivePage(link.to);

              if (link.isService && link.subItems) {
                return (
                  <ServiceLinkMobile key={index}>
                    <ServiceContentWrapper>
                      <MenuLink to={link.to} onClick={closeMenu}>
                        <MenuItem $active={isActive}>{link.label}</MenuItem>
                      </MenuLink>
                      <ArrowDownMobile
                        type='button'
                        $overlayOpen={isOverlayOpen}
                        $darkMode={isDarkMode}
                        $isOpen={isServicesOpen}
                        onClick={e => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsServicesOpen(prev => !prev);
                          e.currentTarget.blur(); // скидаємо фокус після кліку
                        }}
                        aria-label='Toggle services menu'
                      >
                        <svg
                          width='20'
                          height='20'
                          viewBox='0 0 24 24'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M6 9l6 6 6-6'
                            stroke='white'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                      </ArrowDownMobile>
                    </ServiceContentWrapper>

                    <AnimatePresence>
                      {isServicesOpen && (
                        <DropdownMenuMobile
                          initial='closed'
                          animate='open'
                          exit='closed'
                          variants={dropdownVariants}
                        >
                          {link.subItems.map((subItem, subIndex) => (
                            <DropdownItemMobile key={subIndex}>
                              <StyledNavLinkDrop
                                to={subItem.to}
                                onClick={closeMenu}
                                className={isActivePage(subItem.to) ? 'active' : ''}
                              >
                                {subItem.label}
                              </StyledNavLinkDrop>
                            </DropdownItemMobile>
                          ))}
                        </DropdownMenuMobile>
                      )}
                    </AnimatePresence>
                    <Divider />
                  </ServiceLinkMobile>
                );
              }

              return (
                <div key={index}>
                  <MenuLink to={link.to} onClick={closeMenu}>
                    <MenuItem $active={isActive}>{link.label}</MenuItem>
                  </MenuLink>
                  <Divider />
                </div>
              );
            })}

            <Container>
              <Column>
                <Item>Refrigerator Repair</Item>
                <Item>Dryer Repair</Item>
                <Item>Oven Repair</Item>
                <Item>Range & Stove Repair</Item>
              </Column>
              <Column>
                <Item>Washer Repair</Item>
                <Item>Dishwasher Repair</Item>
                <Item>Cooktop Repair</Item>
                <Item>Built-in and High-End Brands Repair</Item>
              </Column>
            </Container>

            <FooterContainer>
              <OverlayBar />
              <TextContainer>
                <TextBold>Designed by TRBN</TextBold>
                <TextNormal>Copyright © 2025 Airtexno - All Rights Reserved.</TextNormal>
              </TextContainer>
            </FooterContainer>
          </MenuOverlay>
        )}
      </AnimatePresence>
    </Wrapper>
  );
};

export default BurgerMenu;
