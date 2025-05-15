import React from 'react';
import AuthForm from '../components/auth/AuthForm';
import PageContainer from '../components/layout/PageContainer';

const SignupPage: React.FC = () => {
  return (
    <PageContainer>
      <div className="max-w-md mx-auto">
        <AuthForm mode="signup" />
      </div>
    </PageContainer>
  );
};

export default SignupPage;