// MobileMenu.styled.tsx
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';

export interface StyledProps {
  $isOpen?: boolean;
  $darkMode?: boolean;
  $isScrolled?: boolean;
  $overlayOpen?: boolean;
}

export const ServiceContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 16px;
`;

export const ServiceLinkMobile = styled.div`
  position: relative;
  cursor: pointer;
  width: 100%;
`;

export const ArrowDownMobile = styled.button<{
  $overlayOpen?: boolean;
  $darkMode?: boolean;
  $isOpen: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  cursor: pointer;

  background: ${({ $overlayOpen, $darkMode }) => ($overlayOpen ? '#4a96e2ff' : $darkMode ? '#38b1f3ff' : '#242424')};

  transition:
    transform 0.3s ease,
    background-color 0.3s ease;

  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};

  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;

  &:hover {
    background-color: rgba(80, 150, 208, 0.2);
  }

  &:active {
    transform: ${({ $isOpen }) => ($isOpen ? 'rotate(180deg) scale(0.9)' : 'rotate(0deg) scale(0.9)')};
    background-color: rgba(80, 150, 208, 0.35);
  }

  svg {
    width: 20px;
    height: 20px;
    stroke: white;
    pointer-events: none; // щоб клік не йшов у svg
  }
`;

export const DropdownMenuMobile = styled(motion.div)`
  padding-left: 20px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.03);
  border-radius: 8px;
  margin: 8px 0;
`;

export const DropdownItemMobile = styled.div`
  padding: 12px 0;
`;

export const StyledNavLinkDrop = styled(NavLink)`
  color: #666;
  text-decoration: none;
  font-family: 'Geist', sans-serif;
  font-size: 14px;
  font-weight: 400;
  display: block;
  padding: 8px 0;
  transition: color 0.3s ease;

  &:hover {
    color: var(--purple-400);
  }

  &.active {
    color: var(--purple-400);
    font-weight: 500;
  }
`;

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1000;

  @media screen and (min-width: 1440px) {
    display: none;
  }
`;

export const BurgerButton = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 6px;
  padding: 8px;
  width: 36px;
  height: 36px;
  cursor: pointer;
  z-index: 1001;

  background: transparent;
  border: none;
`;

export const Line = styled(motion.div)<StyledProps>`
  width: 20px;
  height: 2px;
  background: ${({ $isOpen, $darkMode }) => {
    if ($isOpen) return 'black';
    return $darkMode ? 'black' : 'white';
  }};
  border-radius: 2px;
  transition: background 0.3s ease;
`;

export const MenuOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(254, 254, 254, 1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 5px;
  padding: 20px;
  z-index: 1000;
  overflow-y: auto;

  &::before {
    content: '';
    position: absolute;
    top: 8%;
    left: 0;
    width: 100%;
    border-top: 1px solid rgba(195, 187, 187, 1);
  }
  @media screen and (min-width: 768px) {
    &::before {
      top: 13%;
    }
  }
`;

export const MenuLink = styled(NavLink)`
  font-family: var(--font-family);
  font-weight: 500;
  font-size: 56px;
  line-height: 120%;
  color: var(--white-50);
  margin: 12px 0;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: var(--purple-400);
  }
`;

export const MenuItem = styled.p<{ $active?: boolean }>`
  color: ${({ $active }) => ($active ? '#3098EE' : '#242424')};
  font-family: 'Bebas Neue', sans-serif;
  font-size: 46px;
  font-weight: 400;
  line-height: 0.9em;
  display: flex;
  width: 100%;
  flex-direction: row-reverse;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
  transition: color 0.3s ease;

  &:hover,
  &.active {
    color: #3098ee;
  }
`;

export const Divider = styled.div<{ $active?: boolean }>`
  background-color: ${({ $active }) => ($active ? '#3098EE' : '#c3c2c2ff')};
  position: absolute;
  width: 90vh;
  height: 1px;
  transition: background-color 0.3s ease;

  &:hover,
  &.active {
    background-color: #3098ee;
  }
`;
