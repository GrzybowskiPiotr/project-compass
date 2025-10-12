import { Task } from '@project-compass/shared-types';

export const deleteTaskFromTree = function (
  tasks: Task[],
  taskId: string,
): Task[] {
  return tasks.reduce((acc: Task[], task) => {
    if (task.id === taskId) return acc;

    if (task.subTasks && task.subTasks.length > 0) {
      const updatedSubtasks = deleteTaskFromTree(task.subTasks, taskId);
      acc.push({ ...task, subTasks: updatedSubtasks });
    } else {
      acc.push(task);
    }
    return acc;
  }, []);
};
