'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import SearchIcon from '@mui/icons-material/Search';
import Header from '@/components/Header';
import { User, Order, Payment } from '@/types';

// Импортируем стили Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [paymentFilters, setPaymentFilters] = useState({
    name: '',
    status: '',
    action: '',
  });

  useEffect(() => {
    // Проверяем авторизацию
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/auth');
      return;
    }

    setUser(JSON.parse(userData));
    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      // Загружаем заказы
      const ordersResponse = await fetch('/api/orders');
      const ordersData = await ordersResponse.json();
      setOrders(ordersData.orders || []);

      // Загружаем платежи
      const paymentsResponse = await fetch('/api/payments');
      const paymentsData = await paymentsResponse.json();
      setPayments(paymentsData.payments || []);
      setFilteredPayments(paymentsData.payments || []);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handlePaymentFilterChange = (field: string, value: string) => {
    const newFilters = { ...paymentFilters, [field]: value };
    setPaymentFilters(newFilters);

    let filtered = payments;

    if (newFilters.name) {
      filtered = filtered.filter(payment =>
        payment.title.toLowerCase().includes(newFilters.name.toLowerCase())
      );
    }

    if (newFilters.status) {
      filtered = filtered.filter(payment => payment.status === newFilters.status);
    }

    if (newFilters.action) {
      filtered = filtered.filter(payment => payment.action === newFilters.action);
    }

    setFilteredPayments(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Выполнен';
      case 'pending': return 'В ожидании';
      case 'cancelled': return 'Отменён';
      default: return status;
    }
  };

  if (!user) {
    return <div>Загрузка...</div>;
  }

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Блок Профиль */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Профиль
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Имя: {user.firstName} {user.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Email: {user.email}
                </Typography>
                {user.phone && (
                  <Typography variant="body2" color="text.secondary">
                    Телефон: {user.phone}
                  </Typography>
                )}
              </Box>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => router.push('/profile')}
              >
                Редактировать профиль
              </Button>
            </Paper>
          </Grid>

          {/* Блок Заказы */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Заказы
              </Typography>
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={16}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                breakpoints={{
                  640: {
                    slidesPerView: 2,
                  },
                  768: {
                    slidesPerView: 3,
                  },
                }}
              >
                {orders.map((order) => (
                  <SwiperSlide key={order.id}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" component="div">
                          {order.title}
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                          {order.description}
                        </Typography>
                        <Typography variant="h6" color="primary">
                          {order.amount.toLocaleString()} ₽
                        </Typography>
                        <Chip
                          label={getStatusText(order.status)}
                          color={getStatusColor(order.status) as any}
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      </CardContent>
                      <CardActions>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(order.date).toLocaleDateString()}
                        </Typography>
                      </CardActions>
                    </Card>
                  </SwiperSlide>
                ))}
              </Swiper>
            </Paper>
          </Grid>

          {/* Блок Трансляция */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Трансляция
              </Typography>
              <Box
                sx={{
                  height: 200,
                  backgroundColor: '#f5f5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 1,
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  Здесь будет трансляция
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Блок Платежи */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Платежи
              </Typography>
              
              {/* Фильтры */}
              <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField
                  size="small"
                  placeholder="Поиск по названию"
                  value={paymentFilters.name}
                  onChange={(e) => handlePaymentFilterChange('name', e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ minWidth: 200 }}
                />
                
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Статус</InputLabel>
                  <Select
                    value={paymentFilters.status}
                    label="Статус"
                    onChange={(e) => handlePaymentFilterChange('status', e.target.value)}
                  >
                    <MenuItem value="">Все</MenuItem>
                    <MenuItem value="completed">Выполнен</MenuItem>
                    <MenuItem value="pending">В ожидании</MenuItem>
                    <MenuItem value="cancelled">Отменён</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Действие</InputLabel>
                  <Select
                    value={paymentFilters.action}
                    label="Действие"
                    onChange={(e) => handlePaymentFilterChange('action', e.target.value)}
                  >
                    <MenuItem value="">Все</MenuItem>
                    <MenuItem value="payment">Платёж</MenuItem>
                    <MenuItem value="refund">Возврат</MenuItem>
                    <MenuItem value="transfer">Перевод</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Список платежей */}
              <Grid container spacing={2}>
                {filteredPayments.map((payment) => (
                  <Grid item xs={12} sm={6} md={4} key={payment.id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" component="div">
                          {payment.title}
                        </Typography>
                        <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                          {payment.amount.toLocaleString()} ₽
                        </Typography>
                        <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                          <Chip
                            label={getStatusText(payment.status)}
                            color={getStatusColor(payment.status) as any}
                            size="small"
                          />
                          <Chip
                            label={payment.action}
                            variant="outlined"
                            size="small"
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {new Date(payment.date).toLocaleDateString()}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
