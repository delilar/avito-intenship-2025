import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Box,
  Button,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography 
} from '@mui/material';
import { api } from '../api/axios';
import { Item } from '../types';

const ItemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchItem = async () => {
      try {
        setLoading(true);
        setError(null); // Сбрасываем ошибку перед новым запросом
        
        const response = await api.get<Item>(`/items/${id}`, {
          signal: controller.signal
        });
        
        // Проверяем, не был ли запрос отменен перед установкой данных
        if (!controller.signal.aborted) {
          setItem(response.data);
        }
      } catch (err) {
        // Проверяем, не был ли запрос отменен перед установкой ошибки
        if (!controller.signal.aborted) {
          if (err instanceof Error) {
            // Игнорируем ошибку отмены
            if (err.name === 'CanceledError' || err.name === 'AbortError') {
              return;
            }
            setError(err.message);
          } else {
            setError('Failed to fetch item');
          }
        }
      } finally {
        // Устанавливаем loading в false только если запрос не был отменен
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchItem();

    return () => {
      controller.abort();
    };
  }, [id]);

  // Остальной код компонента остается без изменений
  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error || !item) {
    return <Typography color="error">{error || 'Item not found'}</Typography>;
  }

  const renderCategorySpecificDetails = () => {
    switch (item.type) {
      case 'Недвижимость':
        return (
          <>
            <Typography>Тип недвижимости: {item.propertyType}</Typography>
            <Typography>Площадь: {item.area} м²</Typography>
            <Typography>Количество комнат: {item.rooms}</Typography>
            <Typography>Цена: {item.price} ₽</Typography>
          </>
        );
      case 'Авто':
        return (
          <>
            <Typography>Марка: {item.brand}</Typography>
            <Typography>Модель: {item.model}</Typography>
            <Typography>Год выпуска: {item.year}</Typography>
            {item.mileage && (
              <Typography>Пробег: {item.mileage} км</Typography>
            )}
          </>
        );
      case 'Услуги':
        return (
          <>
            <Typography>Тип услуги: {item.serviceType}</Typography>
            <Typography>Опыт работы: {item.experience} лет</Typography>
            <Typography>Стоимость: {item.cost} ₽</Typography>
            {item.workSchedule && (
              <Typography>График работы: {item.workSchedule}</Typography>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container>
        <Grid item xs={12} md={6}>
          <CardMedia
            component="img"
            height="400"
            image={item.image || '/placeholder-image.jpg'}
            alt={item.name}
            sx={{ objectFit: 'cover' }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CardContent>
            <Typography variant="h4" component="h1" gutterBottom>
              {item.name}
            </Typography>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              {item.location}
            </Typography>
            <Typography variant="body1" paragraph>
              {item.description}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Категория: {item.type}
            </Typography>
            
            <Box sx={{ my: 2 }}>
              {renderCategorySpecificDetails()}
            </Box>

            <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                onClick={() => navigate(`/form/${item.id}`)}
              >
                Редактировать
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/list')}
              >
                Вернуться к списку
              </Button>
            </Box>
          </CardContent>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ItemDetail;