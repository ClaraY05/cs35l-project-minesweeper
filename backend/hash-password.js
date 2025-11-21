const bcrypt = require('bcrypt');

const password = process.argv[2];
if (!password) {
    console.log('Usage: node hash-password.js <password>');
    process.exit(1);
}

bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
        console.error('Error hashing password:', err);
        process.exit(1);
    }
    console.log('Hashed password:', hash);
    console.log('\nSQL to insert user:');
    console.log(`INSERT INTO users (username, password_hash) VALUES ('your-email@example.com', '${hash}');`);
});

