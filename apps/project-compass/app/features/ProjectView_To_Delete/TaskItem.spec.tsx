import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TaskItem } from './TaskItem';

const mockTask = {
  id: 'task-1',
  title: 'Task test',
  isCompleted: false,
  createdAt: new Date(),
  subTasks: [],
};

const onTaskDeleteMock = vi.fn();
const onToggleCompleteMock = vi.fn();
const handleEditTaskMock = vi.fn();
const onToggleExpandMock = vi.fn();
const onSubTaskAddMock = vi.fn();

describe('TaskItem', () => {
  beforeEach(() =>
    render(
      <TaskItem
        task={mockTask}
        onTaskDelete={onTaskDeleteMock}
        expandedTaskIds={[]}
        handleEditTask={handleEditTaskMock}
        onToggleComplete={onToggleCompleteMock}
        onToggleExpand={onToggleExpandMock}
        handleSubTaskAdd={onSubTaskAddMock}
      />,
    ),
  );
  it('should call onTaskDelete with correct taskId when delete button is clicked', () => {
    const deleteButton = screen.getByRole('button', { name: /usuń/i });

    expect(deleteButton).toBeInTheDocument();

    fireEvent.click(deleteButton);

    expect(onTaskDeleteMock).toHaveBeenCalledTimes(1);
    expect(onTaskDeleteMock).toHaveBeenCalledWith('task-1');
  });
  it('should toggle task completion when checkbox is clicked', () => {
    const isTaskCompletedCheckbox = screen.getByRole('checkbox');

    fireEvent.click(isTaskCompletedCheckbox);

    expect(onToggleCompleteMock).toHaveBeenCalledTimes(1);
    expect(onToggleCompleteMock).toHaveBeenCalledWith('task-1');
  });
  it('should call onSubTasskAdd with parent task id when add sub-task button is clicked', () => {
    const addSubTaskButton = screen.getByLabelText(/dodaj podzadanie/i);
    fireEvent.click(addSubTaskButton);
    expect(onSubTaskAddMock).toHaveBeenCalledTimes(1);
    expect(onSubTaskAddMock).toHaveBeenCalledWith(
      'task-1',
      'Testiwe sub zadanie',
    );
  });
});
