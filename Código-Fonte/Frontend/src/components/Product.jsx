import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Container, 
  Typography, 
  CircularProgress, 
  Card, 
  CardMedia, 
  CardContent, 
  Box, 
  Button
} from '@mui/material';

const Product = ({ nome, handleViewProduct }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3010/data?name=${encodeURIComponent(nome)}`);
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (nome) { // Garante que "nome" existe antes de fazer a requisição
      fetchData();
    }
  }, [nome]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return (
      <Typography color="error">
        Erro ao carregar os dados: {error.message}
      </Typography>
    );
  }

  // Acessando dados do JSON
  const steamData = data.STEAM || {};
  const amazonData = data.AMAZON || {};

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ marginTop: 10 }}>
        Detalhes do produto
      </Typography>

      {/* Card para Steam */}
      {steamData.description && (
      <Card sx={{ marginBottom: 2, display: 'flex', flexDirection: 'column', padding: 2 }}>
        <CardMedia
          component="img"
          sx={{ height: 200, objectFit: 'contain' }}
          image={steamData.img_src}
          alt="Imagem do produto"
        />
        <Box sx={{ flex: 1 }}>
        <CardContent>
      {/* Nome do jogo em negrito e centralizado */}
      <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 2 }}>
        {nome}
      </Typography>
      <Typography variant="h6" sx={{ textAlign: 'center', mb: 2 }}>
        STEAM
      </Typography>

      {/* Descrição com espaçamento maior e tamanho de fonte reduzido */}
      <Typography variant="h6" sx={{ mb: 3, fontSize: '0.9rem' }}>
        {steamData.description}
      </Typography>

      {/* Resumo de usuários, com mais espaçamento entre as linhas */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {steamData.users_summary_review}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Preço: {steamData.price}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Data de Lançamento: {steamData.date}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Desenvolvedores: {steamData.developers}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Gêneros: {steamData.popular_genders}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Classificação indicativa: {steamData.classification_age}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Requisitos: {steamData.requiriments}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Comentários: {steamData.comments}
      </Typography>
    </CardContent>
        </Box>
      </Card>
      )}

      {/* Card para Amazon (caso exista dados) */}
      {amazonData.description && (
  <Card sx={{ marginBottom: 2, display: 'flex', flexDirection: 'column', padding: 2 }}>
    <CardMedia
      component="img"
      sx={{ height: 200, objectFit: 'contain' }}
      image={amazonData.img_src}
      alt="Imagem do produto"
    />
    <Box sx={{ flex: 1 }}>
      <CardContent>
        {/* Nome da plataforma em negrito e centralizado */}
        <Typography variant="h6" sx={{ textAlign: 'center', mb: 2 }}>
          AMAZON
        </Typography>

        {/* Descrição com espaçamento maior e tamanho de fonte ajustado */}
        <Typography variant="h6" sx={{ mb: 3, fontSize: '0.9rem' }}>
          {amazonData.description}
        </Typography>

        {/* Resumo de usuários e outros detalhes com espaçamento */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Preço: {amazonData.price}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Desenvolvedores: {amazonData.developers}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Sumário de usuários: {amazonData.users_summary_review}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Detalhes do produto: {amazonData.product_details}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Plataforma: {amazonData.platform}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Avaliações: {amazonData.reviews}
        </Typography>
      </CardContent>
    </Box>
  </Card>
)}

    <Button
      variant="contained"
      sx={{
        backgroundColor: 'hsl(162, 98%, 36%)',
        marginBottom: "10px"
      }}
      onClick={() => handleViewProduct(null)}
    >
      Voltar ao início
    </Button>

    </Container>
  );
};

export default Product;
