# Passwordless Login Express Postgres

## Architecture

### Web

SSR application using express.js and Handlebars templating.

## Local Dev

### Requirements

- node16
- postgres14

### Getting up and running

1. Create a db called `sitename` and create a user with create access.
2. Populate the database with the init script to add tables. `cat db/init.sql | psql -d sitename -U sitename`
3. Populate the database with data
4. Create a `.env` file and fill with data like the example below.
5. Run `make dev` to develop locally with automatic reloading
6. Run `make run` to view a prod environment locally (no reloading)

#### .ENV Example

```env
// Local dev
DATABASE_URL=postgresql://DB_USER:DB_PASSWORD@DB_HOST:DB_PORT/DB_DATABASE
// eg. DATABASE_URL=postgresql://db_user:user_password123@localhost:5432/db_name
PORT=3000
// Local dev and prod
JWT_SECRET_KEY=ARandomStringOfCharactersfj8ajs908fm2983n09asdfnf89an
EMAIL_USER=person@example.com
EMAIL_PASSWORD=fj08j2*JH39j0s
EMAIL_HOST=mail.example.com
EMAIL_FROM=Me <person@example.com>
```

### Deployment

All deployment is handled via GitHub once set up on Heroku. Any commits directly to the `master` branch will result in a deployment.

Ensure all development is done on feature branches and tested before merging into master.
