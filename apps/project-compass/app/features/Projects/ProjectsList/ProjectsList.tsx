import { Project } from '@project-compass/shared-types';
import { Button } from '@project-compass/ui';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { AppDispatch, RootState } from '../../../store/store';
import { fetchProjects } from '../projects.slice';

export default function ProjectList() {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const { projects, status, error } = useSelector(
    (state: RootState) => state.projects,
  );

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProjects());
    }
  }, [status, dispatch]);

  const handleCreateProjectClick = () => {
    navigate('/projects/new');
  };
  const handleOpenProject = function (project: Project) {
    navigate(`/projects/${project.id}`);
    //ustawienie stanu globalnego selectedProject na project.id.
  };
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Towje Projekty</h1>
      <Button
        onClick={handleCreateProjectClick}
        variant="primary"
        className="mb-4"
      >
        Utwórz nowy projekt
      </Button>
      {status === 'loading' && <p>"Ładowanie projektów..."</p>}
      {status === 'failed' && error && (
        <p className="text-red-500">Błąd: {error}</p>
      )}

      {status === 'succeeded' && projects.length === 0 && (
        <p>Brak projektów. Dodaj nowy, aby zaczać!</p>
      )}

      {status === 'succeeded' && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            >
              <h2 className="text-xl font-semibold">{project.name}</h2>
              <p className="text-grey-600">
                {project.description || 'Brak opisu'}
              </p>
              <p className="text-sm text-grey-400 my-3">
                Utworzono: {new Date(project.createdAt).toLocaleString()}
              </p>
              <Button onClick={() => handleOpenProject(project)}>
                Otwórz projekt
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
