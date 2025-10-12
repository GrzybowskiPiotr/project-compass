import { Button } from '@project-compass/ui';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RemoveScroll } from 'react-remove-scroll';
import { RootState } from '../../../../store/store';
import { useTaskManager } from '../../ProjectTasks/hooks/useTasksManager';
import { AddTaskForm } from '../../ProjectTasks/UI/AddTaskForm';
import { TaskList } from '../../ProjectTasks/UI/TaskList';
import { useProjectManager } from '../useProjectManager';
import { ProjectEditForm } from './ProjectEditForm';

export default function ProjectDetailsPage() {
  const { handleDeleteProject, handleEditedProjectSubmit } =
    useProjectManager();

  const {
    handleSubTaskAdd,
    expandedTaskIds,
    handleToggleExpand,
    handleDeleteTask,
    handleToggleComplete,
    handleEditTask,
    handleAddMainTask,
  } = useTaskManager();

  const [isProjectEditable, setIsProjectEditable] = useState(false); // do zastanowienia się czy potrzebuję stanu lokalnego do wyświetlania formularza edycji Taska.

  const handleEditProjectClick = () => setIsProjectEditable((prev) => !prev);

  const { status, selectedProject: Project } = useSelector(
    (state: RootState) => state.projects,
  );

  const { tasks } = useSelector((state: RootState) => state.tasks);

  if (status === 'loading' || status === 'idle') {
    return (
      <div>
        <p>Ładowanie danych z projektu....</p>
      </div>
    );
  }
  if (!Project) {
    return (
      <div className="p-8 bg-gray-700 text-white min-h-screen">
        Nie udało się wczytać projektu lub projekt nie istnieje.
      </div>
    );
  }

  return (
    <div className=" text-white min-h-fit w-full bg-opacity-50 p-8 rounded-lg shadow-xl">
      {/* przeniesienie formularza do osobnego Komponentu */}
      {isProjectEditable && (
        <RemoveScroll>
          <div className="w-full h-full absolute left-0 top-0 flex justify-center items-start  pt-20 z-50 bg-slate-700 bg-opacity-40 backdrop-blur-md">
            <div className="bg-slate-500 rounded-lg w-1/2 p-3">
              <header className="p-2 bg-blue-300 bg-opacity-50 rounded-lg shadow-xl mb-2 align-middle">
                <h3 className="uppercase font-semibold">Parametry Projektu</h3>
              </header>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col gap-2 w-1/2 max-w-sm bg-blue-300 bg-opacity-50 p-2 rounded-lg shadow-xl">
                  <ul>
                    <li>
                      <p className="text-sm font-bold mb-4 uppercase">
                        Nazwa Projektu:{' '}
                        <span className="font-semibold">{Project.name}</span>
                      </p>
                    </li>
                    <li>
                      <p className="text-sm font-bold mb-4 uppercase">
                        Utworzono:{' '}
                        {
                          <span className="font-semibold">
                            {new Date(Project.createdAt).toLocaleString()}
                          </span>
                        }
                      </p>
                    </li>
                    <li>
                      <p className="text-sm font-bold mb-4 uppercase">
                        Aktualizacj:{' '}
                        {
                          <span className="font-semibold">
                            {new Date(Project.updatedAt).toLocaleString()}
                          </span>
                        }
                      </p>
                    </li>
                    <li>
                      <p className="text-sm font-bold mb-4 uppercase">
                        Właściciel:{<br />}
                        <span className="font-semibold">{Project.userId}</span>
                      </p>
                    </li>
                  </ul>
                </div>
                <ProjectEditForm
                  handleFormCancel={() => setIsProjectEditable(false)}
                  handleSubmit={(formData: {
                    name: string;
                    description: string;
                  }) => {
                    handleEditedProjectSubmit(formData);
                    setIsProjectEditable(false);
                  }}
                  formInitValues={{
                    name: Project.name,
                    description: Project.description || 'Brak opisu',
                  }}
                />
              </div>
            </div>
          </div>
        </RemoveScroll>
      )}
      <h1 className="text-3xl font-bold mb-4">{Project.name}</h1>
      <p className="text-sm font-bold mb-4">
        {`Projekt utworzono: ${new Date(Project.createdAt).toLocaleString()}`}
      </p>
      <p className="text-sm font-semibold mb-4">
        {`Ostatnia zmiana: ${new Date(Project.updatedAt).toLocaleString()}`}
      </p>
      {/* Project tool box */}
      <div className="flex md:flex-row md:justify-between mb-6 flex-grow-0">
        <div className="flex gap-4 mb-6">
          <Button
            variant="primary"
            className="mb-4"
            onClick={
              () =>
                console.log(
                  "'Add Task clicked'",
                ) /* handleAddTask(title, Project.id) */
            }
          >
            Dodaj zadanie
          </Button>

          <Button
            variant="primary"
            className="mb-4"
            onClick={handleEditProjectClick}
            disabled={isProjectEditable}
          >
            Edytuj Projekt
          </Button>

          <Button
            variant="danger"
            className="mb-4"
            onClick={() => handleDeleteProject(Project.id)}
          >
            Usuń projekt
          </Button>
        </div>
      </div>
      {/* Project tool box */}

      <TaskList
        projectId={Project.id}
        tasks={tasks}
        expandedTaskIds={expandedTaskIds}
        handleToggleExpand={handleToggleExpand}
        handleToggleComplete={handleToggleComplete}
        handleDeleteTask={handleDeleteTask}
        handleEditTask={handleEditTask}
        handleSubTaskAdd={handleSubTaskAdd}
      />
      <AddTaskForm onTaskAdd={handleAddMainTask} projectId={Project.id} />
    </div>
  );
}
