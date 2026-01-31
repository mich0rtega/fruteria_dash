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
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { entradasAPI, productosAPI } from '../services/api';
import type { Entrada, Producto } from '../types';
import { formatearFecha, formatearMoneda } from '../utils/helpers';

const Entradas: React.FC = () => {
  const [entradas, setEntradas] = useState<Entrada[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [entradasRes, productosRes] = await Promise.all([
        entradasAPI.getAll(),
        productosAPI.getAll(),
      ]);
      setEntradas(entradasRes.data);
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
    });
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const producto = productos.find((p) => p.id === values.productoId);
      if (!producto) {
        message.error('Producto no encontrado');
        return;
      }

      const entradaData = {
        productoId: values.productoId,
        nombreProducto: producto.nombre,
        cantidad: values.cantidad,
        fecha: values.fecha.format('YYYY-MM-DD'),
        proveedor: values.proveedor,
        precioCompra: values.precioCompra,
      };

      // Crear la entrada
      await entradasAPI.create(entradaData);

      // Actualizar el stock del producto
      const nuevoStock = producto.stock + values.cantidad;
      await productosAPI.update(producto.id, { stock: nuevoStock });

      message.success('Entrada registrada y stock actualizado exitosamente');
      handleCloseModal();
      loadData();
    } catch (err) {
      message.error('Error al registrar la entrada');
      console.error('Error:', err);
    }
  };

  const handleDelete = async (entrada: Entrada) => {
    try {
      const producto = productos.find((p) => p.id === entrada.productoId);
      if (!producto) {
        message.error('Producto no encontrado');
        return;
      }

      // Verificar si hay suficiente stock para revertir
      if (producto.stock < entrada.cantidad) {
        message.error('No se puede eliminar: el stock actual es menor a la cantidad de entrada');
        return;
      }

      // Eliminar la entrada
      await entradasAPI.delete(entrada.id);

      // Revertir el stock
      const nuevoStock = producto.stock - entrada.cantidad;
      await productosAPI.update(producto.id, { stock: nuevoStock });

      message.success('Entrada eliminada y stock actualizado');
      loadData();
    } catch (err) {
      message.error('Error al eliminar la entrada');
      console.error('Error:', err);
    }
  };

  const columns: ColumnsType<Entrada> = [
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
      title: 'Proveedor',
      dataIndex: 'proveedor',
      key: 'proveedor',
    },
    {
      title: 'Precio Compra',
      dataIndex: 'precioCompra',
      key: 'precioCompra',
      render: (precio) => formatearMoneda(precio),
      sorter: (a, b) => a.precioCompra - b.precioCompra,
    },
    {
      title: 'Total',
      key: 'total',
      render: (_, record) => formatearMoneda(record.cantidad * record.precioCompra),
    },
    {
      title: 'Acciones',
      key: 'acciones',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Popconfirm
          title="¿Está seguro de eliminar esta entrada?"
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
            aria-label={`Eliminar entrada de ${record.nombreProducto}`}
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
             Registro de Entradas
          </h2>
          <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: '14px' }}>
            Registra nuevas entradas de productos al inventario
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined aria-hidden="true" />}
          onClick={handleOpenModal}
          aria-label="Registrar nueva entrada"
          size="large"
          style={{
            height: '44px',
            fontWeight: 600,
            fontSize: '15px',
            borderRadius: '8px',
          }}
        >
          Nueva Entrada
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
        dataSource={entradas}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total: ${total} entradas`,
        }}
        scroll={{ x: 1000 }}
        locale={{ emptyText: 'No hay entradas registradas' }}
        aria-label="Tabla de entradas"
      />

      <Modal
        title="Nueva Entrada"
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
              filterOption={(input, option) =>
                (option?.label?.toString() ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={productos.map((p) => ({
                value: p.id,
                label: `${p.nombre} (Stock actual: ${p.stock} ${p.unidad})`,
              }))}
              aria-label="Seleccionar producto"
              aria-required="true"
            />
          </Form.Item>

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
              aria-label="Cantidad de entrada"
              aria-required="true"
            />
          </Form.Item>

          <Form.Item
            name="fecha"
            label="Fecha de Entrada"
            rules={[{ required: true, message: 'Por favor seleccione la fecha' }]}
          >
            <DatePicker
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
              placeholder="Seleccione una fecha"
              aria-label="Fecha de entrada"
              aria-required="true"
            />
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
            name="precioCompra"
            label="Precio de Compra (MXN)"
            rules={[
              { required: true, message: 'Por favor ingrese el precio de compra' },
              { type: 'number', min: 0.01, message: 'El precio debe ser mayor a 0' },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="0.00"
              min={0}
              precision={2}
              aria-label="Precio de compra"
              aria-required="true"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Entradas;
