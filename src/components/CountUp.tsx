'use client';
import { default as AnimatedCounter, CountUpProps } from 'react-countup';

export function CountUp(props: CountUpProps) {
  return (
    <div className="w-full">
      <AnimatedCounter decimals={2} {...props} />
    </div>
  );
}
