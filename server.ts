import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const IMGBB_API_KEY = process.env.IMGBB_API_KEY || '2fb57a84a2f3725356a85e9e99edb1a7';

app.use(express.json({ limit: '15mb' }));

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Ubuntu Quest API', timestamp: new Date().toISOString() });
});

// Proxy Route: Subida segura a ImgBB
app.post('/api/upload-imgbb', async (req, res) => {
  try {
    const { image, name } = req.body;
    if (!image) {
      return res.status(400).json({ success: false, error: 'No se envió ninguna imagen para subir' });
    }

    let cleanBase64 = image;
    if (cleanBase64.includes(',')) {
      cleanBase64 = cleanBase64.split(',')[1];
    }

    const formData = new URLSearchParams();
    formData.append('image', cleanBase64);
    if (name) {
      formData.append('name', name);
    }

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!data.success || !data.data) {
      return res.status(400).json({
        success: false,
        error: data.error?.message || 'Error al procesar la imagen en ImgBB',
      });
    }

    return res.json({
      success: true,
      url: data.data.url, // Enlace directo a la imagen https://i.ibb.co/...
      display_url: data.data.display_url,
      width: Number(data.data.width),
      height: Number(data.data.height),
      id: data.data.id,
      title: data.data.title,
    });
  } catch (err: unknown) {
    console.error('Error en endpoint /api/upload-imgbb:', err);
    return res.status(500).json({
      success: false,
      error: (err as Error).message || 'Error del servidor al subir a ImgBB',
    });
  }
});

// Vite middleware en modo desarrollo o static en producción
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Ubuntu Quest servidor activo en http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Error iniciando el servidor:', err);
});
