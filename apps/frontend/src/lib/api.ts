import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL: API_URL,
})

export const fetchHealth = async () => {
  const { data } = await api.get('/health')
  return data
}

// Receitas
export const getReceitas = async (token: string) => {
  const { data } = await api.get('/receitas', {
    headers: { Authorization: `Bearer ${token}` },
  })
  return data
}

export const createReceita = async (token: string, receita: any) => {
  const { data } = await api.post('/receitas', receita, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return data
}

// Pedidos
export const getPedidos = async (token: string) => {
  const { data } = await api.get('/pedidos', {
    headers: { Authorization: `Bearer ${token}` },
  })
  return data
}

export const createPedido = async (token: string, pedido: any) => {
  const { data } = await api.post('/pedidos', pedido, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return data
}
