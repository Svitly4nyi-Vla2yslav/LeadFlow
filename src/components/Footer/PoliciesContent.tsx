import React from 'react';
import {
  ContentWrapper,
  Section,
  Title,
  TextP,
  TitelContainer,
  TitelPrivacy,
} from './Footer.styled';

interface ContentSection {
  title: string;
  content: string;
}

const ContentContainer: React.FC = () => {
  const sections: ContentSection[] = [
    {
      title: 'Last Updated: January 20, 2025',
      content:
        'At Airtexno, we are dedicated to safeguarding your privacy and ensuring that your personal data is managed securely and responsibly. This Privacy Policy outlines how we collect, use, and protect your information when you visit our website or engage with our services.',
    },
    {
      title: 'INFORMATION WE COLLECT',
      content:
        "We may collect the following types of information: Personal Information: Name, email address, phone number, company name, and other details you provide when filling out forms, subscribing to newsletters, or contacting us directly. Usage Data: Information about how you interact with our website, such as IP address, browser type, pages visited, and time spent. We may collect this through cookies and analytics tools. Third-Party Data: Information from services you've authorized us to use (e.g., analytics providers).",
    },
    {
      title: 'HOW WE USE YOUR INFORMATION',
      content:
        'We may use or share your information with: Service Providers: To help operate our website, analytics, marketing, or provide services on our behalf. Legal Requirements: If required by applicable law or to comply with legal processes. Business Transfers: In the case of a merger or acquisition, data may be shared as part of that process. We do not sell personal data to third parties.',
    },
    {
      title: 'COOKIES AND TRACKING TECHNOLOGIES',
      content:
        'Our site uses cookies and similar technologies to enhance performance and user experience. Cookies help remember your preferences and analyze behavior. You can manage cookies through your browser settings. Please note that disabling cookies may impact site functionality.',
    },
    {
      title: 'DATA RETENTION',
      content:
        'We retain your data only as long as necessary to fulfill the purposes outlined in this policy or to comply with legal obligations.',
    },
    {
      title: 'YOUR RIGHTS',
      content:
        'Depending on your location, you may have the right to: Access your data. Request corrections to inaccurate or incomplete data. Request deletion of your personal data. Object to certain processing activities. Request a copy of your data in machine-readable format. To exercise these rights, please contact us using the details below.',
    },
    {
      title: 'DATA SECURITY',
      content:
        'We implement appropriate technical and organizational measures to protect your data. However, no system is 100% secure, and we cannot guarantee absolute protection.',
    },
    {
      title: 'THIRD-PARTY LINKS',
      content:
        'Our website may contain links to external sites. We are not responsible for their privacy practices. We recommend reviewing their privacy policies separately.',
    },
    {
      title: 'INTERNATIONAL DATA TRANSFERS',
      content:
        'If you access our site from outside our operating country, your data may be transferred and processed in other regions where our servers or partners are located. By using the site, you consent to this transfer.',
    },
    {
      title: 'UPDATES TO THIS POLICY',
      content:
        "We may update this Privacy Policy as necessary. Any changes will be reflected by updating the 'Last Updated' date above. We encourage you to check this page periodically.",
    },
  ];

  return (
    <div>
      <TitelContainer>
        <TitelPrivacy>Privacy and terms</TitelPrivacy>
      </TitelContainer>
      <ContentWrapper>
        {sections.map((section, index) => (
          <Section key={index}>
            <Title>{section.title}</Title>
            <TextP>{section.content}</TextP>
          </Section>
        ))}
      </ContentWrapper>
    </div>
  );
};

export default ContentContainer;
