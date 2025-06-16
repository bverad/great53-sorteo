# Sorteo "Great 53" - Aplicación de Gestión

Una aplicación web moderna para gestionar el sorteo benéfico "Great 53" a beneficio de la Fundación COAR.

## 🎯 Características Principales

### Interfaz Pública
- **Información del sorteo**: Descripción completa de la iniciativa benéfica
- **Detalles del premio**: Información detallada sobre la motocicleta y condiciones
- **Listado de números**: Visualización de 1000 números con estados (disponible/reservado)
- **Filtros avanzados**: Búsqueda y filtrado por disponibilidad
- **Información de pago**: Datos bancarios y código QR para transferencias
- **Diseño responsive**: Optimizado para todos los dispositivos

### Panel Administrativo
- **Autenticación básica**: Acceso seguro con credenciales
- **Dashboard completo**: Estadísticas en tiempo real
- **Gestión de números**: Control de reservas y estados de pago
- **Filtros administrativos**: Búsqueda por número, cliente o estado
- **Exportación de datos**: Descarga de información en formato CSV
- **Actualización de pagos**: Cambio manual de estados de pago

## 🚀 Tecnologías Utilizadas

- **Next.js 14**: Framework React con App Router
- **TypeScript**: Tipado estático para mayor robustez
- **Tailwind CSS**: Estilos utilitarios para diseño responsive
- **shadcn/ui**: Componentes UI modernos y accesibles
- **Lucide React**: Iconografía consistente
- **React Hooks**: Gestión de estado local

## 📁 Estructura del Proyecto

```
├── app/
│   ├── page.tsx                # Página principal pública
│   ├── layout.tsx              # Layout principal
│   ├── globals.css             # Estilos globales
│   └── admin/
│       └── page.tsx            # Panel administrativo
├── components/
│   ├── header.tsx              # Encabezado principal
│   ├── hero-section.tsx        # Sección hero
│   ├── prize-section.tsx       # Información del premio
│   ├── numbers-section.tsx     # Listado de números
│   ├── transfer-section.tsx    # Información de pago
│   ├── footer.tsx              # Pie de página
│   ├── reserve-number-modal.tsx# Modal de reserva de número
│   ├── theme-provider.tsx      # Proveedor de tema
│   ├── admin/
│   │   ├── admin-auth.tsx      # Autenticación administrativa
│   │   ├── admin-dashboard.tsx # Dashboard administrativo
│   │   └── lottery-draw.tsx    # Sorteo y utilidades admin
│   └── ui/                     # Componentes reutilizables UI (botones, formularios, etc)
├── hooks/
│   ├── use-sorteo-data.ts      # Hook para gestión de datos
│   ├── use-mobile.tsx          # Hook para detectar móvil
│   └── use-toast.ts            # Hook para notificaciones
├── lib/
│   └── utils.ts                # Utilidades generales
├── public/                     # Archivos estáticos y assets
├── styles/                     # Archivos de estilos adicionales
├── package.json                # Dependencias y scripts
├── next.config.mjs             # Configuración de Next.js
├── tailwind.config.ts          # Configuración de Tailwind CSS
├── tsconfig.json               # Configuración de TypeScript
└── README.md                   # Documentación
```

## 🏗️ Compilación y Buenas Prácticas para Producción

### Compilar el Proyecto

Para compilar la aplicación para producción, ejecuta:

```bash
npm run build
```

Esto generará la carpeta `.next` con los archivos optimizados. Para iniciar el servidor en modo producción:

```bash
npm start
```

### Recomendaciones para Producción
- Asegúrate de definir variables de entorno necesarias en `.env` si tu proyecto las requiere.
- Cambia las credenciales administrativas antes de desplegar.
- Usa `npm run lint` para verificar buenas prácticas y errores de código.
- Considera configurar un dominio y HTTPS en tu proveedor de hosting.
- Para despliegue en Vercel, puedes conectar el repositorio y Vercel detectará automáticamente Next.js.
- Si usas otro proveedor, asegúrate de que soporte Node.js 18+.

> **Nota:** El proyecto sigue buenas prácticas de React y frontend, y está optimizado para dispositivos móviles y escritorio.

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Instalación
\`\`\`bash
# Clonar el repositorio
git clone [URL_DEL_REPOSITORIO]

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
\`\`\`

### Configuración
1. **Datos bancarios**: Actualizar información en `components/transfer-section.tsx`
2. **Credenciales admin**: Modificar en `components/admin/admin-auth.tsx`
3. **Información del sorteo**: Personalizar en los componentes correspondientes

## 🔐 Acceso Administrativo

**Credenciales por defecto:**
- Usuario: `admin`
- Contraseña: `great53admin`

> ⚠️ **Importante**: Cambiar estas credenciales en producción

## 📊 Funcionalidades del Admin

### Dashboard
- Estadísticas en tiempo real
- Números disponibles/reservados
- Ingresos totales
- Estados de pago

### Gestión de Números
- Visualización completa de todos los números
- Filtros por estado y pago
- Búsqueda por número o cliente
- Actualización manual de estados de pago

### Exportación
- Descarga de datos en formato CSV
- Información completa de reservas y pagos

## 🎨 Diseño y UX

### Principios de Diseño
- **Elegancia profesional**: Inspirado en LinkedIn
- **Accesibilidad**: Cumple estándares WCAG
- **Responsive**: Optimizado para móviles y desktop
- **Usabilidad**: Navegación intuitiva y clara

### Paleta de Colores
- Azul corporativo: `#2563eb`
- Verde éxito: `#16a34a`
- Rojo alerta: `#dc2626`
- Grises neutros: `#f8fafc` a `#1e293b`

## 🔧 Personalización

### Modificar Información del Sorteo
\`\`\`tsx
// En hero-section.tsx
const sorteoInfo = {
  title: "Sorteo Great 53",
  description: "Tu descripción personalizada",
  // ...
}
\`\`\`

### Actualizar Datos Bancarios
\`\`\`tsx
// En transfer-section.tsx
const bankInfo = {
  bank: "Tu banco",
  accountNumber: "Tu número de cuenta",
  // ...
}
\`\`\`

### Cambiar Credenciales Admin
\`\`\`tsx
// En admin-auth.tsx
if (username === 'tu_usuario' && password === 'tu_contraseña') {
  // ...
}
\`\`\`

## 📱 Código QR

La aplicación está preparada para generar códigos QR para:
- Acceso rápido a la aplicación
- Información bancaria
- Datos de contacto

## 🚀 Despliegue

### Vercel (Recomendado)
\`\`\`bash
npm run build
vercel --prod
\`\`\`

### Otros Proveedores
\`\`\`bash
npm run build
npm start
\`\`\`

## 🔒 Seguridad

### Consideraciones de Producción
- [ ] Cambiar credenciales administrativas
- [ ] Implementar autenticación robusta (JWT, OAuth)
- [ ] Configurar HTTPS
- [ ] Validar datos de entrada
- [ ] Implementar rate limiting

## 📈 Escalabilidad

### Mejoras Futuras
- **Base de datos**: Migrar a PostgreSQL/MongoDB
- **Autenticación**: Implementar NextAuth.js
- **Pagos**: Integrar pasarelas de pago
- **Notificaciones**: Sistema de emails/SMS
- **Analytics**: Seguimiento de conversiones

## 🤝 Contribución

1. Fork del proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o consultas:
- Email: soporte@great53.org
- WhatsApp: +57 300 123 4567

---

**Great 53** - Comprometidos con dar amor al universo 💙
