import React from 'react';
import AuthForm from '../components/auth/AuthForm';
import PageContainer from '../components/layout/PageContainer';

const LoginPage: React.FC = () => {
  return (
    <PageContainer>
      <div className="max-w-md mx-auto">
        <AuthForm mode="login" />
      </div>
    </PageContainer>
  );
};

export default LoginPage;