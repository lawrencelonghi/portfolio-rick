import { Pool } from "pg";
import dotenv from 'dotenv';
dotenv.config();
export const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'portfolio_db',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});
pool.on('connect', () => {
    console.log('✓ Conectado ao PostgreSQL');
});
pool.on('error', (err) => {
    console.error('Erro inesperado no PostgreSQL:', err);
    process.exit(-1);
});
export const createTables = async () => {
    try {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS campaigns  (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        thumb_url VARCHAR(500),
        order_index INTEGER DEFAULT 0
      )
    `);
        console.log('✓ Tabela "campaigns" criada/verificada');
        await pool.query(`
    CREATE TABLE IF NOT EXISTS campaign_images  (
      id SERIAL PRIMARY KEY,
      campaign_id INTEGER NOT NULL,
      image_url VARCHAR(500) NOT NULL,
      order_index INTEGER DEFAULT 0,
      FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
    )
    `);
        console.log('✓ Tabela "campaigns_images" criada/verificada');
        await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_campaign_images_campaign_id 
    ON campaign_images(campaign_id);
  `);
    }
    catch (error) {
        console.error('Erro ao criar tabelas:', error);
        throw error;
    }
};
//# sourceMappingURL=database.js.map