import { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Spin, Alert } from 'antd';
import {
  ShoppingCartOutlined,
  WarningOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { productosAPI, entradasAPI, salidasAPI } from '../services/api';
import type { Entrada, Salida } from '../types';
import { calcularEstadoCaducidad, formatearFecha } from '../utils/helpers';

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stockTotal, setStockTotal] = useState(0);
  const [productosPorCaducar, setProductosPorCaducar] = useState(0);
  const [entradasRecientes, setEntradasRecientes] = useState<Entrada[]>([]);
  const [salidasRecientes, setSalidasRecientes] = useState<Salida[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [productosRes, entradasRes, salidasRes] = await Promise.all([
        productosAPI.getAll(),
        entradasAPI.getAll(),
        salidasAPI.getAll(),
      ]);

      const productos = productosRes.data;
      const entradas = entradasRes.data;
      const salidas = salidasRes.data;

      // Calcular stock total
      const total = productos.reduce((acc, p) => acc + p.stock, 0);
      setStockTotal(total);

      // Calcular productos por caducar (próximos 7 días)
      const porCaducar = productos.filter(
        (p) => calcularEstadoCaducidad(p.fechaCaducidad) === 'porCaducar'
      ).length;
      setProductosPorCaducar(porCaducar);

      // Obtener últimas 5 entradas
      setEntradasRecientes(entradas.slice(-5).reverse());

      // Obtener últimas 5 salidas
      setSalidasRecientes(salidas.slice(-5).reverse());
    } catch (err) {
      setError('Error al cargar los datos del dashboard');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const columnasEntradas: ColumnsType<Entrada> = [
    {
      title: 'Producto',
      dataIndex: 'nombreProducto',
      key: 'nombreProducto',
    },
    {
      title: 'Cantidad',
      dataIndex: 'cantidad',
      key: 'cantidad',
      render: (cantidad) => `${cantidad} unidades`,
    },
    {
      title: 'Fecha',
      dataIndex: 'fecha',
      key: 'fecha',
      render: (fecha) => formatearFecha(fecha),
    },
    {
      title: 'Proveedor',
      dataIndex: 'proveedor',
      key: 'proveedor',
    },
  ];

  const columnasSalidas: ColumnsType<Salida> = [
    {
      title: 'Producto',
      dataIndex: 'nombreProducto',
      key: 'nombreProducto',
    },
    {
      title: 'Cantidad',
      dataIndex: 'cantidad',
      key: 'cantidad',
      render: (cantidad) => `${cantidad} unidades`,
    },
    {
      title: 'Fecha',
      dataIndex: 'fecha',
      key: 'fecha',
      render: (fecha) => formatearFecha(fecha),
    },
    {
      title: 'Cliente',
      dataIndex: 'cliente',
      key: 'cliente',
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" tip="Cargando datos del dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        closable
        onClose={() => setError(null)}
      />
    );
  }

  return (
    <div>
      <div style={{ 
        marginBottom: 32,
        background: 'linear-gradient(135deg, #D8F3DC 0%, #FFFFFF 100%)',
        padding: '24px 32px',
        borderRadius: '12px',
        border: '2px solid #00B207',
      }}>
        <h2 style={{ 
          margin: 0,
          color: '#1A5319',
          fontSize: '28px',
          fontWeight: 700,
        }}>
          INFORMACION GENERAL
        </h2>
        <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: '14px' }}>
          Resumen de inventario y movimientos recientes
        </p>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{
            background: 'linear-gradient(135deg, #D8F3DC 0%, #FFFFFF 100%)',
            border: '2px solid #00B207',
            borderRadius: '12px',
          }}>
            <Statistic
              title="Stock Total"
              value={stockTotal}
              prefix={<ShoppingCartOutlined aria-hidden="true" />}
              suffix="unidades"
              valueStyle={{ color: '#00B207', fontWeight: 700, fontSize: '32px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{
            background: 'linear-gradient(135deg, #FFF4E6 0%, #FFFFFF 100%)',
            border: '2px solid #FF8A00',
            borderRadius: '12px',
          }}>
            <Statistic
              title="Productos por Caducar"
              value={productosPorCaducar}
              prefix={<WarningOutlined aria-hidden="true" />}
              valueStyle={{ color: '#FF8A00', fontWeight: 700, fontSize: '32px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{
            background: 'linear-gradient(135deg, #E3F2FD 0%, #FFFFFF 100%)',
            border: '2px solid #1976D2',
            borderRadius: '12px',
          }}>
            <Statistic
              title="Entradas Recientes"
              value={entradasRecientes.length}
              prefix={<ArrowUpOutlined aria-hidden="true" />}
              valueStyle={{ color: '#1976D2', fontWeight: 700, fontSize: '32px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{
            background: 'linear-gradient(135deg, #FFF9E6 0%, #FFFFFF 100%)',
            border: '2px solid #FFB800',
            borderRadius: '12px',
          }}>
            <Statistic
              title="Salidas Recientes"
              value={salidasRecientes.length}
              prefix={<ArrowDownOutlined aria-hidden="true" />}
              valueStyle={{ color: '#FFB800', fontWeight: 700, fontSize: '32px' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card 
            title={<span style={{ fontSize: '18px', fontWeight: 700 }}> Últimas Entradas</span>}
            style={{ height: '100%' }}
          >
            <Table
              dataSource={entradasRecientes}
              columns={columnasEntradas}
              rowKey="id"
              pagination={false}
              size="small"
              locale={{ emptyText: 'No hay entradas recientes' }}
              aria-label="Tabla de últimas entradas"
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card 
            title={<span style={{ fontSize: '18px', fontWeight: 700 }}> Últimas Salidas</span>}
            style={{ height: '100%' }}
          >
            <Table
              dataSource={salidasRecientes}
              columns={columnasSalidas}
              rowKey="id"
              pagination={false}
              size="small"
              locale={{ emptyText: 'No hay salidas recientes' }}
              aria-label="Tabla de últimas salidas"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
