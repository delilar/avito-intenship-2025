import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  SelectChangeEvent,
} from '@mui/material';
import { Item, ItemType } from '../../types';
import ImageUpload from './ImageUpload';

interface BasicInfoStepProps {
  onNext: () => void;
  initialData: Partial<Item>;
  onChange: (data: Partial<Item>) => void;
}

interface ValidationErrors {
  name?: string;
  description?: string;
  location?: string;
  type?: string;
}

const BasicInfoStep = ({ onNext, initialData, onChange }: BasicInfoStepProps) => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = (field: keyof ValidationErrors, value: string | number | undefined): string | undefined => {
    if (value === undefined || (typeof value === 'string' && value.trim() === '')) {
      return 'Обязательное поле';
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ValidationErrors> = {};
    let isValid = true;

    const requiredFields: (keyof ValidationErrors)[] = ['name', 'description', 'location', 'type'];
    requiredFields.forEach(field => {
      const error = validateField(field, initialData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors as ValidationErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const handleTextFieldChange = (field: keyof ValidationErrors) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    onChange({ ...initialData, [field]: value });

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSelectChange = (field: keyof ValidationErrors) => (
    event: SelectChangeEvent<ItemType>
  ) => {
    const value = event.target.value;
    onChange({ ...initialData, [field]: value });

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleImageChange = (image: string | null) => {
    onChange({ ...initialData, image });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <ImageUpload
        initialImage={initialData.image ?? undefined}
        onImageChange={handleImageChange}
      />


      <TextField
        label="Название"
        value={initialData.name || ''}
        onChange={handleTextFieldChange('name')}
        error={!!errors.name}
        helperText={errors.name}
        fullWidth
      />

      <TextField
        label="Описание"
        multiline
        rows={4}
        value={initialData.description || ''}
        onChange={handleTextFieldChange('description')}
        error={!!errors.description}
        helperText={errors.description}
        fullWidth
      />

      <TextField
        label="Локация"
        value={initialData.location || ''}
        onChange={handleTextFieldChange('location')}
        error={!!errors.location}
        helperText={errors.location}
        fullWidth
      />

      <FormControl fullWidth error={!!errors.type}>
        <InputLabel>Категория</InputLabel>
        <Select
          value={initialData.type || ''}
          onChange={handleSelectChange('type')}
          label="Категория"
        >
          <MenuItem value="Недвижимость">Недвижимость</MenuItem>
          <MenuItem value="Авто">Авто</MenuItem>
          <MenuItem value="Услуги">Услуги</MenuItem>
        </Select>
        {errors.type && (
          <FormHelperText>{errors.type}</FormHelperText>
        )}
      </FormControl>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" onClick={handleNext}>
          Далее
        </Button>
      </Box>
    </Box>
  );
};

export default BasicInfoStep;