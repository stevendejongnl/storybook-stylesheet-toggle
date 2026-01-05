import React, { useState } from 'react';
import { Form, Button } from 'storybook/internal/components';
import { saveCustomStylesheet, isValidStylesheetUrl, getCustomStylesheets, isDuplicateUrl } from './customStylesheets';

interface CustomStylesheetInputProps {
  onAdd: (id: string) => void;
}

export const CustomStylesheetInput: React.FC<CustomStylesheetInputProps> = ({ onAdd }) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAdd = () => {
    // Validate URL
    if (!inputValue.trim()) {
      setError('URL is required');
      return;
    }

    if (!isValidStylesheetUrl(inputValue)) {
      setError('Invalid stylesheet URL (must end with .css)');
      return;
    }

    // Check duplicates
    const existing = getCustomStylesheets();
    if (isDuplicateUrl(inputValue, existing)) {
      setError('This stylesheet already exists');
      return;
    }

    // Save and switch to new stylesheet
    const newSheet = saveCustomStylesheet(inputValue);
    setInputValue('');
    setError(null);
    onAdd(newSheet.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
      <Form.Field label="Add Custom Stylesheet">
        <div style={{ display: 'flex', gap: '4px' }}>
          <Form.Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="https://example.com/theme.css"
            style={{ flex: 1 }}
          />
          <Button onClick={handleAdd} size="small">
            Add
          </Button>
        </div>
        {error && (
          <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
            {error}
          </div>
        )}
      </Form.Field>
    </div>
  );
};
