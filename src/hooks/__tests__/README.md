# Pruebas Unitarias - Hooks

Este directorio contiene las pruebas unitarias para los hooks personalizados de la aplicación.

## Ejecutar las pruebas

```bash
# Ejecutar todas las pruebas una vez
npm test

# Ejecutar en modo watch (recomendado para desarrollo)
npm run test:watch

# Ejecutar con reporte de cobertura
npm run test:coverage
```

## Estructura de las pruebas

### useClientes.test.ts
- Creación de clientes con ID único
- Validación de documentos duplicados
- Actualización de información
- Eliminación de clientes
- Búsqueda por nombre, documento, teléfono o email
- Cálculo de score del cliente

### useVehiculos.test.ts
- Carga de vehículos desde localStorage
- Guardado de vehículos en localStorage
- Carga de datos mock cuando no hay datos guardados

### useReservas.test.ts
- Creación de reservas con información de pago
- Actualización de reservas
- Cancelación de reservas
- Finalización de reservas
- Verificación de disponibilidad de vehículos
- Manejo de conflictos de fechas

### useTarifas.test.ts
- Creación de reglas de tarifa
- Actualización y eliminación de tarifas
- Cálculo de precio con descuento por alquiler largo
- Cálculo de precio con recargo de fin de semana
- Cálculo de precio con recargo de temporada alta
- Aplicación de tarifas a vehículos específicos
- Ignorar tarifas inactivas

### useNotificaciones.test.ts
- Envío de notificaciones genéricas
- Envío de confirmación de reserva
- Envío de cancelación
- Envío de recibo
- Almacenamiento en localStorage
- Mostrar toast en envío exitoso

### useDashboard.test.ts
- Cálculo de ingresos del mes actual
- Cálculo de estado de flota
- Cálculo de tasa de ocupación
- Exclusión de reservas canceladas
- Identificación de vehículos más rentados
- Obtención de últimas reservas
- Generación de datos de ingresos semanales

### useTenants.test.ts
- Creación de IDs únicos de tenant
- Cambio de estado entre activo y suspendido
- Validación de límite de flota por plan

### useReportes.test.ts
- Filtrado de transacciones por rango de fechas
- Filtrado de transacciones por método de pago
- Construcción de resumen de reporte

## Cobertura de código

Para ver un reporte detallado de cobertura:

```bash
npm run test:coverage
```

Esto generará un reporte en la carpeta `coverage/` que puedes abrir en tu navegador.

## Convenciones

- Cada hook tiene su propio archivo de test
- Los tests usan `@testing-library/react` para renderizar hooks
- Se limpia `localStorage` antes de cada test con `beforeEach`
- Los mocks se configuran con `jest.mock()`
- Se usa `waitFor` para esperar operaciones asíncronas
- Se usa `act` para envolver actualizaciones de estado
