import clsx from 'clsx';
type ButtonProps = {
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'danger';
} & React.ComponentProps<'button'>;

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'medium',
  ...rest
}: ButtonProps) {
  const combinedClassName = clsx(
    'rounded font-semibold transition-colors focus:outline-none focus:ring-2 focus: ring-offset-2',
    {
      'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500':
        variant === 'primary',
      'bg-slate-500 hover:bg-slate-600 text-white focus ring-slate-400':
        variant === 'secondary',
      'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500':
        variant === 'danger',
    },
    {
      'px-4 py-2 text-sm': size === 'medium',
      'px-2 py-1 text-xs': size === 'small',
      'px-6 py-3 text-base': size === 'large',
    },
    className,
  );

  return (
    <button className={combinedClassName} {...rest}>
      {children}
    </button>
  );
}
