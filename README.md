# BusGo Capstone

Full-stack bus ticket booking application based on the supplied BusGo foundation specification.

## Stack
- Frontend: React + Vite + JavaScript
- Backend: Java 17 + Spring Boot 3.3.5 + Maven
- Persistence: H2 for local development, PostgreSQL dependency included for production
- ORM: Spring Data JPA / Hibernate
- Auth: Stateless JWT + BCrypt
- Tests: JUnit 5 + Mockito
- API: REST + Postman collection

## Demo credentials
- Admin: admin@busgo.com / Admin@123
- User: user@busgo.com / User@123

## Run backend
cd busgo-backend
mvn clean test
mvn spring-boot:run

H2 console:
http://localhost:8080/h2-console
JDBC URL: jdbc:h2:mem:busgo
User: sa
Password: (empty)

## Run frontend
cd busgo-frontend
npm install
npm run dev

Frontend:
http://localhost:5173

## Postman
Import:
postman/BusGo.postman_collection.json

Run Login first; the token is automatically stored in the collection variable.

## Notes
The supplied foundation document calls for admin-only Bus/Schedule CRUD. This starter implementation includes JWT authentication and the API surface, but the authorization policy currently authenticates protected endpoints and does not yet distinguish admin from normal users at the controller level. Add method-level admin authorization before production use.
