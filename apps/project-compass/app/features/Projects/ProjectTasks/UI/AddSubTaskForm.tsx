import { Button } from '@project-compass/shared-ui';
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
      <div className="flex">
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

        <Button className="rounded-none" type="submit">
          ✓
        </Button>
        <Button
          variant="danger"
          size="medium"
          type="button"
          onClick={onCancel}
          className="rounded-l-none border-none"
        >
          x
        </Button>
      </div>
    </Form>
  );
}
