pnpm create next-app@latest .
pnpm i -D prisma
pnpm i @prisma/client jsonwebtoken bcrypt
npx prisma init

then create root areas
docker-compose.yml
update .env
DATABASE_URL="postgresql://postgres:pass123@localhost:5432/todo_db?schema=public"

then docker-compose up -d

pnpm prisma migrate dev --name todo_table
pnpm prisma generate
pnpm dev