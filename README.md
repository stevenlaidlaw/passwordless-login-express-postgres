# passwordless-login

This is an example of passwordless login using Express and Postgres.

Front-end is templated using Handlebars.

Login is authenticated with a randomly generated code sent to the user's email address.

Make sure your `.env` file is populated with the below:

```env
// Local dev
DATABASE_URL=postgresql://DB_USER:DB_PASSWORD@DB_HOST:DB_PORT/DB_DATABASE
// eg. DATABASE_URL=postgresql://site_admin:jf82j98jdsf@localhost:5432/exampledb
PORT=3000
// Local dev and prod
JWT_SECRET_KEY=ARandomStringOfCharactersfj8ajs908fm2983n09asdfnf89an
EMAIL_USER=person@example.com
EMAIL_PASSWORD=fj08j2*JH39j0s
EMAIL_HOST=mail.example.com
EMAIL_FROM=Me <person@example.com>
```
