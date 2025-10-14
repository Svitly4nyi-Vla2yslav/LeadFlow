import React from 'react';
import { InfoContainer } from './Info.styled';
import ArticlesListContainer from '../../components/NewsTips/ArticlesListContainer';


const Info: React.FC = () => {
  return <InfoContainer   id='app' >
   <ArticlesListContainer/>
  </InfoContainer>;
};

export default Info;
