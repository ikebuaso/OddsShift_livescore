import React, { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  title?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, title }) => {
  return (
    <main className="flex-1 bg-[#F9FAFB] py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {title && (
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2C4B33] mb-6">{title}</h1>
        )}
        {children}
      </div>
    </main>
  );
};

export default PageContainer;