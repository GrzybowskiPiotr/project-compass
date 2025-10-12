import { Button, Form, Input, TextArea } from '@project-compass/shared-ui';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { AppDispatch, RootState } from '../../../../store/store';
import { clearProjectError, createProject } from '../projects.slice';

export default function ProjectCreateForm() {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');

  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const { status, selectedProject } = useSelector(
    (state: RootState) => state.projects,
  );

  useEffect(() => {
    dispatch(clearProjectError());
    if (status === 'succeeded' && selectedProject && projectName) {
      navigate('/');
    }
  }, [status, navigate, selectedProject, dispatch, projectName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (projectName.trim()) {
      dispatch(
        createProject({ name: projectName, description: description.trim() }),
      );
    }
  };

  return (
    <Form onSubmit={handleSubmit} formTitle="Utwórz nowy projekt">
      <Input
        title="Nazwa Projektu:"
        isRequired={true}
        type="common"
        placeHolder="Nadaj nazwę dla projektu"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
      />
      <TextArea
        title="Opis (opcjonalnie):"
        onChange={(e) => setDescription(e.target.value)}
        value={description}
        placeholder="Opisz krótko projekt..."
      />
      {status === 'loading' && (
        <p className="text-blue-600 mb-4">Tworzenie projektu...</p>
      )}
      <Button
        type="submit"
        variant="primary"
        disabled={status === 'loading'}
        className="w-full"
      >
        Utwórz Projekt
      </Button>
    </Form>
  );
}
