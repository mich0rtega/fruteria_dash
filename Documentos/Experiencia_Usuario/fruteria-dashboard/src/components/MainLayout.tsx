import { useState, ReactNode } from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  LoginOutlined,
  LogoutOutlined,
  AlertOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined aria-hidden="true" />,
      label: 'Dashboard',
    },
    {
      key: '/productos',
      icon: <AppstoreOutlined aria-hidden="true" />,
      label: 'Productos',
    },
    {
      key: '/entradas',
      icon: <LoginOutlined aria-hidden="true" />,
      label: 'Entradas',
    },
    {
      key: '/salidas',
      icon: <LogoutOutlined aria-hidden="true" />,
      label: 'Salidas',
    },
    {
      key: '/caducidad',
      icon: <AlertOutlined aria-hidden="true" />,
      label: 'Caducidad',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        aria-label="Menú de navegación principal"
        style={{
          background: 'linear-gradient(180deg, #1A5319 0%, #0D3B0D 100%)',
        }}
      >
        <div
          style={{
            height: 64,
            margin: '16px 12px',
            background: 'linear-gradient(135deg, #00B207 0%, #508D4E 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            color: 'white',
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(0, 178, 7, 0.3)',
          }}
        >
          <ShoppingCartOutlined style={{ fontSize: collapsed ? '24px' : '28px', marginBottom: collapsed ? 0 : '4px' }} />
          {!collapsed && <span style={{ fontSize: '16px', letterSpacing: '1px' }}>FRUTERÍA</span>}
        </div>
        <Menu
          theme="dark"
          selectedKeys={[location.pathname]}
          mode="inline"
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          aria-label="Menú de navegación"
          style={{
            background: 'transparent',
            borderRight: 'none',
            fontSize: '15px',
          }}
        />
      </Sider>
      <Layout>
        <Header 
          style={{ 
            padding: '0 32px', 
            background: 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%)',
            display: 'flex',
            alignItems: 'center',
            borderBottom: '3px solid #00B207',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
          }}
        >
          <h1 style={{ 
            margin: 0, 
            fontSize: '22px', 
            fontWeight: 700,
            background: 'linear-gradient(135deg, #1A5319 0%, #00B207 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            🍎  Frutería
          </h1>
        </Header>
        <Content 
          style={{ 
            margin: '24px 16px', 
            padding: 24, 
            minHeight: 280,
            background: '#FFFFFF',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
          }}
          role="main"
          aria-label="Contenido principal"
        >
          {children}
        </Content>
        <Footer style={{ 
          textAlign: 'center',
          background: 'linear-gradient(135deg, #1A5319 0%, #0D3B0D 100%)',
          color: '#FFFFFF',
          fontWeight: 500,
          padding: '16px 50px',
        }}>
          Michelle Ortega ©{new Date().getFullYear()} - Experiencia de usuario
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
