interface TextAreaProp {
  name: string;
  rows?: number;
  cols?: number;
  disabled?: boolean;
  className?: string;
  title: string;
  value: string;
  placeholder: string;
  onChange: (e: any) => void;
}

export function TextArea({
  name,
  title,
  rows = 5,
  cols = 32,

  disabled,
  className,
  value,
  placeholder,
  onChange,
}: TextAreaProp) {
  return (
    <div className="mb-4">
      <label htmlFor="description" className="text-white font-bold">
        {title}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        cols={cols}
        disabled={disabled}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`shadow appearance-none border rounded w-full py-2 px-3 resize-none text-gray-800 leading-tight focus:outline-none focus:shadow-outline ${className}`}
      ></textarea>
    </div>
  );
}
