commmands:

npm i prisma


npx prisma init
to initialize prisma in environment variables.

npm install @prisma/client
then create schemas or enums inside schema.prisma file inside prisma directory

npx prisma migrate dev --name
after crating schema u have to run this command so that prisma will craete those prisma in your provided  db 


npm prisma generate
this will generate a prisma client to process CRUD operation in your db