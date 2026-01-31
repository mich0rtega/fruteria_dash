import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import esES from 'antd/locale/es_ES';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import App from './App.tsx';
import './index.css';

// Configurar dayjs en español
dayjs.locale('es');

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('No se encontró el elemento root');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ConfigProvider
      locale={esES}
      theme={{
        token: {
          colorPrimary: '#00B207',
          colorSuccess: '#00B207',
          colorWarning: '#FF8A00',
          colorError: '#EA4B48',
          colorInfo: '#2C742F',
          borderRadius: 8,
          fontSize: 14,
          colorBgContainer: '#FFFFFF',
          colorBorder: '#E6E6E6',
          colorText: '#1A1A1A',
          colorTextSecondary: '#666666',
        },
        components: {
          Layout: {
            siderBg: '#1A5319',
            headerBg: '#FFFFFF',
            bodyBg: '#F5F5F5',
          },
          Menu: {
            darkItemBg: '#1A5319',
            darkItemSelectedBg: '#508D4E',
            darkItemHoverBg: '#508D4E',
          },
          Button: {
            primaryShadow: '0 2px 8px rgba(0, 178, 7, 0.15)',
          },
          Card: {
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          },
        },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>
);
