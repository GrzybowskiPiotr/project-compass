import { AddTaskForm } from './AddTaskForm';
import { TaskList } from './TaskList';
import { useProjectManager } from './useProjectManager';

export function ProjectView() {
  const {
    project,
    isLoading,
    expandedTaskIds,
    handleToggleExpand,
    handleToggleComplete,
    handleDeleteTask,
    handleEditTask,
    handleAddTask,
    handleSubTaskAdd,
  } = useProjectManager();

  if (isLoading) {
    return (
      <div className="p-8 bg-gray-700 text-white min-h-screen">
        Ładowanie projektu...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-8 bg-gray-700 text-white min-h-screen">
        Nie udało się wczytać projektu lub projekt nie istnieje.
      </div>
    );
  }
  return (
    <div className="p-8 bg-gray-700 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4">{project.name}</h1>
      <TaskList
        tasks={project.tasks}
        expandedTaskIds={expandedTaskIds}
        onToggleExpand={handleToggleExpand}
        onToggleComplete={handleToggleComplete}
        onTaskDelete={handleDeleteTask}
        handleEditTask={handleEditTask}
        handleSubTaskAdd={handleSubTaskAdd}
      />
      <AddTaskForm onTaskAdd={handleAddTask} />
    </div>
  );
}
export default ProjectView;
