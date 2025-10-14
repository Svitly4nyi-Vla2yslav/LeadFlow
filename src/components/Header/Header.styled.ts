import styled, { css } from 'styled-components';
import { NavLink } from 'react-router-dom';

export interface StyledProps {
  $isScrolled?: boolean;
  $overlayOpen?: boolean;
  $darkMode?: boolean;
}

// Спочатку оголошуємо всі базові компоненти
export const StyledNavLink = styled(NavLink)<StyledProps>`
  color: ${({ $overlayOpen, $darkMode }) =>
    $overlayOpen
      ? '#000000'
      : $darkMode
      ? '#000000'
      : '#FFFFFF'};
  text-decoration: none;
  font-weight: 500;
  font-size: 16px;
  line-height: 1.5;
  display: flex;
  align-items: center;
  transition: all 0.3s ease-in-out;
  position: relative;
  padding: 10px 0;

  &:hover {
    color: ${({ $overlayOpen, $darkMode }) =>
      $overlayOpen
        ? '#555555'
        : $darkMode
        ? '#555555'
        : '#CCCCCC'};
  }

  &.active {
    color: var(--purple-400);
    
    &::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: var(--purple-400);
    }
  }
`;


export const ArrowDown = styled.img<StyledProps>`
  margin-left: 4px;
  transition: transform 0.3s ease;
  filter: ${({ $overlayOpen, $darkMode }) =>
    $overlayOpen
      ? 'brightness(0) saturate(100%)'
      : $darkMode
      ? 'brightness(0) saturate(100%)'
      : 'brightness(0) invert(1)'};
`;

// Тепер ServiceLink може посилатися на вже оголошені компоненти
export const ServiceLink = styled.div`
  position: relative;
  cursor: pointer;
  color: #808080;
  font-family: var(--font-family);
  font-weight: 600;
  font-size: 14px;
  text-align: center;
  display: flex;
  align-items: center;
  
  &:hover,
  &.active {
    color: var(--purple-400);
    
    // Використовуємо більш специфічний селектор
    & > ${StyledNavLink} {
      color: var(--purple-400);
    }
    
    // Використовуємо більш специфічний селектор для стрілки
    & > ${StyledNavLink} > ${ArrowDown} {
      filter: brightness(0) saturate(100%) invert(39%) sepia(93%) saturate(747%) hue-rotate(238deg) brightness(93%) contrast(91%);
      transform: rotate(180deg);
    }
  }
`;

// Решта компонентів залишаються незмінними...
export const DropdownMenu = styled.div`
  position: absolute;
  right: -112px;
  top: 100%;
  border-radius: 12px;
  box-shadow: 
    0 8px 24px rgba(0, 0, 0, 0.15),
    0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 12px 0;
  min-width: 280px;
  z-index: 1000;
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
  opacity: 0;
  transform: translateY(-10px);
  animation: fadeIn 0.2s ease forwards;
  
  @keyframes fadeIn {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const DropdownItem = styled.div`
  padding: 12px 24px;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(147, 51, 234, 0.1);
  }

  a {
    color: #333;
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    display: block;
    transition: color 0.2s ease;
    
    &:hover {
      color: var(--purple-400);
    }
    
    &.active {
      color: var(--purple-400);
      font-weight: 600;
    }
  }
`;

export const NavbarContainer = styled.nav<StyledProps>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 3100;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: transparent;
  transition: all 180ms ease;
  will-change: transform;
  padding: 10px;
  ${({ $isScrolled }) =>
    $isScrolled &&
    css`
      background: rgba(0, 0, 0, 0.39);
      -webkit-backdrop-filter: blur(5px);
      backdrop-filter: blur(5px);
    `}
  @media screen and (min-width: 768px) {
    padding: 10px;
  }
`;

export const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;

  @media (min-width: 768px) {
    padding: 0 32px;
  }

  @media (min-width: 1440px) {
    padding: 0 40px;
  }
`;

export const Logo = styled(NavLink)<StyledProps>`
  display: flex;
  align-items: center;
  text-decoration: none;
  z-index: 1001;

  img {
    height: 32px;
    width: auto;
    filter: ${({ $overlayOpen, $darkMode }) =>
      $overlayOpen
        ? 'brightness(0)'
        : $darkMode
        ? 'brightness(0)'
        : 'brightness(0) invert(1)'};
    transition: filter 0.3s ease-in-out;

    @media (min-width: 768px) {
      height: 40px;
    }
  }
`;

export const NavList = styled.ul`
  display: flex;
  gap: 32px;
  list-style: none;
  margin: 0;
  padding: 0;

  @media (min-width: 1440px) {
    gap: 40px;
    align-items: center;
  }
`;

export const NavItem = styled.li`
  position: relative;
`;

export const TabletContainer = styled.div`
  display: none;
  @media screen and (min-width: 768px) {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    width: 100%;
    max-width: 1440px;
    margin: 0 auto;
    flex-wrap: wrap;
    padding: 8px 16px 0px 16px;
  }
  @media screen and (min-width: 1440px) {
    justify-content: end;
    gap: 20px;
    width: auto;
  }
`;

export const ContainerLink = styled.div`
  display: none;
  @media screen and (min-width: 768px) {
    display: flex;
    flex-direction: column;
  }
`;

export const LinkInfo = styled.span<StyledProps>`
  display: none;
  @media screen and (min-width: 768px) {
    display: flex;
    font-family: var(--font-family);
    font-weight: 400;
    font-size: 13px;
    line-height: 125%;
    color: ${({ $overlayOpen, $darkMode }) =>
      $overlayOpen
        ? '#000000'
        : $darkMode
        ? '#000000'
        : '#FFFFFF'};
    width: max-content;
    transition: all 0.3s ease;

    &:hover {
      color: ${({ $overlayOpen, $darkMode }) =>
        $overlayOpen
          ? '#555555'
          : $darkMode
          ? '#555555'
          : '#CCCCCC'};
      transform: translateX(2px);
    }

    &:focus {
      outline: 2px solid var(--purple-400);
      outline-offset: 2px;
      border-radius: 4px;
    }

    a {
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 13px;
      line-height: 125%;
      color: ${({ $overlayOpen, $darkMode }) =>
        $overlayOpen
          ? '#000000'
          : $darkMode
          ? '#000000'
          : '#FFFFFF'};
      transition: color 0.3s ease;

      &:hover {
        color: var(--purple-400);
      }

      &:focus {
        outline: 2px solid var(--purple-400);
        outline-offset: 2px;
        border-radius: 4px;
      }
    }

    img {
      margin-right: 5px;
      transition: all 0.3s ease;
      filter: ${({ $overlayOpen }) =>
        $overlayOpen
          ? 'brightness(0) saturate(100%)'
          : 'none'};

      &:hover {
        transform: scale(1.1);
        filter: ${({ $overlayOpen }) =>
          $overlayOpen
            ? 'brightness(0) saturate(100%)'
            : 'brightness(1.2)'};
      }
    }
  }
`;

export const LangButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const TransparentButton = styled.button<StyledProps>`
  display: none;
  @media screen and (min-width: 768px) {
    background: transparent;
    border: 1px solid
      ${({ $overlayOpen, $darkMode }) =>
        $overlayOpen
          ? '#000000'
          : $darkMode
          ? '#000000'
          : '#FFFFFF'};
    color: ${({ $overlayOpen, $darkMode }) =>
      $overlayOpen
        ? '#000000'
        : $darkMode
        ? '#000000'
        : '#FFFFFF'};
    padding: 10px 24px;
    border-radius: 8px;
    font-weight: 500;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-left: 10px;

    &:hover {
      background: ${({ $overlayOpen, $darkMode }) =>
        $overlayOpen
          ? '#000000'
          : $darkMode
          ? '#000000'
          : '#FFFFFF'};
      color: ${({ $overlayOpen, $darkMode }) =>
        $overlayOpen
          ? '#FFFFFF'
          : $darkMode
          ? '#FFFFFF'
          : '#000000'};
    }

    a {
      color: inherit;
      text-decoration: none;
    }
  }
`;