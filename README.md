# Redux Tweets Simulator 🐦

Aplicación de red social para compartir tweets con gestión de estado global usando Redux Toolkit, operaciones CRUD completas, sistema de likes y persistencia en localStorage.

## 📋 Descripción

Esta aplicación es un simulador de red social tipo Twitter con funcionalidades completas:

- **Crear tweets**: Formulario para publicar nuevos tweets con validación de autor
- **Sistema de likes**: Dale me gusta a los tweets con animación de corazón
- **Editar tweets**: Modifica el contenido de tus tweets publicados
- **Eliminar tweets**: Borra tweets con confirmación previa
- **Persistencia de datos**: Los tweets se guardan en localStorage automáticamente
- **Timestamps**: Fechas formateadas en español con Moment.js
- **UI moderna**: Diseño con gradientes, animaciones y efectos hover
- **Gestión de estado**: Redux Toolkit con múltiples reducers combinados

## 🛠️ Tecnologías

- React 19.2.4
- TypeScript 5.x
- Redux Toolkit 2.x
- React-Redux
- React-Bootstrap 5
- Moment.js
- UUID
- React Testing Library
- Jest

## 🚀 Cómo Ejecutar

### Prerequisitos

- Node.js (v14 o superior)
- npm o yarn

### Instalación

1. Navega al directorio del proyecto:

```bash
cd "redux-tweets-simulator"
```

2. Instala las dependencias:

```bash
npm install
```

### Ejecución en Desarrollo

```bash
npm start
```

La aplicación se abrirá en [http://localhost:3000](http://localhost:3000).

### Ejecutar Tests

```bash
npm test
```

### Build para Producción

```bash
npm run build
```

## 📚 Conceptos Demostrados

### 1. **Redux Store con Persistencia**

Configuración del store con preloadedState desde localStorage:

```ts
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';
import { getTweetsStateFromLocalStorage, saveTweetsStateToLocalStorage } from './utils/localStorage';

const preloadedState = getTweetsStateFromLocalStorage();

const store = configureStore({
  reducer: rootReducer,
  preloadedState,
});

store.subscribe(() => {
  saveTweetsStateToLocalStorage(store.getState().tweets);
});

export default store;
```

### 2. **CombineReducers con TypeScript**

Combinación de múltiples reducers con tipado fuerte:

```ts
import { combineReducers } from 'redux';
import tweetsReducer from './tweetsReducer';
import modalsReducer from './modalsReducer';
import validationsReducer from './validationsReducer';

const rootReducer = combineReducers({
  tweets: tweetsReducer,
  modals: modalsReducer,
  validations: validationsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
```

### 3. **Actions con Redux Toolkit**

Acciones tipadas para gestionar el estado de tweets:

```ts
export const addTweet = (tweet: Tweet) => ({
  type: ADD_TWEET,
  payload: tweet,
});

export const likeTweet = (id: string) => ({
  type: LIKE_TWEET,
  payload: id,
});

export const editTweet = (id: string, newText: string) => ({
  type: EDIT_TWEET,
  payload: { id, newText },
});
```

### 4. **Reducer con Operaciones CRUD**

Gestión del estado con switch statements y tipado:

```ts
export default function tweetsReducer(
  state: TweetState = initialState,
  action: TweetAction
): TweetState {
  switch (action.type) {
    case ADD_TWEET:
      return { ...state, list: [...state.list, action.payload] };
    case DELETE_TWEET:
      return { ...state, list: state.list.filter(t => t.id !== action.payload) };
    case LIKE_TWEET:
      return {
        ...state,
        list: state.list.map(t =>
          t.id === action.payload ? { ...t, likes: t.likes + 1 } : t
        ),
      };
    default:
      return state;
  }
}
```

### 5. **LocalStorage con Migración**

Persistencia con migración automática de datos antiguos:

```tsx
export function getTweetsStateFromLocalStorage() {
  const tweets = localStorage.getItem(STORAGE_TWEETS_KEY);
  if (tweets) {
    const parsedTweets = JSON.parse(tweets);
    const migratedTweets = parsedTweets.map((tweet: any) => ({
      ...tweet,
      likes: tweet.likes || 0,
    }));
    return { tweets: { list: migratedTweets } };
  }
  return { tweets: { list: [] } };
}
```

### 6. **Componentes Controlados con Validación**

Formulario con validación en tiempo real:

```tsx
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  if (!value.startsWith("@")) {
    setAuthor("@" + value.replace("@", ""));
  } else {
    setAuthor(value);
  }
};
```

### 7. **Modal de Confirmación Reutilizable**

Componente modal genérico para confirmaciones:

```tsx
interface ConfirmModalProps {
  show: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  show,
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Modal show={show} onHide={onCancel}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Confirmar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
```

### 8. **Formateo de Fechas con Moment.js**

Fechas en español con formato personalizado:

```tsx
import moment from "moment";
import "moment/locale/es";

moment.locale("es");

// Uso en componente
{moment(tweet.timestamp, "DD-MM-YYYY HH:mm:ss").format(
  "dddd D [de] MMMM [de] YYYY [a las] HH:mm[h]"
)}
```

### 9. **Botón Flotante Responsive**

Botón circular flotante con efectos modernos:

```css
.btn-floating-new-tweet {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.btn-floating-new-tweet:hover {
  transform: scale(1.1) rotate(15deg);
}
```

## 📁 Estructura del Proyecto

```text
redux-tweets-simulator/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── actions/
│   │   ├── modalsActions.ts
│   │   ├── tweetsActions.ts
│   │   └── validationsActions.ts
│   ├── assets/
│   │   └── png/
│   │       └── redux.png
│   ├── components/
│   │   ├── ConfirmModal.tsx
│   │   ├── EditTweetModal.tsx
│   │   ├── FormAddTweet.tsx
│   │   ├── Menu.tsx
│   │   ├── Modal.tsx
│   │   └── TweetsList.tsx
│   ├── reducers/
│   │   ├── index.ts
│   │   ├── modalsReducer.ts
│   │   ├── tweetsReducer.ts
│   │   └── validationsReducer.ts
│   ├── styles/
│   │   └── custom.css
│   ├── utils/
│   │   └── localStorage.ts
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── index.tsx
│   ├── store.ts
│   └── setupTests.js
└── package.json
```

## 🎯 Características Principales

### Gestión de Tweets

- ✅ Crear tweets con autor (prefijo @ obligatorio) y contenido
- ✅ Listar todos los tweets con scroll infinito
- ✅ Editar el contenido de tweets existentes
- ✅ Eliminar tweets con confirmación modal
- ✅ Generación de IDs únicos con UUID
- ✅ Timestamps automáticos al crear

### Sistema de Likes

- ✅ Contador de likes por tweet
- ✅ Animación de latido de corazón al dar like
- ✅ Efecto hover con escala y brillo
- ✅ Color distintivo para el botón de me gusta

### Interfaz de Usuario

- ✅ Diseño moderno con gradientes púrpura/rosa
- ✅ Botones solo con iconos (corazón, lápiz, papelera)
- ✅ Tooltips informativos en botones
- ✅ Botón flotante para crear tweets
- ✅ Navbar centrado con logo animado
- ✅ Cards con sombras y efectos hover
- ✅ Animaciones suaves con cubic-bezier
- ✅ Responsive para móviles y tablets

### Persistencia y Estado

- ✅ Almacenamiento automático en localStorage
- ✅ Carga del estado al iniciar la app
- ✅ Migración automática de datos antiguos
- ✅ Redux DevTools compatible
- ✅ Estado tipado con TypeScript

## 🧪 Testing

El proyecto incluye configuración para tests con Jest y React Testing Library:

```bash
npm test
```

> **Nota**: Actualmente hay un issue conocido con la importación de UUID en Jest (módulos ESM). Para los tests de integración, considera configurar jest.config.js con transformIgnorePatterns.

## 🎨 Personalización

### Cambiar Colores del Tema

Los colores se definen con variables CSS en `src/styles/custom.css`:

```css
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  --success-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}
```

### Modificar el Formato de Fechas

Cambia el formato en `TweetsList.tsx`:

```tsx
moment(tweet.timestamp, "DD-MM-YYYY HH:mm:ss").format("tu_formato_aquí");
```

### Ajustar el Tamaño del Botón Flotante

Edita los valores en `custom.css`:

```css
.btn-floating-new-tweet {
  width: 60px; /* Cambiar aquí */
  height: 60px; /* Cambiar aquí */
}
```

## 🤝 Contribuciones

Este es un proyecto educativo. Siéntete libre de hacer fork y experimentar con diferentes conceptos de Redux y React.

## 📝 Licencia

MIT

## 👨‍💻 Autor

**Xavier Palacín Ayuso**
Email: [cubiczx@hotmail.com](cubiczx@hotmail.com)
GitHub: [@cubiczx](https://github.com/cubiczx)

Proyecto creado como parte del curso de React en Udemy.

---

## 🌟 Conceptos de Redux Aprendidos

- Configuración del store con `configureStore`
- Uso de `combineReducers` para múltiples slices de estado
- Creación de action creators tipados
- Reducers puros sin mutaciones directas
- Suscripción al store para side effects (localStorage)
- Integración con React usando hooks (`useSelector`, `useDispatch`)
- Tipado completo con TypeScript (`RootState`, `AppDispatch`)
- Persistencia de estado entre sesiones
