import { Project } from '@project-compass/shared-types';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { AppDispatch, RootState } from '../../store/store';
import {
  deleteProject,
  fetchProjectById,
  updateProject,
} from './projects.slice';

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

  const handleEditedProjectSubmit = async function (editedProjectData: {
    name: string;
    description: string;
  }) {
    if (!project) {
      console.error(
        'Nie można zaktualizować projektu, który nie jest załadowany.',
      );
      return;
    }

    const updatedProjectData: Project = {
      ...project,
      ...editedProjectData,
    };

    dispatch(updateProject(updatedProjectData));
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
    handleEditTask,
    handleEditedProjectSubmit,
  };
}
