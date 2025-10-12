import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store/store';
import {
  createSubtask,
  createTask,
  deleteTask,
  editTask,
  fetchAllTasks,
  toggleTaskComplete,
} from '../thunks';

export const useTaskManager = function () {
  const [expandedTaskIds, setExpandedTaskIds] = useState<string[]>([]);
  const dispatch: AppDispatch = useDispatch();

  const { tasks, status } = useSelector((state: RootState) => state.tasks);
  const { selectedProject } = useSelector((state: RootState) => state.projects);
  const handleToggleExpand = (taskId: string) => {
    setExpandedTaskIds((currentExpanded) => {
      if (currentExpanded.includes(taskId)) {
        return currentExpanded.filter((id) => id !== taskId);
      } else {
        return [...currentExpanded, taskId];
      }
    });
  };

  useEffect(() => {
    if (status === 'idle') {
      if (selectedProject) dispatch(fetchAllTasks(selectedProject?.id));
    }
  }, [dispatch, selectedProject, status]);

  const handleSubTaskAdd = async function (
    parentId: string,
    title: string,
    projectId: string,
  ) {
    if (!title.trim())
      throw new Error('Sub task title is required to add subtask');
    if (!parentId) throw new Error('Parent id is required to add new subtask');
    dispatch(createSubtask({ title, parentId, projectId }));
  };

  const handleEditTask = async (taskId: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    dispatch(editTask({ taskId, newTitle }));
  };
  const handleToggleComplete = async (taskId: string) => {
    dispatch(toggleTaskComplete({ taskId, tasks }));
  };

  const handleAddMainTask = async (title: string, projectId: string) => {
    if (!title.trim()) return;

    dispatch(createTask({ title, projectId, parentId: null }));
    // const response = await fetch('/api/tasks', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ title, projectId: projectId, parentId: null }),
    // });

    // if (!response.ok) {
    //   console.error('Błąd podczas dodawania zadania');
    //   return;
    // }

    // const newTask = await response.json();

    // setProject((p) => {
    //   if (!p) return null;
    //   return { ...p, tasks: [...p.tasks, newTask] };
    // });
  };
  const handleDeleteTask = async (taskId: string) => {
    if (taskId !== undefined) {
      dispatch(deleteTask(taskId));
    }
  };
  return {
    tasks,
    handleAddMainTask,
    handleToggleExpand,
    expandedTaskIds,
    handleDeleteTask,
    handleSubTaskAdd,
    handleToggleComplete,
    handleEditTask,
  };
};
