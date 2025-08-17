import { Task } from '@project-compass/shared-types';
import { TaskItem } from './TaskItem';
interface TaskListProps {
  tasks: Task[];
  expandedTaskIds: string[];
  onToggleExpand: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
  onTaskDelete: (taskId: string) => void;
  handleEditTask: (taskId: string, newTitle: string) => void;
  handleSubTaskAdd: (parentId: string, title: string) => void;
}

export function TaskList({
  tasks,
  expandedTaskIds,
  onToggleExpand,
  onToggleComplete,
  onTaskDelete,
  handleEditTask,
  handleSubTaskAdd,
}: TaskListProps) {
  return (
    <ul>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          expandedTaskIds={expandedTaskIds}
          onToggleExpand={onToggleExpand}
          onToggleComplete={onToggleComplete}
          onTaskDelete={onTaskDelete}
          handleEditTask={handleEditTask}
          handleSubTaskAdd={handleSubTaskAdd}
        />
      ))}
    </ul>
  );
}
