import { Project, Task } from '@project-compass/shared-types';
import { useEffect, useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';

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
const findTaskInTree = function (taskId: string, tasks: Task[]): Task | null {
  for (const task of tasks) {
    if (task.id === taskId) return task;
    if (task.subTasks && task.subTasks.length > 0) {
      const foundInChildren = findTaskInTree(taskId, task.subTasks);
      if (foundInChildren) return foundInChildren;
    }
  }
  return null;
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

const addSubTaskToTree = function (
  newSubTask: Task,
  tasks: Task[],
  parentId: string,
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

export function useProjectManager() {
  const [project, setProject] = useState<Project | null>(null);
  const [expandedTaskIds, setExpandedTaskIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleSubTaskAdd = async function (
    parentId: string,
    title: string,
    projectId: string,
  ) {
    if (!title.trim())
      throw new Error('Sub task title is required to add subtask');
    if (!parentId) throw new Error('Parent id is required to add new subtask');

    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ title, parentId, projectId }),
    });

    if (!response.ok) {
      console.error('Error occurse while adding subTask');
      return;
    }

    const newSubTask = await response.json();

    setProject((p) => {
      if (!p) return null;
      return {
        ...p,
        tasks: addSubTaskToTree(newSubTask, p.tasks, parentId),
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

  const handleToggleComplete = async (taskId: string) => {
    if (!project) return;
    const taskToToggle = findTaskInTree(taskId, project.tasks);

    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isCompleted: !taskToToggle?.isCompleted }),
    });

    if (response.ok) {
      setProject((p) => {
        if (!p) return null;
        return {
          ...p,
          tasks: updateTaskInTree(p.tasks, taskId, {
            isCompleted: !taskToToggle?.isCompleted,
          }),
        };
      });
    }
  };

  const handleEditTask = async (taskId: string, newTitle: string) => {
    if (!newTitle.trim()) return;

    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle }),
    });

    if (response.ok) {
      const updatedTask = await response.json();
      setProject((p) => {
        if (!p) return null;
        return {
          ...p,
          tasks: updateTaskInTree(p.tasks, taskId, {
            title: updatedTask.title,
          }),
        };
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!project) return;
    const res = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
    if (!res.ok) {
      console.error('Error occurse while deleting task');
      return;
    }

    setProject((p) => {
      if (!p) return null;
      return { ...p, tasks: deleteTaskFromTree(p.tasks, taskId) };
    });
  };

  const handleAddTask = async (title: string, projectId: string) => {
    if (!title.trim()) return;

    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, projectId: projectId, parentId: null }),
    });

    if (!response.ok) {
      console.error('Błąd podczas dodawania zadania');
      return;
    }

    const newTask = await response.json();

    setProject((p) => {
      if (!p) return null;
      return { ...p, tasks: [...p.tasks, newTask] };
    });
  };

  const { user, token } = useAuthContext();

  useEffect(() => {
    if (user && token) {
      fetch(`/api/project/1`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
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
    } else {
      setIsLoading(false);
    }
  }, [user, token]);

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
