import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { Item } from '../../types';

interface CategoryStepProps {
  onBack: () => void;
  onSubmit: (data: Partial<Item>) => void;
  editMode: boolean;
  initialData?: Partial<Item>;
}

interface ValidationErrors {
  [key: string]: string;
}

const CategoryStep = ({ onBack, onSubmit, editMode, initialData }: CategoryStepProps) => {
  const [formData, setFormData] = useState<Partial<Item>>(initialData || {});
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const validateField = (name: string, value: string | number): string => {
    if (typeof value === 'number') {
      switch (name) {
        case 'area':
          if (value < 1) return 'Минимальная площадь 1 кв. м';
          break;
        case 'rooms':
          if (value < 1) return 'Минимум 1 комната';
          break;
        case 'price':
        case 'cost':
          if (value < 0) return 'Значение не может быть отрицательным';
          break;
        case 'year':
          if (value < 1900) return 'Минимальный год 1900';
          if (value > new Date().getFullYear()) return 'Некорректный год';
          break;
        case 'mileage':
          if (value < 0) return 'Пробег не может быть отрицательным';
          break;
        case 'experience':
          if (value < 0) return 'Опыт не может быть отрицательным';
          break;
      }
    }
    return '';
  };

  const handleChange = (name: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [name]: value }));

    const error = validateField(name, value);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = () => {
    // Validate required fields based on type
    const newErrors: ValidationErrors = {};

    if (formData.type === 'Недвижимость') {
      if (!formData.propertyType) newErrors.propertyType = 'Обязательное поле';
      if (!formData.area) newErrors.area = 'Обязательное поле';
      if (!formData.rooms) newErrors.rooms = 'Обязательное поле';
      if (!formData.price) newErrors.price = 'Обязательное поле';
    }

    if (formData.type === 'Авто') {
      if (!formData.brand) newErrors.brand = 'Обязательное поле';
      if (!formData.model) newErrors.model = 'Обязательное поле';
      if (!formData.year) newErrors.year = 'Обязательное поле';
    }

    if (formData.type === 'Услуги') {
      if (!formData.serviceType) newErrors.serviceType = 'Обязательное поле';
      if (!formData.experience) newErrors.experience = 'Обязательное поле';
      if (!formData.cost) newErrors.cost = 'Обязательное поле';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {formData.type === 'Недвижимость' && (
        <>
          <FormControl fullWidth error={!!errors.propertyType}>
            <InputLabel>Тип недвижимости</InputLabel>
            <Select
              value={formData.propertyType || ''}
              onChange={(e) => handleChange('propertyType', e.target.value)}
            >
              <MenuItem value="Квартира">Квартира</MenuItem>
              <MenuItem value="Дом">Дом</MenuItem>
              <MenuItem value="Коттедж">Коттедж</MenuItem>
            </Select>
            {errors.propertyType && (
              <FormHelperText>{errors.propertyType}</FormHelperText>
            )}
          </FormControl>

          <TextField
            label="Площадь (кв. м)"
            type="number"
            value={formData.area || ''}
            onChange={(e) => handleChange('area', Number(e.target.value))}
            error={!!errors.area}
            helperText={errors.area}
          />

          <TextField
            label="Количество комнат"
            type="number"
            value={formData.rooms || ''}
            onChange={(e) => handleChange('rooms', Number(e.target.value))}
            error={!!errors.rooms}
            helperText={errors.rooms}
          />

          <TextField
            label="Цена"
            type="number"
            value={formData.price || ''}
            onChange={(e) => handleChange('price', Number(e.target.value))}
            error={!!errors.price}
            helperText={errors.price}
          />
        </>
      )}

      {formData.type === 'Авто' && (
        <>
          <FormControl fullWidth error={!!errors.brand}>
            <InputLabel>Марка</InputLabel>
            <Select
              value={formData.brand || ''}
              onChange={(e) => handleChange('brand', e.target.value)}
            >
              <MenuItem value="Toyota">Toyota</MenuItem>
              <MenuItem value="Honda">Honda</MenuItem>
              <MenuItem value="BMW">BMW</MenuItem>
              <MenuItem value="Mercedes">Mercedes</MenuItem>
            </Select>
            {errors.brand && (
              <FormHelperText>{errors.brand}</FormHelperText>
            )}
          </FormControl>

          <TextField
            label="Модель"
            value={formData.model || ''}
            onChange={(e) => handleChange('model', e.target.value)}
            error={!!errors.model}
            helperText={errors.model}
          />

          <TextField
            label="Год выпуска"
            type="number"
            value={formData.year || ''}
            onChange={(e) => handleChange('year', Number(e.target.value))}
            error={!!errors.year}
            helperText={errors.year}
          />

          <TextField
            label="Пробег (км)"
            type="number"
            value={formData.mileage || ''}
            onChange={(e) => handleChange('mileage', Number(e.target.value))}
            error={!!errors.mileage}
            helperText={errors.mileage}
          />
        </>
      )}

      {formData.type === 'Услуги' && (
        <>
          <FormControl fullWidth error={!!errors.serviceType}>
            <InputLabel>Тип услуги</InputLabel>
            <Select
              value={formData.serviceType || ''}
              onChange={(e) => handleChange('serviceType', e.target.value)}
            >
              <MenuItem value="Ремонт">Ремонт</MenuItem>
              <MenuItem value="Уборка">Уборка</MenuItem>
              <MenuItem value="Доставка">Доставка</MenuItem>
            </Select>
            {errors.serviceType && (
              <FormHelperText>{errors.serviceType}</FormHelperText>
            )}
          </FormControl>

          <TextField
            label="Опыт работы (лет)"
            type="number"
            value={formData.experience || ''}
            onChange={(e) => handleChange('experience', Number(e.target.value))}
            error={!!errors.experience}
            helperText={errors.experience}
          />

          <TextField
            label="Стоимость"
            type="number"
            value={formData.cost || ''}
            onChange={(e) => handleChange('cost', Number(e.target.value))}
            error={!!errors.cost}
            helperText={errors.cost}
          />

          <TextField
            label="График работы"
            value={formData.workSchedule || ''}
            onChange={(e) => handleChange('workSchedule', e.target.value)}
          />
        </>
      )}

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={onBack}>
          Назад
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          {editMode ? 'Сохранить' : 'Создать объявление'}
        </Button>
      </Box>
    </Box>
  );
};

export default CategoryStep;
