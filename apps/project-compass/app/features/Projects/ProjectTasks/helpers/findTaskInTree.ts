import { Task } from '@project-compass/shared-types';
export const findTaskInTree = function (
  taskId: string,
  tasks: Task[],
): Task | null {
  for (const task of tasks) {
    if (task.id === taskId) return task;
    if (task.subTasks && task.subTasks.length > 0) {
      const foundInChildren = findTaskInTree(taskId, task.subTasks);
      if (foundInChildren) return foundInChildren;
    }
  }
  return null;
};
