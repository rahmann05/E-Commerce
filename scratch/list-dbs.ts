import "dotenv/config"
import pg from 'pg'

async function main() {
  const pool = new pg.Pool({ 
    connectionString: "postgresql://postgres:safdar123@localhost:5432/postgres" 
  })
  
  try {
    const res = await pool.query('SELECT datname FROM pg_database WHERE datistemplate = false;')
    console.log('Databases:', res.rows.map(r => r.datname))
  } catch (err) {
    console.error('Error:', err)
  } finally {
    await pool.end()
  }
}

main()
