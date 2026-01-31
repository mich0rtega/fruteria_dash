import { useEffect, useState } from 'react';
import { Table, Tag, Tabs, Alert, Progress, Card, Row, Col, Statistic } from 'antd';
import {
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { productosAPI } from '../services/api';
import type { Producto } from '../types';
import { calcularEstadoCaducidad, getDiasRestantes, formatearFecha, formatearMoneda } from '../utils/helpers';

const Caducidad: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProductos();
  }, []);

  const loadProductos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productosAPI.getAll();
      setProductos(response.data);
    } catch (err) {
      setError('Error al cargar los productos');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const productosVigentes = productos.filter(
    (p) => calcularEstadoCaducidad(p.fechaCaducidad) === 'vigente'
  );

  const productosPorCaducar = productos.filter(
    (p) => calcularEstadoCaducidad(p.fechaCaducidad) === 'porCaducar'
  );

  const productosCaducados = productos.filter(
    (p) => calcularEstadoCaducidad(p.fechaCaducidad) === 'caducado'
  );

  const getProgressColor = (dias: number) => {
    if (dias < 0) return '#cf1322';
    if (dias <= 3) return '#faad14';
    if (dias <= 7) return '#fadb14';
    return '#52c41a';
  };

  const columns: ColumnsType<Producto> = [
    {
      title: 'Producto',
      dataIndex: 'nombre',
      key: 'nombre',
      sorter: (a, b) => a.nombre.localeCompare(b.nombre),
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock, record) => `${stock} ${record.unidad}`,
      sorter: (a, b) => a.stock - b.stock,
    },
    {
      title: 'Precio',
      dataIndex: 'precio',
      key: 'precio',
      render: (precio) => formatearMoneda(precio),
    },
    {
      title: 'Fecha Caducidad',
      dataIndex: 'fechaCaducidad',
      key: 'fechaCaducidad',
      render: (fecha) => formatearFecha(fecha),
      sorter: (a, b) => new Date(a.fechaCaducidad).getTime() - new Date(b.fechaCaducidad).getTime(),
    },
    {
      title: 'Días Restantes',
      key: 'diasRestantes',
      render: (_, record) => {
        const dias = getDiasRestantes(record.fechaCaducidad);
        const estado = calcularEstadoCaducidad(record.fechaCaducidad);
        
        let tagColor = 'success';
        let icon = <CheckCircleOutlined />;
        let text = `${dias} días`;

        if (estado === 'caducado') {
          tagColor = 'error';
          icon = <CloseCircleOutlined />;
          text = `Caducado hace ${Math.abs(dias)} días`;
        } else if (estado === 'porCaducar') {
          tagColor = 'warning';
          icon = <WarningOutlined />;
          text = `${dias} ${dias === 1 ? 'día' : 'días'}`;
        }

        return (
          <Tag icon={icon} color={tagColor}>
            {text}
          </Tag>
        );
      },
      sorter: (a, b) => getDiasRestantes(a.fechaCaducidad) - getDiasRestantes(b.fechaCaducidad),
    },
    {
      title: 'Estado Visual',
      key: 'estadoVisual',
      render: (_, record) => {
        const dias = getDiasRestantes(record.fechaCaducidad);
        const maxDias = 30; // días máximos para la barra
        const percent = dias < 0 ? 0 : Math.min((dias / maxDias) * 100, 100);
        
        return (
          <Progress
            percent={parseFloat(percent.toFixed(0))}
            strokeColor={getProgressColor(dias)}
            size="small"
            format={() => `${dias < 0 ? 0 : dias}d`}
          />
        );
      },
    },
  ];

  const tabItems = [
    {
      key: 'vigentes',
      label: (
        <span>
          <CheckCircleOutlined /> Vigentes ({productosVigentes.length})
        </span>
      ),
      children: (
        <>
          <Alert
            message="Productos Vigentes"
            description="Estos productos tienen más de 7 días hasta su fecha de caducidad."
            type="success"
            showIcon
            icon={<CheckCircleOutlined />}
            style={{ marginBottom: 16 }}
          />
          <Table
            columns={columns}
            dataSource={productosVigentes}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showTotal: (total) => `Total: ${total} productos vigentes`,
            }}
            locale={{ emptyText: 'No hay productos vigentes' }}
            aria-label="Tabla de productos vigentes"
          />
        </>
      ),
    },
    {
      key: 'porCaducar',
      label: (
        <span>
          <WarningOutlined /> Por Caducar ({productosPorCaducar.length})
        </span>
      ),
      children: (
        <>
          <Alert
            message="Productos Por Caducar"
            description="¡Atención! Estos productos caducarán en los próximos 7 días. Considere aplicar descuentos o promociones."
            type="warning"
            showIcon
            icon={<WarningOutlined />}
            style={{ marginBottom: 16 }}
          />
          <Table
            columns={columns}
            dataSource={productosPorCaducar}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showTotal: (total) => `Total: ${total} productos por caducar`,
            }}
            locale={{ emptyText: 'No hay productos por caducar' }}
            aria-label="Tabla de productos por caducar"
          />
        </>
      ),
    },
    {
      key: 'caducados',
      label: (
        <span>
          <CloseCircleOutlined /> Caducados ({productosCaducados.length})
        </span>
      ),
      children: (
        <>
          <Alert
            message="Productos Caducados"
            description="¡Alerta! Estos productos ya han caducado. Deben ser retirados del inventario inmediatamente."
            type="error"
            showIcon
            icon={<CloseCircleOutlined />}
            style={{ marginBottom: 16 }}
          />
          <Table
            columns={columns}
            dataSource={productosCaducados}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showTotal: (total) => `Total: ${total} productos caducados`,
            }}
            locale={{ emptyText: 'No hay productos caducados' }}
            aria-label="Tabla de productos caducados"
          />
        </>
      ),
    },
  ];

  return (
    <div>
      <div style={{ 
        marginBottom: 32,
        background: 'linear-gradient(135deg, #FFF4E6 0%, #FFFFFF 100%)',
        padding: '24px 32px',
        borderRadius: '12px',
        border: '2px solid #FF8A00',
      }}>
        <h2 style={{ 
          margin: 0,
          color: '#1A5319',
          fontSize: '28px',
          fontWeight: 700,
        }}>
           Control de Caducidad
        </h2>
        <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: '14px' }}>
          Monitorea los productos según su fecha de vencimiento
        </p>
      </div>

      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          closable
          onClose={() => setError(null)}
          style={{ marginBottom: 16 }}
        />
      )}

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card style={{
            background: 'linear-gradient(135deg, #D8F3DC 0%, #FFFFFF 100%)',
            border: '2px solid #00B207',
            borderRadius: '12px',
          }}>
            <Statistic
              title="Productos Vigentes"
              value={productosVigentes.length}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#00B207', fontWeight: 700, fontSize: '32px' }}
              suffix={`/ ${productos.length}`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{
            background: 'linear-gradient(135deg, #FFF4E6 0%, #FFFFFF 100%)',
            border: '2px solid #FF8A00',
            borderRadius: '12px',
          }}>
            <Statistic
              title="Por Caducar (≤7 días)"
              value={productosPorCaducar.length}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#FF8A00', fontWeight: 700, fontSize: '32px' }}
              suffix={`/ ${productos.length}`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{
            background: 'linear-gradient(135deg, #FFF1F0 0%, #FFFFFF 100%)',
            border: '2px solid #EA4B48',
            borderRadius: '12px',
          }}>
            <Statistic
              title="Caducados"
              value={productosCaducados.length}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#EA4B48', fontWeight: 700, fontSize: '32px' }}
              suffix={`/ ${productos.length}`}
            />
          </Card>
        </Col>
      </Row>

      <Tabs 
        defaultActiveKey="vigentes" 
        items={tabItems}
        aria-label="Pestañas de control de caducidad"
      />
    </div>
  );
};

export default Caducidad;
