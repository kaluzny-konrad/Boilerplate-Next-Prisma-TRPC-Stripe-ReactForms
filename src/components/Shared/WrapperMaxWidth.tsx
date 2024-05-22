import { cn } from '@/lib/utils';
import { ReactNode } from 'react'

type Props = {
    className?: string;
    children?: ReactNode;
  };
  
  export default function WrapperMaxWidth({ className, children }: Props) {
    return (
      <div
        className={cn(
          "mx-auto max-w-screen-xl px-2.5 md:px-20",
          className
        )}
      >
        {children}
      </div>
    );
  }
  