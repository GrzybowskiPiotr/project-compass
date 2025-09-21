export type inputProps = {
  type: 'email' | 'password' | 'common' | 'number';
  name: string;
  isRequired: boolean;
  placeHolder: string;
  onChange: (e: any) => void;
  additionalClassName?: string;
  value: string;
};

export function Input({
  name,
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
      <label className="text-white font-bold" htmlFor={`input-${name}`}>
        {name}
      </label>
      <input
        id={`input-${name}`}
        type={type === 'common' ? 'text' : type}
        name={name}
        value={value}
        required={isRequired}
        className={`${defaultClassName} ${additionalClassName}`}
        onChange={onChange}
        placeholder={placeHolder}
      />
    </div>
  );
}
