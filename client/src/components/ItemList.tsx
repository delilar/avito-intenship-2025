import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CardMedia, 
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  TextField,
  Typography,
  SelectChangeEvent
} from '@mui/material';
import { AppDispatch, RootState } from '../store';
import { fetchItems, setCurrentPage, setSelectedCategory } from '../store/itemSlice';
import { ImageIcon } from 'lucide-react';

const CARD_HEIGHT = 200;

// Компонент плейсхолдера для изображения
const ImagePlaceholder: React.FC = () => {
  return (
    <Box 
      sx={{ 
        width: '100%',
        height: '100%',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <ImageIcon style={{ width: 64, height: 64, color: '#9e9e9e' }} />
      <Typography className="sr-only">Изображение отсутствует</Typography>
    </Box>
  );
};

const ItemList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  const { 
    items, 
    loading, 
    error, 
    currentPage, 
    itemsPerPage, 
    selectedCategory 
  } = useSelector((state: RootState) => state.items);

  useEffect(() => {
    const promise = dispatch(fetchItems());
    return () => {
      promise.abort();
    };
  }, [dispatch]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    dispatch(setCurrentPage(value));
  };

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    dispatch(setSelectedCategory(event.target.value));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    dispatch(setCurrentPage(1));
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || item.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const pageCount = Math.ceil(filteredItems.length / itemsPerPage);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Container 
      disableGutters 
      sx={{ 
        py: 4,
        px: { xs: 2, sm: 4 },
        maxWidth: '100% !important'
      }}
    >
      {/* Верхняя панель с заголовком и кнопкой */}
      <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
        <Typography variant="h4" component="h1">
          Объявления
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => navigate('/form')}
          sx={{ marginTop: 0.5 }}
        >
          Разместить объявление
        </Button>
      </Box>

      {/* Панель поиска и фильтрации */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
        <TextField
          fullWidth
          label="Поиск по названию"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <FormControl sx={{ minWidth: { xs: '100%', sm: 200 } }}>
          <InputLabel>Категория</InputLabel>
          <Select
            value={selectedCategory || ''}
            onChange={handleCategoryChange}
            label="Категория"
          >
            <MenuItem value="">Все</MenuItem>
            <MenuItem value="Недвижимость">Недвижимость</MenuItem>
            <MenuItem value="Авто">Авто</MenuItem>
            <MenuItem value="Услуги">Услуги</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Список карточек */}
      <Grid container spacing={3}>
        {paginatedItems.map((item) => (
          <Grid item xs={12} key={item.id}>
            <Card sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              height: { xs: 'auto', sm: CARD_HEIGHT }
            }}>
              {/* Контейнер для изображения */}
              <Box sx={{ 
                width: { xs: '100%', sm: '30%' },
                height: { xs: CARD_HEIGHT, sm: '100%' }
              }}>
                {item.image ? (
                  <CardMedia
                    component="img"
                    height={CARD_HEIGHT}
                    image={item.image}
                    alt={item.name}
                    sx={{ 
                      objectFit: 'cover',
                      height: '100%',
                      width: '100%'
                    }}
                  />
                ) : (
                  <ImagePlaceholder />
                )}
              </Box>
              
              {/* Контейнер для контента */}
              <CardContent sx={{ 
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                p: 3,
                width: { xs: '100%', sm: '70%' },
                '&:last-child': { pb: 3 }
              }}>
                <Box>
                  <Typography 
                    variant="h5" 
                    component="h2" 
                    sx={{ 
                      mb: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    {item.name}
                  </Typography>
                  <Typography 
                    color="textSecondary" 
                    gutterBottom
                    sx={{ mb: 1 }}
                  >
                    {item.location}
                  </Typography>
                  <Typography 
                    color="textSecondary"
                    sx={{ mb: 2 }}
                  >
                    Категория: {item.type}
                  </Typography>
                </Box>
                
                <Box>
                  <Button 
                    variant="outlined"
                    onClick={() => navigate(`/item/${item.id}`)}
                  >
                    Открыть
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Пагинация */}
      {pageCount > 1 && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={pageCount}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Container>
  );
};

export default ItemList;