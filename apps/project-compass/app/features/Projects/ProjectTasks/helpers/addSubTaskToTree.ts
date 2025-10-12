import { Task } from '@project-compass/shared-types';

export const addSubTaskToTree = function (
  newSubTask: Task,
  tasks: Task[],
  parentId: string | null,
): Task[] {
  return tasks.map((task) => {
    if (task.id === parentId) {
      return {
        ...task,
        subTasks: [...task.subTasks, newSubTask],
      };
    }

    if (task.subTasks && task.subTasks.length > 0) {
      return {
        ...task,
        subTasks: addSubTaskToTree(newSubTask, task.subTasks, parentId),
      };
    }
    return task;
  });
};
