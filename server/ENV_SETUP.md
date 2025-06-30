# HR Management API - Environment Setup

## Environment Variables Configuration

This application uses environment variables for configuration management. Follow these steps to set up your environment:

### 1. Copy Environment Template

```bash
cp .env.example .env
```

### 2. Configure Your Environment Variables

Edit the `.env` file with your specific configuration:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=hr_management_db
DB_USERNAME=root
DB_PASSWORD=your_actual_password

# Server Configuration
SERVER_PORT=8080
CONTEXT_PATH=/api

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3000

# Security Configuration
JWT_SECRET=your-super-secret-jwt-key-make-it-long-and-secure
JWT_EXPIRATION=86400000

# Application Environment
SPRING_PROFILES_ACTIVE=development

# Logging Level
LOGGING_LEVEL_ROOT=INFO
LOGGING_LEVEL_COM_HRMANAGEMENT=DEBUG

# File Upload Configuration
MAX_FILE_SIZE=10MB
MAX_REQUEST_SIZE=10MB

# Email Configuration (Optional)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-specific-password
MAIL_FROM=hr-management@company.com
```

### 3. Environment Variable Descriptions

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `DB_HOST` | Database host | localhost |
| `DB_PORT` | Database port | 3306 |
| `DB_NAME` | Database name | hr_management_db |
| `DB_USERNAME` | Database username | root |
| `DB_PASSWORD` | Database password | your_password |
| `SERVER_PORT` | Application server port | 8080 |
| `CONTEXT_PATH` | API context path | /api |
| `CORS_ALLOWED_ORIGINS` | Allowed CORS origins | http://localhost:3000 |
| `JWT_SECRET` | JWT secret key | default-secret-key |
| `JWT_EXPIRATION` | JWT token expiration (ms) | 86400000 (24 hours) |
| `SPRING_PROFILES_ACTIVE` | Active Spring profile | development |
| `MAX_FILE_SIZE` | Maximum file upload size | 10MB |
| `MAX_REQUEST_SIZE` | Maximum request size | 10MB |

### 4. Security Notes

- **Never commit the `.env` file** to version control
- **Generate a strong JWT secret** (at least 32 characters)
- **Use strong database passwords** in production
- **Update default passwords** before deploying

### 5. Different Environments

#### Development (.env)
```env
SPRING_PROFILES_ACTIVE=development
LOGGING_LEVEL_COM_HRMANAGEMENT=DEBUG
```

#### Production (.env)
```env
SPRING_PROFILES_ACTIVE=production
LOGGING_LEVEL_ROOT=WARN
LOGGING_LEVEL_COM_HRMANAGEMENT=INFO
DB_HOST=your-production-db-host
```

### 6. Running the Application

```bash
# Make sure your .env file is configured
# Then run the application
./mvnw spring-boot:run

# Or with Maven installed globally
mvn spring-boot:run
```

### 7. Verification

- Check if environment variables are loaded: http://localhost:8080/api/actuator/health
- Verify database connection in application logs
- Test API endpoints: http://localhost:8080/api/

### 8. Troubleshooting

- **Application won't start**: Check database connection and credentials
- **Port already in use**: Change `SERVER_PORT` in `.env`
- **CORS issues**: Update `CORS_ALLOWED_ORIGINS` to match your frontend URL
- **Environment variables not loading**: Ensure `.env` file is in the server root directory
