import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText, CircularProgress, Card, CardMedia, CardContent } from '@mui/material';

const Product = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3010/data?name=ELDEN%20RING');
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Erro ao carregar os dados: {error.message}</Typography>;
  }

  // Acessando dados do JSON
  const steamData = data.STEAM || {};
  const amazonData = data.AMAZON || {};

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Detalhes do produto
      </Typography>

      <Card sx={{ marginBottom: 2 }}>
        <CardMedia
          component="img"
          height="140"
          image={steamData.img_src}
          alt="Imagem do produto"
        />
        <CardContent>
          <Typography variant="h6">STEAM</Typography>
          <Typography variant="h5">{steamData.description}</Typography>
          <Typography variant="body2" color="text.secondary">
            {steamData.users_summary_review}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Preço: {steamData.price}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Data de Lançamento: {steamData.date}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Desenvolvedores: {steamData.developers}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gêneros: {steamData.popular_genders}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Classificação indicativa: {steamData.classification_age	}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Requirimentos: {steamData.requiriments}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Comentários: {steamData.comments}
          </Typography>
        </CardContent>
      </Card>

      {amazonData.description && (
        
        <Card sx={{ marginBottom: 2 }}>
          <CardMedia
            component="img"
            height="140"
            image={amazonData.img_src}
            alt="Imagem do produto"
          />
          <CardContent>
            <Typography variant="h6">Amazon</Typography>
            <Typography variant="h5" color="text.secondary">
              {amazonData.description}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Preço: {amazonData.price}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Desenvolvedores: {amazonData.developers}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sumário de usuários: {amazonData.users_summary_review}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Desenvolvedores: {amazonData.developers}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Detalhes do produto: {amazonData.product_details}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Plataforma: {amazonData.platform}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Avaliações: {amazonData.reviews}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default Product;
