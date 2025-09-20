'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import Header from '@/components/Header';
import { User, ProfileFormData } from '@/types';
import { validateForm } from '@/lib/validation';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    // Проверяем авторизацию
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/auth');
      return;
    }

    const user = JSON.parse(userData);
    setUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || '',
    });
  }, [router]);

  const handleInputChange = (field: keyof ProfileFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
    setError('');
    setSuccess('');
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const validation = validateForm(formData);
      if (!validation.isValid) {
        setError(validation.errors.join(', '));
        setLoading(false);
        return;
      }

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Произошла ошибка');
        setLoading(false);
        return;
      }

      // Обновляем данные пользователя в localStorage
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setIsEditing(false);
      setSuccess('Профиль успешно обновлён');
    } catch (err) {
      setError('Произошла ошибка при отправке запроса');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return validateForm(formData).isValid;
  };

  if (!user) {
    return <div>Загрузка...</div>;
  }

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Профиль
          </Typography>

          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="firstName"
              label="Имя"
              name="firstName"
              autoComplete="given-name"
              value={formData.firstName}
              onChange={handleInputChange('firstName')}
              disabled={!isEditing}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="lastName"
              label="Фамилия"
              name="lastName"
              autoComplete="family-name"
              value={formData.lastName}
              onChange={handleInputChange('lastName')}
              disabled={!isEditing}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              disabled={!isEditing}
            />
            
            <TextField
              margin="normal"
              fullWidth
              id="phone"
              label="Телефон"
              name="phone"
              autoComplete="tel"
              value={formData.phone}
              onChange={handleInputChange('phone')}
              disabled={!isEditing}
            />

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              {!isEditing ? (
                <Button
                  variant="contained"
                  onClick={handleEdit}
                >
                  Редактировать
                </Button>
              ) : (
                <>
                  <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={!isFormValid() || loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Сохранить'}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Отмена
                  </Button>
                </>
              )}
            </Box>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {success}
              </Alert>
            )}
          </Box>
        </Paper>
      </Container>
    </>
  );
}
