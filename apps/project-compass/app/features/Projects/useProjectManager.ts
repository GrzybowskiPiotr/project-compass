import { Task } from '@project-compass/shared-types';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { AppDispatch, RootState } from '../../store/store';
import { deleteProject, fetchProjectById } from './projects.slice';

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
  const { status } = useSelector((state: RootState) => state.projects);
  const dispatch: AppDispatch = useDispatch();
  const { id: projctId } = useParams();
  const navigate = useNavigate();
  const { selectedProject: project } = useSelector(
    (state: RootState) => state.projects,
  );

  useEffect(() => {
    if (projctId !== undefined) {
      dispatch(fetchProjectById(projctId));
    }
  }, [dispatch, projctId]);

  const handleDeleteProject = (projctId: string) => {
    try {
      if (projctId) {
        dispatch(deleteProject(projctId));
        navigate('/');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

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

    // setProject((p) => {
    //   if (!p) return null; //Zmiana z null
    //   return {
    //     ...p,
    //     tasks: addSubTaskToTree(newSubTask, p.tasks, parentId),
    //   };
    // });
  };

  const handleToggleComplete = async (taskId: string) => {
    if (!project) return;
    const taskToToggle = findTaskInTree(taskId, project.tasks);

    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isCompleted: !taskToToggle?.isCompleted }),
    });

    // if (response.ok) {
    //   setProject((p) => {
    //     if (!p) return null; //Zmiana z null
    //     return {
    //       ...p,
    //       tasks: updateTaskInTree(p.tasks, taskId, {
    //         isCompleted: !taskToToggle?.isCompleted,
    //       }),
    //     };
    //   });
    // }
  };

  const handleEditTask = async (taskId: string, newTitle: string) => {
    if (!newTitle.trim()) return;

    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle }),
    });

    // if (response.ok) {
    //   const updatedTask = await response.json();
    //   setProject((p) => {
    //     if (!p) return null; //Zmiana z null
    //     return {
    //       ...p,
    //       tasks: updateTaskInTree(p.tasks, taskId, {
    //         title: updatedTask.title,
    //       }),
    //     };
    //   });
    // }
  };

  return {
    status,
    project,
    handleDeleteProject,
    handleToggleComplete,
    handleEditTask,
    handleSubTaskAdd,
  };
}
