import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Link, LinkProps } from 'react-router-dom';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SmartButtonProps extends ButtonProps {
  permission?: string;
  onDenied?: () => void;
}

export const SmartButton: React.FC<SmartButtonProps> = ({ 
  permission, 
  onClick, 
  onDenied,
  className,
  children,
  ...props 
}) => {
  const { hasPermission } = useAuth();
  const { toast } = useToast();

  const handleInteraction = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (permission && !hasPermission(permission)) {
      e.preventDefault();
      e.stopPropagation();
      
      toast({
        title: "❌ Permission not allowed",
        description: "Please contact Admin to request access.",
        variant: "destructive",
      });
      
      if (onDenied) onDenied();
      return;
    }

    if (onClick) onClick(e);
  };

  const isDenied = permission && !hasPermission(permission);

  return (
    <Button
      {...props}
      onClick={handleInteraction}
      className={cn(
        className,
        isDenied && "opacity-70 cursor-pointer grayscale-[0.5]" 
      )}
    >
      {children}
    </Button>
  );
};

interface SmartLinkProps extends LinkProps {
  permission?: string;
  className?: string;
  children: React.ReactNode;
}

export const SmartLink: React.FC<SmartLinkProps> = ({ 
  permission, 
  to, 
  className,
  children,
  ...props 
}) => {
  const { hasPermission } = useAuth();
  const { toast } = useToast();

  const handleInteraction = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (permission && !hasPermission(permission)) {
      e.preventDefault();
      
      toast({
        title: "❌ Permission not allowed",
        description: "Please contact Admin to access this page.",
        variant: "destructive",
      });
      return;
    }
  };

  const isDenied = permission && !hasPermission(permission);

  return (
    <Link
      {...props}
      to={to}
      onClick={handleInteraction}
      className={cn(
        className,
        isDenied && "opacity-70 grayscale-[0.5]"
      )}
    >
      {children}
    </Link>
  );
};

interface PermissionGuardProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({ 
  permission, 
  children, 
  fallback = null 
}) => {
  const { hasPermission } = useAuth();
  
  if (hasPermission(permission)) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
};
