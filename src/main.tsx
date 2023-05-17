import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.scss'

export const Container = <React.StrictMode><App /></React.StrictMode>

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  Container,
)
