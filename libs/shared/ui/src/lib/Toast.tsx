import clsx from 'clsx';
type ToastProps = {
  title: string;
  toastMessage: string;
  variant: 'success' | 'info' | 'error';
  onClose: () => void;
};

export function Toast({
  title,
  toastMessage,
  variant = 'info',
  onClose,
}: ToastProps) {
  const iconsSetMap = {
    success: <i className="fa-solid fa-circle-check ]"></i>,
    info: <i className="fa-solid fa-light fa-circle-info"></i>,
    error: <i className="fa-solid fa-triangle-exclamation"></i>,
  };

  const combinatedContainerClassName = clsx(
    'text-white flex rounded-lg max-w-[400px] overflow-hidden items-stretch',
    {
      'bg-blue-400': variant === 'info',
      'bg-red-600': variant === 'error',
      'bg-green-500': variant === 'success',
    },
  );
  const combinatedLeftBarClassName = clsx(
    'flex items-center justify-center w-[10%] flex-shrink-0 ',
    {
      'bg-blue-500': variant === 'info',
      'bg-red-700': variant === 'error',
      'bg-green-600': variant === 'success',
    },
  );
  return (
    <div className={combinatedContainerClassName}>
      <div className={combinatedLeftBarClassName}>{iconsSetMap[variant]}</div>
      <div className="p-2 flex-grow">
        <h2 className="font-bold">{title}</h2>
        <p className="text-sm">{toastMessage}</p>
      </div>

      <button
        className="flex-shrink-0 hover:scale-125 transition felx items-center justify-center p-4"
        onClick={onClose}
      >
        x
      </button>
    </div>
  );
}
