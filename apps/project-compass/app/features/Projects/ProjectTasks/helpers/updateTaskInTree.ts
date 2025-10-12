import { Task } from '@project-compass/shared-types';

export const updateTaskInTree = (
  tasks: Task[],
  taskid: string,
  updates: Partial<Omit<Task, 'id'>>,
): Task[] => {
  return tasks.map((task) => {
    if (task.id === taskid) {
      return {
        ...task,
        ...updates,
      };
    }
    if (task.subTasks && task.subTasks.length > 0) {
      return {
        ...task,
        subTasks: updateTaskInTree(task.subTasks, taskid, updates),
      };
    }
    return task;
  });
};
