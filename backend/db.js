const mysql = require('mysql2')

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // XAMPP default
  database: 'badminton_db'
})

db.connect(err => {
  if (err) {
    console.error('❌ DB Error:', err)
  } else {
    console.log('✅ MySQL Connected')
    // Ensure `users` table exists to avoid query errors during development
    const usersTableSql = `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255),
      role VARCHAR(50) DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;

    db.query(usersTableSql, (createErr) => {
      if (createErr) console.error('Error ensuring users table exists:', createErr)
      else console.log('✅ Ensured users table exists')
    })
  }
})

module.exports = db