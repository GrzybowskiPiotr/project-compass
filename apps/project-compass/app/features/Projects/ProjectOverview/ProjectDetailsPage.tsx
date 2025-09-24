import { Button } from '@project-compass/ui';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { TaskList } from '../ProjectTasks/TaskList';
import { useTaskManager } from '../ProjectTasks/useTasksManager';
import { useProjectManager } from '../useProjectManager';

export default function ProjectDetailsPage() {
  const {
    handleDeleteProject,
    handleToggleComplete,
    handleEditTask,
    handleSubTaskAdd,
  } = useProjectManager();

  const {
    handleAddTask,
    // handleToggleComplete,
    expandedTaskIds,
    handleToggleExpand,
    handleDeleteTask,
  } = useTaskManager();

  const {
    status,
    selectedProject: Project,
    projects,
  } = useSelector((state: RootState) => state.projects);

  console.log('Projects from Redux:', projects);
  console.log('Selected Project from Redux:', Project);

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
      <h1 className="text-3xl font-bold mb-4">{Project.name}</h1>
      <p className="text-sm font-bold mb-4">
        {`Utworzono: ${new Date(Project.createdAt).toLocaleString()}`}
      </p>
      {/* Project tool box */}
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
          onClick={() => handleDeleteProject(Project.id)}
        >
          Usuń projekt
        </Button>
      </div>

      {/* Project tool box */}

      <TaskList
        projectId={Project.id}
        tasks={Project.tasks}
        expandedTaskIds={expandedTaskIds}
        handleToggleExpand={handleToggleExpand}
        handleToggleComplete={handleToggleComplete}
        handleDeleteTask={handleDeleteTask}
        handleEditTask={handleEditTask}
        handleSubTaskAdd={handleSubTaskAdd}
      />
      {/* <AddTaskForm onTaskAdd={handleAddTask} projectId={Project.id} /> */}
    </div>
  );
}
