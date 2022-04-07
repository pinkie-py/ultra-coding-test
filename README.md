# Ultra – coding assessment

### Run the project in development mode

1. Install dependencies

```sh
yarn
```

2. Launch a MySql instance on port 3306 (via docker-compose or locally)

```sh
docker-compose up --no-deps -d db
```

3. Run migrations

```sh
yarn prisma:gen
yarn prisma:migrate
```

4. Launch application

```sh
yarn start:dev
```

or run e2e tests with

```sh
yarn test:e2e:local
```

### Build and run the containers

```sh
docker-compose up --no-deps -d db
docker-compose build api
docker-compose up --no-deps -d api
```

### Quick reference guide

```ts
GET /games;
```

Fetches all games from the database

```ts
POST /games

Expected body
{
  id?: number,
  title: string,
  price: number,
  tags: string[],
  releaseDate: UTCString
  publisherId: number
}
```

Creates a new game

```ts
GET,PATCH,DELETE /games/:id

Expected body for PATCH
{
  id?: number,
  title?: string,
  price?: number,
  tags?: string[],
  releaseDate?: UTCString
  publisherId?: number
}
```

Read, update, or delete a single game object

```ts
GET /games/:id/publisher
```

Fetches only the publisher data for a given game ID

```ts
GET /games/spring-cleaning;
```

Triggers the special process described in the assessment

##### Public game object schema

```ts
Game {
  id: number,
  title: string,
  price: string,
  tags: string[],
  releaseDate: UTCString
  publisher: Publisher {
    id: number,
    name: string,
    siret: number,
    phone: string
  }
}
```
