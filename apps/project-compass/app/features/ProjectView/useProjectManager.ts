import { Project, Task } from '@project-compass/shared-types';
import { useEffect, useState } from 'react';

const updateTaskInTree = (
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

const deleteTaskFromTree = function (tasks: Task[], taskId: string): Task[] {
  return tasks.reduce((acc, task) => {
    if (task.id === taskId) {
      return acc;
    }
    if (task.subTasks && task.subTasks.length > 0) {
      const updatedSubtasks = deleteTaskFromTree(task.subTasks, taskId);
      acc.push({ ...task, subTasks: updatedSubtasks });
    } else {
      acc.push(task);
    }
    return acc;
  }, [] as Task[]);
};

export function useProjectManager() {
  const [project, setProject] = useState<Project | null>(null);
  const [expandedTaskIds, setExpandedTaskIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleSubTaskAddInTree = function (
    parentId: string,
    title: string,
    tasks: Task[],
  ): Task[] {
    return tasks.map((task) => {
      if (task.id === parentId) {
        const tasksCount = `${parentId}-${task.subTasks.length + 1}`;
        return {
          ...task,
          subTasks: [
            ...task.subTasks,
            {
              title,
              subTasks: [],
              createdAt: new Date(),
              id: tasksCount,
              isCompleted: false,
            },
          ],
        };
      }

      if (task.subTasks && task.subTasks.length > 0) {
        return {
          ...task,
          subTasks: handleSubTaskAddInTree(parentId, title, task.subTasks),
        };
      }
      return task;
    });
  };

  const handleSubTaskAdd = function (parentId: string, title: string) {
    setProject((p) => {
      if (!p) return null;
      return {
        ...p,
        tasks: handleSubTaskAddInTree(parentId, title, p.tasks),
      };
    });
  };

  const handleToggleExpand = (taskId: string) => {
    setExpandedTaskIds((currentExpanded) => {
      if (currentExpanded.includes(taskId)) {
        return currentExpanded.filter((id) => id !== taskId);
      } else {
        return [...currentExpanded, taskId];
      }
    });
  };
  const toggleCompleteInTree = (tasks: Task[], taskId: string): Task[] => {
    return tasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, isCompleted: !task.isCompleted };
      }

      if (task.subTasks && task.subTasks.length > 0) {
        return {
          ...task,
          subTasks: toggleCompleteInTree(task.subTasks, taskId),
        };
      }

      return task;
    });
  };

  const handleToggleComplete = (taskId: string) => {
    setProject((p) => {
      if (!p) return null;
      return {
        ...p,
        tasks: toggleCompleteInTree(p.tasks, taskId),
      };
    });
  };

  const handleDeleteTask = (taskId: string) => {
    setProject((p) => {
      if (!p) return null;
      return { ...p, tasks: deleteTaskFromTree(p.tasks, taskId) };
    });
  };
  const handleEditTask = (taskId: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    setProject((p) => {
      if (!p) return null;
      return {
        ...p,
        tasks: updateTaskInTree(p.tasks, taskId, { title: newTitle }),
      };
    });
  };
  const handleAddTask = (title: string) => {
    if (!title.trim()) return;
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title,
      isCompleted: false,
      createdAt: new Date(),
      subTasks: [],
    };
    setProject((p) => {
      if (!p) return null;
      return { ...p, tasks: [...p.tasks, newTask] };
    });
  };

  useEffect(() => {
    fetch('/api/project/1')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to resive project data');
        }
        return response.json();
      })
      .then((data: Project) => {
        setProject(data);
      })
      .catch((error) => {
        console.error('Błąd podczas pobierania projektu', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return {
    isLoading,
    project,
    setProject,
    expandedTaskIds,
    setExpandedTaskIds,
    handleToggleExpand,
    handleToggleComplete,
    handleDeleteTask,
    handleEditTask,
    handleAddTask,
    handleSubTaskAdd,
  };
}
