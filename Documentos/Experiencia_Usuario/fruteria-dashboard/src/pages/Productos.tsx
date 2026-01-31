import { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  message,
  Popconfirm,
  Space,
  Tag,
  Alert,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { productosAPI } from '../services/api';
import type { Producto } from '../types';
import { calcularEstadoCaducidad, formatearFecha, formatearMoneda } from '../utils/helpers';

const { Option } = Select;

const Productos: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProducto, setEditingProducto] = useState<Producto | null>(null);
  const [form] = Form.useForm();
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
      message.error('Error al cargar los productos');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (producto?: Producto) => {
    if (producto) {
      setEditingProducto(producto);
      form.setFieldsValue({
        ...producto,
        fechaCaducidad: dayjs(producto.fechaCaducidad),
      });
    } else {
      setEditingProducto(null);
      form.resetFields();
    }
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingProducto(null);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const productoData = {
        ...values,
        fechaCaducidad: values.fechaCaducidad.format('YYYY-MM-DD'),
      };

      if (editingProducto) {
        await productosAPI.update(editingProducto.id, productoData);
        message.success('Producto actualizado exitosamente');
      } else {
        await productosAPI.create(productoData);
        message.success('Producto creado exitosamente');
      }

      handleCloseModal();
      loadProductos();
    } catch (err) {
      message.error('Error al guardar el producto');
      console.error('Error:', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await productosAPI.delete(id);
      message.success('Producto eliminado exitosamente');
      loadProductos();
    } catch (err) {
      message.error('Error al eliminar el producto');
      console.error('Error:', err);
    }
  };

  const getTagColor = (estado: string) => {
    switch (estado) {
      case 'vigente':
        return 'success';
      case 'porCaducar':
        return 'warning';
      case 'caducado':
        return 'error';
      default:
        return 'default';
    }
  };

  const columns: ColumnsType<Producto> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
      sorter: (a, b) => a.nombre.localeCompare(b.nombre),
    },
    {
      title: 'Categoría',
      dataIndex: 'categoria',
      key: 'categoria',
      filters: [{ text: 'Frutas', value: 'Frutas' }],
      onFilter: (value, record) => record.categoria === value,
    },
    {
      title: 'Precio',
      dataIndex: 'precio',
      key: 'precio',
      render: (precio) => formatearMoneda(precio),
      sorter: (a, b) => a.precio - b.precio,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock) => `${stock}`,
      sorter: (a, b) => a.stock - b.stock,
    },
    {
      title: 'Unidad',
      dataIndex: 'unidad',
      key: 'unidad',
    },
    {
      title: 'Proveedor',
      dataIndex: 'proveedor',
      key: 'proveedor',
    },
    {
      title: 'Fecha Caducidad',
      dataIndex: 'fechaCaducidad',
      key: 'fechaCaducidad',
      render: (fecha) => formatearFecha(fecha),
      sorter: (a, b) => dayjs(a.fechaCaducidad).unix() - dayjs(b.fechaCaducidad).unix(),
    },
    {
      title: 'Estado',
      key: 'estado',
      render: (_, record) => {
        const estado = calcularEstadoCaducidad(record.fechaCaducidad);
        const labels: Record<string, string> = {
          vigente: 'Vigente',
          porCaducar: 'Por Caducar',
          caducado: 'Caducado',
        };
        return <Tag color={getTagColor(estado)}>{labels[estado]}</Tag>;
      },
    },
    {
      title: 'Acciones',
      key: 'acciones',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined aria-hidden="true" />}
            onClick={() => handleOpenModal(record)}
            aria-label={`Editar producto ${record.nombre}`}
          >
            Editar
          </Button>
          <Popconfirm
            title="¿Está seguro de eliminar este producto?"
            onConfirm={() => handleDelete(record.id)}
            okText="Sí"
            cancelText="No"
            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined aria-hidden="true" />}
              aria-label={`Eliminar producto ${record.nombre}`}
            >
              Eliminar
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ 
        marginBottom: 24, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div>
          <h2 style={{ margin: 0, color: '#1A5319', fontSize: '28px', fontWeight: 700 }}>
             Gestión de Productos
          </h2>
          <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: '14px' }}>
            Administra tu inventario de frutas y verduras
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined aria-hidden="true" />}
          onClick={() => handleOpenModal()}
          aria-label="Agregar nuevo producto"
          size="large"
          style={{
            height: '44px',
            fontWeight: 600,
            fontSize: '15px',
            borderRadius: '8px',
          }}
        >
          Nuevo Producto
        </Button>
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

      <Table
        columns={columns}
        dataSource={productos}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total: ${total} productos`,
        }}
        scroll={{ x: 1200 }}
        locale={{ emptyText: 'No hay productos registrados' }}
        aria-label="Tabla de productos"
      />

      <Modal
        title={editingProducto ? 'Editar Producto' : 'Nuevo Producto'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={handleCloseModal}
        width={600}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            categoria: 'Frutas',
            unidad: 'kg',
          }}
        >
          <Form.Item
            name="nombre"
            label="Nombre del Producto"
            rules={[
              { required: true, message: 'Por favor ingrese el nombre del producto' },
              { min: 3, message: 'El nombre debe tener al menos 3 caracteres' },
            ]}
          >
            <Input 
              placeholder="Ej: Manzana Roja" 
              aria-label="Nombre del producto"
              aria-required="true"
            />
          </Form.Item>

          <Form.Item
            name="categoria"
            label="Categoría"
            rules={[{ required: true, message: 'Por favor seleccione una categoría' }]}
          >
            <Select 
              placeholder="Seleccione una categoría"
              aria-label="Categoría del producto"
              aria-required="true"
            >
              <Option value="Frutas">Frutas</Option>
              <Option value="Verduras">Verduras</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="precio"
            label="Precio (MXN)"
            rules={[
              { required: true, message: 'Por favor ingrese el precio' },
              { type: 'number', min: 0.01, message: 'El precio debe ser mayor a 0' },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="0.00"
              min={0}
              precision={2}
              aria-label="Precio del producto"
              aria-required="true"
            />
          </Form.Item>

          <Form.Item
            name="stock"
            label="Stock Inicial"
            rules={[
              { required: true, message: 'Por favor ingrese el stock' },
              { type: 'number', min: 0, message: 'El stock no puede ser negativo' },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="0"
              min={0}
              aria-label="Stock del producto"
              aria-required="true"
            />
          </Form.Item>

          <Form.Item
            name="unidad"
            label="Unidad de Medida"
            rules={[{ required: true, message: 'Por favor seleccione una unidad' }]}
          >
            <Select 
              placeholder="Seleccione una unidad"
              aria-label="Unidad de medida"
              aria-required="true"
            >
              <Option value="kg">Kilogramos (kg)</Option>
              <Option value="pieza">Pieza</Option>
              <Option value="caja">Caja</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="proveedor"
            label="Proveedor"
            rules={[
              { required: true, message: 'Por favor ingrese el proveedor' },
              { min: 3, message: 'El nombre del proveedor debe tener al menos 3 caracteres' },
            ]}
          >
            <Input 
              placeholder="Ej: Frutas del Valle"
              aria-label="Proveedor"
              aria-required="true"
            />
          </Form.Item>

          <Form.Item
            name="fechaCaducidad"
            label="Fecha de Caducidad"
            rules={[{ required: true, message: 'Por favor seleccione la fecha de caducidad' }]}
          >
            <DatePicker
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
              placeholder="Seleccione una fecha"
              disabledDate={(current) => current && current < dayjs().startOf('day')}
              aria-label="Fecha de caducidad"
              aria-required="true"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Productos;
