# siwe-auth

## Description

This project is a boilerplate that set up a full-stack service providing sign in with ethereum (SIWE) protocol functionality. 
It uses NestJS with microservices to process the requests on the backend and NextJS on the front-end.

## Stack :
### API: 

Microservices REST API services.
Uses NestJS & TypeORM with SQLite.

- Gateway Service (expose: 8880 by default)
- Auth Service (can expose: 8850, tcp: 8851 - by default on internal network
  - Persist on disk users data using SQLite
- Siwe Service (can expose: 8860, tcp: 8861 - by default on internal network)
  - Persist on memory nonce data using FIFO Queue

### www:
NextJS front-end handling basic connect with ethereum SIWE process. 
Uses ethers.js as provider.
Expose: 3000 by default.

### docker-compose:
Docker-compose file to run the stack.

## Run the backend stack

```bash
docker-compose up
```

## Run the front-end

```bash
cd www
npm install
npm run build
npm run start
```

