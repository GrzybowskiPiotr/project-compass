import { Task } from '@project-compass/shared-types';
import { Button } from '@project-compass/shared-ui';
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
      <div className="flex items-center max-w-fit bg-slate-600 h-16  pl-4  pr-8 rounded-md ">
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
          <Button
            onClick={handleSave}
            variant="primary"
            size="small"
            className="ml-4"
          >
            Zapisz
          </Button>
        ) : (
          <Button
            onClick={() => setIsEditable(true)}
            variant="secondary"
            size="small"
            className="ml-4"
          >
            Edytuj
          </Button>
        )}

        <Button
          onClick={() => handleDeleteTask(task.id)}
          variant="danger"
          size="small"
          className="ml-4"
        >
          Usuń
        </Button>

        <Button
          onClick={() => setIsAddingSubTask(true)}
          variant="primary"
          size="small"
          className="ml-4"
        >
          Dodaj podzadanie
        </Button>
        <div className="w-6">
          {hasSubTasks && (
            <Button
              onClick={() => handleToggleExpand(task.id)}
              variant="secondary"
              size="small"
              className="ml-4"
            >
              {isExpanded ? '▼' : '►'}
            </Button>
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
