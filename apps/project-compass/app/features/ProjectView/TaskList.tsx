import { Task } from '@project-compass/shared-types';
import { TaskItem } from './TaskItem';
interface TaskListProps {
  projectId: string;
  tasks: Task[];
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

export function TaskList({
  projectId,
  tasks,
  expandedTaskIds,
  handleToggleExpand,
  handleToggleComplete,
  handleDeleteTask,
  handleEditTask,
  handleSubTaskAdd,
}: TaskListProps) {
  return (
    <ul>
      {tasks.map((task) => (
        <TaskItem
          projectId={projectId}
          key={task.id}
          task={task}
          expandedTaskIds={expandedTaskIds}
          handleToggleExpand={handleToggleExpand}
          handleToggleComplete={handleToggleComplete}
          handleDeleteTask={handleDeleteTask}
          handleEditTask={handleEditTask}
          handleSubTaskAdd={handleSubTaskAdd}
        />
      ))}
    </ul>
  );
}
