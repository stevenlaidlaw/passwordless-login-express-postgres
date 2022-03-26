logs:
	heroku logs -a sitename

run:
	heroku local web

dev:
	npm run dev

psql:
	heroku pg:psql postgresql-globular-XXXXXX --app sitename
