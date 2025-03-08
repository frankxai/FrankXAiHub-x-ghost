import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  className,
  children
}) => {
  return (
    <div className={cn("space-y-4", className)}>
      <div>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
        {description && (
          <p className="mt-2 text-lg text-muted-foreground max-w-3xl">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
};

export default PageHeader;