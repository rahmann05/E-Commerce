import "dotenv/config"
import pg from 'pg'

async function main() {
  const pool = new pg.Pool({ 
    connectionString: "postgresql://postgres:safdar123@localhost:5432/postgres" 
  })
  
  try {
    const res = await pool.query("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public';")
    console.log('Tables:', res.rows.map(r => r.tablename))
  } catch (err) {
    console.error('Error:', err)
  } finally {
    await pool.end()
  }
}

main()
