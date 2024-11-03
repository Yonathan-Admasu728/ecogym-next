import React from 'react';
import { useAuth } from '../context/AuthContext';
import Header from './Header';

const HeaderWrapper: React.FC = () => {
  const { user } = useAuth();

  return <Header />;
};

export default HeaderWrapper;