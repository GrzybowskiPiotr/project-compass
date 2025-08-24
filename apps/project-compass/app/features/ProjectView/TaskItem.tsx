import { Task } from '@project-compass/shared-types';
import { useState } from 'react';
import { AddSubTaskForm } from './AddSubTaskForm';
import { TaskList } from './TaskList';
interface TaskItemsPropos {
  projectId: string;
  task: Task;
  expandedTaskIds: string[];
  handleToggleExpand: (taskId: string) => void;
  handleToggleComplete: (taskId: string) => void;
  handleDeleteTask: (taskId: string) => void;
  handleEditTask: (taskId: string, newTitle: string) => void;
  handleSubTaskAdd: (
    parentId: string,
    title: string,
    projectId: string,
  ) => void;
}

export function TaskItem({
  projectId,
  task,
  expandedTaskIds,
  handleToggleExpand,
  handleToggleComplete,
  handleDeleteTask,
  handleEditTask,
  handleSubTaskAdd,
}: TaskItemsPropos) {
  const [isEditable, setIsEditable] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title);
  const [isAddingSubTask, setIsAddingSubTask] = useState(false);
  const isExpanded = expandedTaskIds.includes(task.id);
  const hasSubTasks = task.subTasks && task.subTasks.length > 0;

  const handleSave = function () {
    handleEditTask(task.id, newTitle);
    setIsEditable(false);
  };

  const handleCancel = function () {
    setIsEditable(false);
    setNewTitle(task.title);
  };

  return (
    <li className="my-1 p-1">
      <div className="flex items-center max-w-fit bg-slate-600 h-16  pl-2  pr-2 rounded-md ">
        <input
          type="checkbox"
          checked={task.isCompleted}
          onChange={() => handleToggleComplete(task.id)}
          className="mr-2"
        />
        {isEditable ? (
          <input
            type="text"
            placeholder={task.title}
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSave();
              }
              if (e.key === 'Escape') {
                handleCancel();
              }
            }}
            className="text-gray-700 p-1 rounded w-64"
            autoFocus
            value={newTitle}
          />
        ) : (
          <span onClick={() => setIsEditable(true)}>{task.title}</span>
        )}

        {isEditable ? (
          <button
            onClick={handleSave}
            className="ml-4 p-1 text-xs text-blue-600 hover:bg-blue-600 bg-slate-400 hover:text-slate-400 font-semibold rounded transition-colors"
          >
            Zapisz
          </button>
        ) : (
          <button
            onClick={() => setIsEditable(true)}
            className="ml-4 p-1 text-xs text-blue-600 hover:bg-blue-600 bg-slate-400 hover:text-slate-400 font-semibold rounded transition-colors"
          >
            Edytuj
          </button>
        )}
        <button
          onClick={() => handleDeleteTask(task.id)}
          className="ml-4 p-1 text-xs text-red-600 hover:text-slate-400 bg-slate-400 rounded transition-colors hover:bg-red-700"
        >
          Usuń
        </button>
        <button
          aria-label="dodaj podzadanie"
          className="ml-4 pl-1 pr-1 text-s text-blue-600 hover:bg-blue-600 bg-slate-400 hover:text-slate-400 font-semibold rounded transition-colors"
          onClick={() => setIsAddingSubTask(true)}
        >
          +
        </button>
        <div className="w-6">
          {hasSubTasks && (
            <button
              onClick={() => handleToggleExpand(task.id)}
              className="mr-2 ml-2 text-xs rounded p-1 hover:bg-slate-500 transition-colors"
            >
              {isExpanded ? '▼' : '►'}
            </button>
          )}
        </div>
        {isAddingSubTask && (
          <AddSubTaskForm
            projectId={projectId}
            parentId={task.id}
            onSubTaskSubmit={handleSubTaskAdd}
            onCancel={() => setIsAddingSubTask(false)}
          />
        )}
        {isExpanded && hasSubTasks && (
          <div className="ml-8 pt-1 bg-slate-400 rounded">
            <TaskList
              projectId={projectId}
              tasks={task.subTasks}
              expandedTaskIds={expandedTaskIds}
              handleToggleExpand={handleToggleExpand}
              handleToggleComplete={handleToggleComplete}
              handleDeleteTask={handleDeleteTask}
              handleEditTask={handleEditTask}
              handleSubTaskAdd={handleSubTaskAdd}
            />
          </div>
        )}
      </div>
    </li>
  );
}
