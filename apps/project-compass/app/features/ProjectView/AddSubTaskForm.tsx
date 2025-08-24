import { useState } from 'react';
import { Form } from 'react-router';
interface AddSubTaskFormProps {
  projectId: string;
  parentId: string;
  onSubTaskSubmit: (parentId: string, title: string, projectId: string) => void;
  onCancel: () => void;
}

export function AddSubTaskForm({
  parentId,
  onSubTaskSubmit,
  onCancel,
  projectId,
}: AddSubTaskFormProps) {
  const [title, setTitle] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      onCancel();
      return;
    }
    onSubTaskSubmit(parentId, title, projectId);
    onCancel();
  };
  return (
    <Form onSubmit={handleSubmit} className="pt-2 ml-8">
      <div>
        <label htmlFor="subtask-title" className="sr-only">
          Tytuł podzadania:
        </label>
        <input
          id="subtask-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Wpisz tytuł podzadania..."
          className="flex-grow p-2 rounded-l-md bg-gray-800 border border-gray-600 text-white focus:outline-none"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Escape') onCancel();
          }}
        />

        <button
          type="submit"
          className="bg-green-600 px-3 py-2 hover:bg-green-700 font-semibold transition-colors"
        >
          ✓
        </button>
        <button
          type="button"
          className="bg-red-600 px-3 py-2 rounded-r-md hover:bg-red-700 font-semibold transition-colors"
          onClick={onCancel}
        >
          ×
        </button>
      </div>
    </Form>
  );
}
