import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import ContentContainer from './Footer/PoliciesContent';
import { ModalContent, ModalOverlay, TextO } from './Footer/Footer.styled';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

interface CookieSettings {
  necessary: {
    enabled: boolean;
    title: string;
    description: string;
  };
  analytics: {
    enabled: boolean;
    title: string;
    description: string;
  };
  advertising: {
    enabled: boolean;
    title: string;
    description: string;
  };
  functional: {
    enabled: boolean;
    title: string;
    description: string;
  };
}

const CookieConsentBanner: React.FC = () => {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [cookieSettings, setCookieSettings] = useState<CookieSettings>({
    necessary: {
      enabled: true,
      title: 'Necessary Cookies',
      description: 'Essential for the website to function properly. Cannot be disabled.',
    },
    analytics: {
      enabled: false,
      title: 'Analytics Cookies',
      description: 'Help us understand how visitors interact with our website through analytics.',
    },
    advertising: {
      enabled: false,
      title: 'Advertising Cookies',
      description: 'Used to deliver relevant advertisements and measure campaign performance.',
    },
    functional: {
      enabled: false,
      title: 'Functional Cookies',
      description: 'Enable enhanced functionality and personalization across the website.',
    },
  });

  useEffect(() => {
    const hasConsent = localStorage.getItem('cookieConsent');
    const savedSettings = localStorage.getItem('cookieSettings');

    if (!hasConsent) {
      setShowBanner(true);
    } else {
      if (savedSettings) {
        setCookieSettings(JSON.parse(savedSettings));
      }
      updateConsentMode(hasConsent === 'granted');
    }
  }, []);

  const updateConsentMode = (_granted: boolean) => {
    if (typeof window !== 'undefined') {
      if (!window.dataLayer) window.dataLayer = [];
      if (!window.gtag)
        window.gtag = function () {
          window.dataLayer.push(arguments);
        };

      window.gtag('consent', 'update', {
        ad_storage: cookieSettings.advertising.enabled ? 'granted' : 'denied',
        analytics_storage: cookieSettings.analytics.enabled ? 'granted' : 'denied',
        personalization_storage: cookieSettings.functional.enabled ? 'granted' : 'denied',
        functionality_storage: cookieSettings.functional.enabled ? 'granted' : 'denied',
        security_storage: 'granted',
      });
    }
  };

  const dispatchConsentChanged = (granted: boolean, settings: CookieSettings) => {
    const ev = new CustomEvent('cookie-consent-changed', { detail: { granted, settings } });
    window.dispatchEvent(ev);
  };

  const handleAcceptAll = () => {
    const newSettings: CookieSettings = {
      necessary: { ...cookieSettings.necessary, enabled: true },
      analytics: { ...cookieSettings.analytics, enabled: true },
      advertising: { ...cookieSettings.advertising, enabled: true },
      functional: { ...cookieSettings.functional, enabled: true },
    };

    setCookieSettings(newSettings);
    localStorage.setItem('cookieConsent', 'granted');
    localStorage.setItem('cookieSettings', JSON.stringify(newSettings));
    updateConsentMode(true);
    dispatchConsentChanged(true, newSettings);
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    const newSettings: CookieSettings = {
      necessary: { ...cookieSettings.necessary, enabled: true },
      analytics: { ...cookieSettings.analytics, enabled: false },
      advertising: { ...cookieSettings.advertising, enabled: false },
      functional: { ...cookieSettings.functional, enabled: false },
    };

    setCookieSettings(newSettings);
    localStorage.setItem('cookieConsent', 'denied');
    localStorage.setItem('cookieSettings', JSON.stringify(newSettings));
    updateConsentMode(false);
    dispatchConsentChanged(false, newSettings);
    setShowBanner(false);
  };

  const handleSettings = () => {
    setShowSettingsModal(true);
  };

  const handleSaveSettings = () => {
    const consentGiven = Object.entries(cookieSettings)
      .filter(([key, _]) => key !== 'necessary')
      .some(([_, setting]) => (setting as any).enabled);

    localStorage.setItem('cookieConsent', consentGiven ? 'granted' : 'denied');
    localStorage.setItem('cookieSettings', JSON.stringify(cookieSettings));
    updateConsentMode(consentGiven);
    dispatchConsentChanged(consentGiven, cookieSettings);
    setShowSettingsModal(false);
    setShowBanner(false);
  };

  const toggleSetting = (settingKey: keyof CookieSettings) => {
    if (settingKey === 'necessary') return;

    setCookieSettings(prev => ({
      ...prev,
      [settingKey]: {
        ...prev[settingKey],
        enabled: !prev[settingKey].enabled,
      },
    }));
  };

  const handleSelectAll = () => {
    setCookieSettings(prev => ({
      necessary: { ...prev.necessary, enabled: true },
      analytics: { ...prev.analytics, enabled: true },
      advertising: { ...prev.advertising, enabled: true },
      functional: { ...prev.functional, enabled: true },
    }));
  };

  if (!showBanner) return null;

  const handleCloseModal = () => {
    setShowPrivacyPolicy(false);
  };
  const handlePrivacyClick = () => {
    setShowPrivacyPolicy(true);
  };

  return (
    <>
      <AnimatePresence>
        <BannerContainer
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }}
        >
          <BannerContent>
            <Title>🍪 We Use Cookies</Title>
            <Description>
              We use cookies and similar technologies to enhance your browsing experience, analyze
              site traffic, personalize content, and serve targeted advertisements. By clicking
              "Accept All", you consent to the use of all cookies. You can customize your
              preferences in the settings.
            </Description>

            <LinksContainer>
              <TextO
                onClick={handlePrivacyClick}
                style={{ cursor: 'pointer', color: 'var(--blue-500)' }}
              >
                Privacy and Terms
              </TextO>
            </LinksContainer>

            <ButtonsContainer>
              <SettingsButton onClick={handleSettings}>Preferences</SettingsButton>
              <RejectButton onClick={handleRejectAll}>Reject All</RejectButton>
              <AcceptButton onClick={handleAcceptAll}>Accept All</AcceptButton>
            </ButtonsContainer>
          </BannerContent>
        </BannerContainer>
      </AnimatePresence>

      <AnimatePresence>
        {showSettingsModal && (
          <ModalOverlayC
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSettingsModal(false)}
          >
            <ModalContentC
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <ModalHeaderC>
                <ModalTitleC>Cookie Preferences</ModalTitleC>
                <CloseButton onClick={() => setShowSettingsModal(false)}>×</CloseButton>
              </ModalHeaderC>

              <ModalBody>
                <SettingsDescription>
                  Manage your cookie preferences. You can enable or disable different types of
                  cookies below.
                </SettingsDescription>

                {Object.entries(cookieSettings).map(([key, setting]) => (
                  <SettingItem key={key}>
                    <SettingInfo>
                      <SettingTitle>{setting.title}</SettingTitle>
                      <SettingDescription>{setting.description}</SettingDescription>
                    </SettingInfo>
                    <ToggleSwitch
                      disabled={key === 'necessary'}
                      checked={setting.enabled}
                      onChange={() => toggleSetting(key as keyof CookieSettings)}
                    />
                  </SettingItem>
                ))}

                <SelectionButtons>
                  <SelectAllButton onClick={handleSelectAll}>Select All</SelectAllButton>
                  <RejectAllButton onClick={handleRejectAll}>Reject All</RejectAllButton>
                </SelectionButtons>
              </ModalBody>

              <ModalFooter>
                <SaveButton onClick={handleSaveSettings}>Save Preferences</SaveButton>
              </ModalFooter>
            </ModalContentC>
          </ModalOverlayC>
        )}
      </AnimatePresence>

      {showPrivacyPolicy && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <CloseButton onClick={handleCloseModal}>×</CloseButton>
            <ContentContainer />
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

const BannerContainer = styled(motion.div)`
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  z-index: 10000;
  margin: 0 auto;
  border: 1px solid #e0e0e0;

  @media (max-width: 768px) {
    left: 10px;
    right: 10px;
    bottom: 10px;
  }
`;

const BannerContent = styled.div`
  padding: 24px;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const Title = styled.h3`
  font-family: var(--second-family);
  font-weight: 500;
  font-size: 18px;
  color: #242424;
  margin-bottom: 12px;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const Description = styled.p`
  font-family: var(--font-family);
  font-weight: 400;
  font-size: 14px;
  line-height: 1.5;
  color: #666;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const LinksContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const BaseButton = styled.button`
  padding: 10px 20px;
  border-radius: 6px;
  font-family: var(--font-family);
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const SettingsButton = styled(BaseButton)`
  background: transparent;
  color: #666;
  border: 1px solid #ddd;

  &:hover {
    background: #f5f5f5;
  }
`;

const RejectButton = styled(BaseButton)`
  background: transparent;
  color: #666;
  border: 1px solid #ddd;

  &:hover {
    background: #f5f5f5;
  }
`;

const AcceptButton = styled(BaseButton)`
  background: var(--blue-500);
  color: white;

  &:hover {
    background: var(--blue-500);
  }
`;

const ModalOverlayC = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10001;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ModalContentC = styled(motion.div)`
  background: white;
  border-radius: 12px;
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeaderC = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0 24px;
`;

const ModalTitleC = styled.h2`
  font-family: var(--second-family);
  font-weight: 500;
  font-size: 20px;
  color: #242424;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;

  &:hover {
    color: #242424;
  }
`;

const ModalBody = styled.div`
  padding: 24px;
`;

const SettingsDescription = styled.p`
  font-family: var(--font-family);
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
  line-height: 1.5;
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`;

const SettingInfo = styled.div`
  flex: 1;
  margin-right: 16px;
`;

const SettingTitle = styled.h4`
  font-family: var(--font-family);
  font-weight: 500;
  font-size: 16px;
  color: #242424;
  margin-bottom: 4px;
`;

const SettingDescription = styled.p`
  font-family: var(--font-family);
  font-size: 14px;
  color: #666;
  line-height: 1.4;
`;

const ToggleSwitch = styled.input.attrs({ type: 'checkbox' })`
  width: 44px;
  height: 24px;
  appearance: none;
  background: #ddd;
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  transition: background 0.2s ease;

  &:checked {
    background: var(--blue-500);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &::before {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    top: 2px;
    left: 2px;
    transition: transform 0.2s ease;
  }

  &:checked::before {
    transform: translateX(20px);
  }
`;

const SelectionButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
`;

const SelectAllButton = styled(BaseButton)`
  background: transparent;
  color: var(--blue-500);
  border: 1px solid var(--blue-500);

  &:hover {
    background: var(--blue-50);
  }
`;

const RejectAllButton = styled(BaseButton)`
  background: transparent;
  color: #666;
  border: 1px solid #ddd;

  &:hover {
    background: #f5f5f5;
  }
`;

const ModalFooter = styled.div`
  padding: 0 24px 24px 24px;
  display: flex;
  justify-content: flex-end;
`;

const SaveButton = styled(BaseButton)`
  background: var(--blue-500);
  color: white;
  padding: 12px 24px;

  &:hover {
    background: var(--blue-600);
  }
`;

export default CookieConsentBanner;
