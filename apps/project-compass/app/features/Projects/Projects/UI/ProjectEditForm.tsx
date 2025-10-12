import { Button, Form, Input, TextArea } from '@project-compass/shared-ui';
import { useState } from 'react';

interface ProjectEditFormProps {
  handleFormCancel: () => void;
  handleSubmit: (data: any) => void;
  formInitValues: { name: string; description: string };
}

export function ProjectEditForm({
  handleFormCancel,
  handleSubmit,
  formInitValues,
}: ProjectEditFormProps) {
  const [formData, setFromData] = useState(formInitValues);

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(formData);
  };

  return (
    <div>
      <Form
        onSubmit={onFormSubmit}
        formTitle="Edycja Projektu"
        key={'edit-project-form'}
      >
        <Input
          title="Edytuj nazwę projektu:"
          placeHolder={formData.name}
          value={formData.name}
          onChange={(e) => setFromData({ ...formData, name: e.target.value })}
          type="common"
          isRequired={true}
        />
        <TextArea
          title="Edytuj opis projektu:"
          placeholder={formData.description}
          value={formData.description}
          onChange={(e) =>
            setFromData({ ...formData, description: e.target.value })
          }
        />
        <div className="flex justify-end gap-4">
          <Button variant="primary" type="button" onClick={handleFormCancel}>
            Anuluj
          </Button>
          <Button type="submit">Zapisz</Button>
        </div>
      </Form>
    </div>
  );
}
