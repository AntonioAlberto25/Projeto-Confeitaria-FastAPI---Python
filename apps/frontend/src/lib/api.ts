import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL: API_URL,
})

// Helper para criar headers de autenticação
const authHeaders = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` },
})

// ─── Health ──────────────────────────────────────────────────────────────────
export const fetchHealth = async () => {
  const { data } = await api.get('/health')
  return data
}

// ─── Receitas ─────────────────────────────────────────────────────────────────
export const getReceitas = async (token: string) => {
  const { data } = await api.get('/receitas', authHeaders(token))
  return data
}

export const getReceita = async (token: string, id: number) => {
  const { data } = await api.get(`/receitas/${id}`, authHeaders(token))
  return data
}

export const createReceita = async (token: string, receita: any) => {
  const { data } = await api.post('/receitas', receita, authHeaders(token))
  return data
}

export const deleteReceita = async (token: string, id: number) => {
  await api.delete(`/receitas/${id}`, authHeaders(token))
}

// ─── Pedidos ──────────────────────────────────────────────────────────────────
export const getPedidos = async (token: string) => {
  const { data } = await api.get('/pedidos', authHeaders(token))
  return data
}

export const getPedido = async (token: string, id: number) => {
  const { data } = await api.get(`/pedidos/${id}`, authHeaders(token))
  return data
}

export const createPedido = async (token: string, pedido: any) => {
  const { data } = await api.post('/pedidos', pedido, authHeaders(token))
  return data
}

export const deletePedido = async (token: string, id: number) => {
  await api.delete(`/pedidos/${id}`, authHeaders(token))
}

// ─── Perfil ───────────────────────────────────────────────────────────────────
export const getMeuPerfil = async (token: string) => {
  const { data } = await api.get('/perfil/me', authHeaders(token))
  return data
}

export const sincronizarPerfil = async (token: string, payload: any) => {
  const { data } = await api.post('/perfil/sincronizar', payload, authHeaders(token))
  return data
}

// ─── Estoque (futuro endpoint) ────────────────────────────────────────────────
export const getEstoque = async (token: string) => {
  const { data } = await api.get('/estoque', authHeaders(token))
  return data
}

export const createIngrediente = async (token: string, ingrediente: any) => {
  const { data } = await api.post('/estoque', ingrediente, authHeaders(token))
  return data
}

export const getIngrediente = async (token: string, id: number) => {
  const { data } = await api.get(`/estoque/${id}`, authHeaders(token))
  return data
}

export const updateIngrediente = async (token: string, id: number, data: any) => {
  const { data: result } = await api.put(`/estoque/${id}`, data, authHeaders(token))
  return result
}

export const deleteIngrediente = async (token: string, id: number) => {
  await api.delete(`/estoque/${id}`, authHeaders(token))
}
