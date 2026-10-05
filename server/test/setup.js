// Tests never depend on personal Atlas credentials or a developer's .env file.
process.env.NODE_ENV = 'test';
process.env.MONGO_URI = 'mongodb://127.0.0.1:27017/draftnest-test';
process.env.JWT_SECRET = 'draftnest-test-secret-only-never-use-in-production';
process.env.CLIENT_URL = 'http://localhost:5173';
