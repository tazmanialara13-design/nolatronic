# IA NOLATRONIC 1.5

El frontend llama a `POST /api/ai`. El archivo `api/ai.js` está preparado para un entorno Node/serverless compatible.

## Activación
1. Despliega el repositorio en un proveedor que ejecute funciones serverless Node.
2. Crea el secreto `OPENAI_API_KEY` en las variables de entorno del proveedor.
3. Opcional: define `OPENAI_MODEL`.
4. No publiques nunca la clave en `index.html`, GitHub ni JavaScript del navegador.

La especialización se aplica tanto en el navegador como en el servidor: NOLATRONIC responde solo sobre electricidad y electrónica.
