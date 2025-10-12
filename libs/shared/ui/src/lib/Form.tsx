import { Form as RouterForm } from 'react-router';

export function Form({
  formTitle,
  children,
  onSubmit,
  ...rest
}: {
  formTitle: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <div className="flex flex-col gap-2 w-full max-w-sm bg-blue-300 bg-opacity-50 p-8 rounded-lg shadow-xl ">
      <h2 className="text-2xl text-center uppercase text-white font-bold mb-6">
        {formTitle}
      </h2>
      <RouterForm onSubmit={onSubmit} className="flex flex-col gap-2" {...rest}>
        {children}
      </RouterForm>
    </div>
  );
}
