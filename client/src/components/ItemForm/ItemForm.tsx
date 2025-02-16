import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Stepper, Step, StepLabel, Paper, Typography } from '@mui/material';
import { Item } from '../../types';
import { api } from '../../api/axios';
import BasicInfoStep from './BasicInfoStep';
import CategoryStep from './CategoryStep';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { saveDraft, setStep, clearDraft } from '../../store/draftSlice';

const steps = ['Основная информация', 'Информация о категории'];

const ItemForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get draft state from Redux
  const { currentDraft, step } = useSelector((state: RootState) => state.draft);
  
  const [activeStep, setActiveStep] = useState(step);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<Item>>(() => {
    // Initialize with draft data if available, otherwise use default values
    return currentDraft || {
      name: '',
      description: '',
      location: '',
      type: 'Недвижимость',
    };
  });

  useEffect(() => {
    if (id) {
      setEditMode(true);
      const controller = new AbortController();
      
      const fetchItem = async () => {
        try {
          const response = await api.get(`/items/${id}`, {
            signal: controller.signal,
          });
          setFormData(response.data);
          // Clear draft when editing existing item
          dispatch(clearDraft());
        } catch (error) {
          console.error('Error fetching item:', error);
        }
      };

      fetchItem();
      return () => controller.abort();
    }
  }, [id, dispatch]);

  const handleSubmit = async (data: Partial<Item>) => {
    try {
      const finalData = { ...formData, ...data };
      if (editMode) {
        await api.put(`/items/${id}`, finalData);
      } else {
        await api.post('/items', finalData);
      }
      // Clear draft after successful submission
      dispatch(clearDraft());
      navigate('/list');
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const handleNext = (stepData: Partial<Item>) => {
    const updatedData = { ...formData, ...stepData };
    setFormData(updatedData);
    
    // Save to draft
    dispatch(saveDraft(updatedData));
    
    if (activeStep === steps.length - 1) {
      handleSubmit(stepData);
    } else {
      const nextStep = activeStep + 1;
      setActiveStep(nextStep);
      dispatch(setStep(nextStep));
    }
  };

  const handleBack = () => {
    const prevStep = activeStep - 1;
    setActiveStep(prevStep);
    dispatch(setStep(prevStep));
  };

  const updateFormData = (newData: Partial<Item>) => {
    const updatedData = { ...formData, ...newData };
    setFormData(updatedData);
    // Save to draft when form data changes
    dispatch(saveDraft(updatedData));
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {editMode ? 'Редактирование объявления' : 'Создание объявления'}
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <BasicInfoStep 
            onNext={() => handleNext(formData)}
            initialData={formData}
            onChange={updateFormData}
          />
        )}
        {activeStep === 1 && (
          <CategoryStep
            onBack={handleBack}
            onSubmit={handleSubmit}
            editMode={editMode}
            initialData={formData}
          />
        )}
      </Paper>
    </Box>
  );
};

export default ItemForm;