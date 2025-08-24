import { useState } from 'react';
import { Form } from 'react-router';

interface formProps {
  onTaskAdd: (title: string, projectId: string) => void;
  projectId: string;
}

export function AddTaskForm({ onTaskAdd, projectId }: formProps) {
  const [taskTitle, setTaskTitle] = useState('');

  const handleSubmit = function (e: React.FormEvent) {
    e.preventDefault();
    onTaskAdd(taskTitle, projectId);
    setTaskTitle('');
    return;
  };

  return (
    <Form
      className="mt-6 p-4 bg-gray-800 rounded-lg shadow-md"
      onSubmit={handleSubmit}
    >
      <h3 className="text-lg font-semibold mb-2">Dodaj nowe zadanie</h3>
      <div className="flex">
        <input
          type="text"
          placeholder="Tytuł zadania..."
          className=" flex-grow p-2 rounded-l-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 px-6 py-2 rounded-r-md hover:bg-blue-700 font-semibold transition-colors"
        >
          Dodaj
        </button>
      </div>
    </Form>
  );
}
