export type inputProps = {
  type: 'email' | 'password' | 'common' | 'number';
  title: string;
  isRequired: boolean;
  placeHolder: string;
  onChange: (e: any) => void;
  additionalClassName?: string;
  value?: string | undefined;
};

export function Input({
  title,
  type,
  isRequired,
  placeHolder,
  onChange,
  value,
  additionalClassName,
}: inputProps) {
  const defaultClassName =
    'p-2 rounded bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <div className="flex flex-col">
      <label className="text-white font-bold" htmlFor={`input-${title}`}>
        {title}
      </label>
      <input
        id={`input-${title}`}
        type={type === 'common' ? 'text' : type}
        name={title}
        value={value}
        required={isRequired}
        className={`${defaultClassName} ${additionalClassName}`}
        onChange={onChange}
        placeholder={placeHolder}
      />
    </div>
  );
}
