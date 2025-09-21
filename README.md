# Frontend Real-State

Este proyecto es una prueba técnica desarrollada para **Million**, que consiste en la creación de una aplicación frontend utilizando **Next.js** para una plataforma inmobiliaria.

## 🚀 Descripción

Frontend Real-State es una aplicación web moderna construida con [Next.js](https://nextjs.org), un framework de React que permite desarrollar aplicaciones rápidas y eficientes. El proyecto está diseñado para servir como la interfaz de usuario de una plataforma de bienes raíces, implementando las mejores prácticas de desarrollo y utilizando tecnologías de vanguardia para garantizar un rendimiento óptimo y una experiencia de usuario fluida.

El proyecto fue inicializado con `create-next-app` y está configurado para utilizar `next/font` con el fin de optimizar la carga de la tipografía [Geist](https://vercel.com/font), la nueva familia de fuentes de Vercel.

## 📂 Estructura del Repositorio

El repositorio está organizado de la siguiente manera:

-   **/app**: Contiene las páginas y rutas principales de la aplicación.
-   **/components**: Almacena componentes de interfaz de usuario reutilizables.
-   **/lib**: Incluye módulos y funciones de utilidad.
-   **/public**: Contiene archivos estáticos como imágenes y otros recursos.
-   **.gitignore**: Especifica los archivos y directorios a ser ignorados por Git.
-   **next.config.ts**: Archivo de configuración para Next.js.
-   **package.json**: Define los metadatos del proyecto y sus dependencias.
-   **pnpm-lock.yaml**: Archivo de bloqueo de dependencias para pnpm.
-   **postcss.config.mjs**: Configuración para PostCSS.
-   **tailwind.config.js**: Configuración de Tailwind CSS.
-   **tsconfig.json**: Configuración del compilador de TypeScript.

## 🛠️ Cómo Empezar

Para ejecutar este proyecto en tu entorno local, sigue estos pasos:

1.  **Clona el repositorio:**
    ```bash
    git clone [https://github.com/iamhosto10/Frontend-Real-State.git](https://github.com/iamhosto10/Frontend-Real-State.git)
    ```
2.  **Instala las dependencias** (puedes usar tu gestor de paquetes preferido):
    ```bash
    npm install
    # o
    yarn install
    # o
    pnpm install
    ```
3.  **Inicia el servidor de desarrollo:**
    ```bash
    npm run dev
    # o
    yarn dev
    # o
    pnpm dev
    ```
4.  Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación en funcionamiento.
5.  Se recomienda crear una api que tenga los datos descritos se recomienda tener una env para probarlo de esta manera NEXT_PUBLIC_API_URL
6.  Se recomienda hacer combinacion con con el siguiente proyecto que esta relacionado [https://github.com/iamhosto10/Backend-Real-State](https://github.com/iamhosto10/Backend-Real-State), es una API que contiene todo lo que necesitas

Puedes empezar a editar la página principal modificando el archivo `app/page.tsx`. La aplicación se recargará automáticamente a medida que guardes los cambios.

## 💻 Tecnologías Utilizadas

-   **TypeScript**: 97.1%
-   **CSS**: 2.8%
-   **JavaScript**: 0.1%

## ☁️ Despliegue

La forma más sencilla de desplegar tu aplicación Next.js es utilizando la [**Plataforma Vercel**](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme), de los creadores de Next.js.

Consulta la [documentación de despliegue de Next.js](https://nextjs.org/docs/app/building-your-application/deploying) para más detalles.


## 🧪 Testing

Este proyecto usa **Jest** + **React Testing Library**.

### Notas importantes
- Se configuró **Babel** para que Jest entienda JSX y TypeScript:
  ```bash
  npm install -D babel-jest @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript
  ```
- Algunos componentes (`Button`, `Card`, `Carousel`, `next/link`) fueron **mockeados** para evitar errores en tests.
- El prop `asChild` genera warnings en Jest, por eso se creó un mock personalizado para `Button`.
- Los precios se renderizan con salto de línea y separador de miles, por lo que se usa una regex flexible en las pruebas:
  ```ts
  expect(screen.getByText(/\$\s*500[.,]000/)).toBeInTheDocument();
  ```

👉 Ejecutar tests:
```bash
npm run test
```

