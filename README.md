# Pulso Abierto

Aplicación educativa para consultar los precios en USD de Bitcoin, Ethereum y Solana mediante CoinGecko. Permite buscar, filtrar, abrir el detalle de cada moneda y guardar favoritas en el navegador.

Autora: Karen Barrionuevo. Versión final de Programación Web, preparada con asistencia de Codex sobre la Actividad 3.

## Publicación

- Repositorio GitHub: https://github.com/Mikururlz/pulso-abierto
- Aplicación en Vercel: https://pulso-abierto-eta.vercel.app

La aplicación está publicada en producción en Vercel, vinculada al repositorio de GitHub y a su rama `main`.

## Tecnologías

React, TypeScript, Vite, React Router, Zustand con persistencia local, Zod, Fetch API, Vitest, Testing Library y user-event.

## Requisitos e instalación

Recomendado: Node.js 24 LTS desde 24.15, con npm. `.nvmrc` indica la rama 24. Las versiones admitidas figuran en `package.json` e incluyen los requisitos de jsdom para las pruebas.

Desde la carpeta que contiene `package.json`:

```sh
npm ci
```

Se conserva `package-lock.json` para instalar las versiones verificadas.

## Desarrollo

```sh
npm run dev
```

Abrir la dirección informada por Vite, normalmente `http://127.0.0.1:5173/`. Si el puerto está ocupado, Vite informa otro. No abrir `index.html` con doble clic.

## Pruebas y tipos

```sh
npm run test
npm run typecheck
```

`npm run test` ejecuta la suite y termina. `npm run test:watch` observa cambios. Las pruebas simulan todas las solicitudes a CoinGecko; no consumen la API real. Incluyen consulta, validación, filtros, favoritas entre vistas, persistencia, error y reintento, servicio y formato monetario.

No se declara un script de lint; el proyecto no incorpora un linter en esta etapa.

## Build y preview

```sh
npm run build
npm run preview
```

El build comprueba TypeScript y genera `dist`. Preview sirve ese directorio, normalmente en `http://127.0.0.1:4173/`. Es una comprobación local del build, no un servidor público de producción. Para indicar otro puerto: `npm run preview -- --port 4184`.

## API y variables de entorno

El servicio `src/services/prices.ts` consulta:

`https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd`

No se utilizan variables de entorno ni claves privadas. No es necesario crear un archivo `.env` ni configurar valores en Vercel. CoinGecko requiere conexión y puede limitar solicitudes; la aplicación comunica el error y permite reintentar. No genera precios ficticios.

## Rutas y favoritas

- `/`: consulta y resultados.
- `/criptomonedas/bitcoin`, `/criptomonedas/ethereum`, `/criptomonedas/solana`: detalles que pueden abrirse directamente o recargarse.
- Identificadores no admitidos: mensaje de criptomoneda inexistente.
- Otras rutas: página 404 de la aplicación.

`src/store/favorites.ts` conserva solo los identificadores de favoritas en la clave `pulso-abierto-favorites` de localStorage. Los precios, filtros, carga y errores no se persisten. La selección se comparte entre listado y detalle. El contador se calcula desde la colección.

El almacenamiento pertenece al navegador y al origen: la selección del preview no se transfiere automáticamente al dominio público de Vercel. Las pruebas de persistencia deben hacerse dentro del mismo origen.

## Mejora acotada de mantenibilidad

**Problema:** `formatPrice` creaba un nuevo `Intl.NumberFormat` en cada llamada, aunque la configuración de moneda y separadores era siempre la misma.

**Cambio:** se movió esa configuración a una única constante privada en `src/data/coins.ts`; la función pública reutiliza el formateador. No se modificaron las reglas de redondeo, la moneda, la API ni el comportamiento de las vistas.

**Verificación:** se agregó una prueba del formato esperado para un precio decimal y para cero; se ejecutó la suite completa y el build. También se comprobaron las cotizaciones mostradas por el preview. Fue la única refactorización funcional de esta etapa; los demás cambios corresponden a documentación, exclusiones de Git y configuración de publicación.

## Configuración de Vercel

Importar el repositorio de GitHub y seleccionar la raíz que contiene `package.json`.

| Opción | Valor |
| --- | --- |
| Framework | Vite |
| Node.js | 24.x |
| Install Command | `npm ci` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Variables de entorno | Ninguna |

`vercel.json` declara framework, instalación, build, salida y una reescritura SPA a `/index.html`. Esta configuración permite abrir o recargar las rutas de React Router. Debe verificarse también en la URL pública después del despliegue.

`.gitignore` excluye `node_modules`, `dist`, `.vercel`, archivos `.env`, archivos locales, cobertura, logs y caché de npm. El código, las pruebas y el lockfile sí deben quedar en Git.

## Verificación final

- Fecha de verificación local: 25/11/2026, America/Buenos_Aires.
- Instalación limpia: completada con `npm ci` a partir del lockfile.
- Pruebas ejecutadas: `npm run test`; 3 archivos y 10 casos aprobados, incluido el formato monetario tras la refactorización.
- Build: generado correctamente; TypeScript sin errores. Advertencia no bloqueante de React Router sobre `use client`.
- Preview: comprobado en navegador con datos reales de CoinGecko, ida y vuelta al detalle, favorita compartida y conservada al recargar, validación del formulario y vistas de escritorio y móvil de 390 px. Sin errores de consola observados.
- Push: versión final subida a `main` en https://github.com/Mikururlz/pulso-abierto. Commit de implementación verificado: `66f2412b6c4d46cd5aa194de1bd0108172e6895e`.
- Despliegue: realizado en Vercel desde GitHub, entorno `production`, con estado `READY`, framework Vite y Node 24.x.
- URL pública: https://pulso-abierto-eta.vercel.app
- Verificación pública: carga sin iniciar sesión en Vercel; precios reales de las tres monedas; navegación al detalle y regreso; recarga directa de `/criptomonedas/bitcoin`; marcado y desmarcado conservados al recargar; validación del formulario; vistas de escritorio y móvil de 390 px. Sin errores de consola observados.
- Fecha de verificación pública: 25/11/2026, America/Buenos_Aires. Comprobaciones realizadas con asistencia de Codex.

