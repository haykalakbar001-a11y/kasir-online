const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.get('/', (req, res) => {
  res.set('Content-Type', 'text/plain; charset=utf-8');
  res.send('Server Kasir Online Berjalan dengan Lancar!');
});

app.get('/api/barang', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM barang');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/barang', async (req, res) => {
  const { nama_barang, kategori, harga_jual, modal, stok, warung_id } = req.body;
  try {
    const newBarang = await pool.query(
      'INSERT INTO barang (nama_barang, kategori, harga_jual, modal, stok, warung_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [nama_barang, kategori, harga_jual, modal, stok, warung_id]
    );
    res.json(newBarang.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server aktif pada port ${PORT}`);
});
  
