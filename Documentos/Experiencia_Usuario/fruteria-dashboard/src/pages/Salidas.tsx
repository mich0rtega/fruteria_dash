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
  Alert,
  Tag,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { salidasAPI, productosAPI } from '../services/api';
import type { Salida, Producto } from '../types';
import { formatearFecha } from '../utils/helpers';

const { Option } = Select;

const Salidas: React.FC = () => {
  const [salidas, setSalidas] = useState<Salida[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [error, setError] = useState<string | null>(null);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [salidasRes, productosRes] = await Promise.all([
        salidasAPI.getAll(),
        productosAPI.getAll(),
      ]);
      setSalidas(salidasRes.data);
      setProductos(productosRes.data);
    } catch (err) {
      setError('Error al cargar los datos');
      message.error('Error al cargar los datos');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    form.resetFields();
    form.setFieldsValue({
      fecha: dayjs(),
      motivo: 'Venta',
    });
    setSelectedProducto(null);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    form.resetFields();
    setSelectedProducto(null);
  };

  const handleProductoChange = (productoId: number) => {
    const producto = productos.find((p) => p.id === productoId);
    setSelectedProducto(producto || null);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const producto = productos.find((p) => p.id === values.productoId);
      if (!producto) {
        message.error('Producto no encontrado');
        return;
      }

      // Validar que no se genere stock negativo
      if (producto.stock < values.cantidad) {
        message.error(
          `Stock insuficiente. Stock disponible: ${producto.stock} ${producto.unidad}. Cantidad solicitada: ${values.cantidad} ${producto.unidad}`
        );
        return;
      }

      const salidaData = {
        productoId: values.productoId,
        nombreProducto: producto.nombre,
        cantidad: values.cantidad,
        fecha: values.fecha.format('YYYY-MM-DD'),
        motivo: values.motivo,
        cliente: values.cliente,
      };

      // Crear la salida
      await salidasAPI.create(salidaData);

      // Actualizar el stock del producto
      const nuevoStock = producto.stock - values.cantidad;
      await productosAPI.update(producto.id, { stock: nuevoStock });

      message.success('Salida registrada y stock actualizado exitosamente');
      handleCloseModal();
      loadData();
    } catch (err) {
      message.error('Error al registrar la salida');
      console.error('Error:', err);
    }
  };

  const handleDelete = async (salida: Salida) => {
    try {
      const producto = productos.find((p) => p.id === salida.productoId);
      if (!producto) {
        message.error('Producto no encontrado');
        return;
      }

      // Eliminar la salida
      await salidasAPI.delete(salida.id);

      // Revertir el stock
      const nuevoStock = producto.stock + salida.cantidad;
      await productosAPI.update(producto.id, { stock: nuevoStock });

      message.success('Salida eliminada y stock actualizado');
      loadData();
    } catch (err) {
      message.error('Error al eliminar la salida');
      console.error('Error:', err);
    }
  };

  const columns: ColumnsType<Salida> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Producto',
      dataIndex: 'nombreProducto',
      key: 'nombreProducto',
      sorter: (a, b) => a.nombreProducto.localeCompare(b.nombreProducto),
    },
    {
      title: 'Cantidad',
      dataIndex: 'cantidad',
      key: 'cantidad',
      render: (cantidad) => `${cantidad} unidades`,
      sorter: (a, b) => a.cantidad - b.cantidad,
    },
    {
      title: 'Fecha',
      dataIndex: 'fecha',
      key: 'fecha',
      render: (fecha) => formatearFecha(fecha),
      sorter: (a, b) => dayjs(a.fecha).unix() - dayjs(b.fecha).unix(),
    },
    {
      title: 'Motivo',
      dataIndex: 'motivo',
      key: 'motivo',
      render: (motivo) => {
        const colors: Record<string, string> = {
          Venta: 'green',
          Merma: 'red',
          'Uso Interno': 'blue',
          Donación: 'orange',
        };
        return <Tag color={colors[motivo] || 'default'}>{motivo}</Tag>;
      },
    },
    {
      title: 'Cliente/Destino',
      dataIndex: 'cliente',
      key: 'cliente',
    },
    {
      title: 'Acciones',
      key: 'acciones',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Popconfirm
          title="¿Está seguro de eliminar esta salida?"
          description="Esto revertirá el stock del producto"
          onConfirm={() => handleDelete(record)}
          okText="Sí"
          cancelText="No"
          icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
        >
          <Button
            type="link"
            danger
            icon={<DeleteOutlined aria-hidden="true" />}
            aria-label={`Eliminar salida de ${record.nombreProducto}`}
          >
            Eliminar
          </Button>
        </Popconfirm>
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
             Registro de Salidas
          </h2>
          <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: '14px' }}>
            Registra salidas de productos del inventario
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined aria-hidden="true" />}
          onClick={handleOpenModal}
          aria-label="Registrar nueva salida"
          size="large"
          style={{
            height: '44px',
            fontWeight: 600,
            fontSize: '15px',
            borderRadius: '8px',
          }}
        >
          Nueva Salida
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
        dataSource={salidas}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total: ${total} salidas`,
        }}
        scroll={{ x: 1000 }}
        locale={{ emptyText: 'No hay salidas registradas' }}
        aria-label="Tabla de salidas"
      />

      <Modal
        title="Nueva Salida"
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={handleCloseModal}
        width={600}
        okText="Registrar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="productoId"
            label="Producto"
            rules={[{ required: true, message: 'Por favor seleccione un producto' }]}
          >
            <Select
              placeholder="Seleccione un producto"
              showSearch
              optionFilterProp="children"
              onChange={handleProductoChange}
              filterOption={(input, option) =>
                (option?.label?.toString() ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={productos.map((p) => ({
                value: p.id,
                label: `${p.nombre} (Stock: ${p.stock} ${p.unidad})`,
              }))}
              aria-label="Seleccionar producto"
              aria-required="true"
            />
          </Form.Item>

          {selectedProducto && (
            <Alert
              message={`Stock disponible: ${selectedProducto.stock} ${selectedProducto.unidad}`}
              type="info"
              showIcon
              icon={<WarningOutlined />}
              style={{ marginBottom: 16 }}
            />
          )}

          <Form.Item
            name="cantidad"
            label="Cantidad"
            rules={[
              { required: true, message: 'Por favor ingrese la cantidad' },
              { type: 'number', min: 1, message: 'La cantidad debe ser mayor a 0' },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="0"
              min={1}
              max={selectedProducto?.stock}
              aria-label="Cantidad de salida"
              aria-required="true"
            />
          </Form.Item>

          <Form.Item
            name="fecha"
            label="Fecha de Salida"
            rules={[{ required: true, message: 'Por favor seleccione la fecha' }]}
          >
            <DatePicker
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
              placeholder="Seleccione una fecha"
              aria-label="Fecha de salida"
              aria-required="true"
            />
          </Form.Item>

          <Form.Item
            name="motivo"
            label="Motivo de Salida"
            rules={[{ required: true, message: 'Por favor seleccione el motivo' }]}
          >
            <Select
              placeholder="Seleccione un motivo"
              aria-label="Motivo de salida"
              aria-required="true"
            >
              <Option value="Venta">Venta</Option>
              <Option value="Merma">Merma</Option>
              <Option value="Uso Interno">Uso Interno</Option>
              <Option value="Donación">Donación</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="cliente"
            label="Cliente/Destino"
            rules={[
              { required: true, message: 'Por favor ingrese el cliente o destino' },
              { min: 3, message: 'El nombre debe tener al menos 3 caracteres' },
            ]}
          >
            <Input 
              placeholder="Ej: Supermercado Central"
              aria-label="Cliente o destino"
              aria-required="true"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Salidas;
