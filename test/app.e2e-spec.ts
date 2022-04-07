import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import {
  ALL_FIELDS_PRESENT,
  GAME_ID_TAKEN,
  NO_NULL_VALUES,
  PUBLISHER_NOT_EXISTS,
} from '../src/helpers/errors';
import games from './testdata/games_all';
import gamesPost from './testdata/games_post';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await app.listen(8080);
    pactum.request.setBaseUrl('http://localhost:8080');
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/games (GET)', () => {
    it('fetches game 1', () => {
      return pactum.spec().get('/games').expectStatus(200);
    });
  });

  describe('/games (POST)', () => {
    it('throws when incomplete json is provided', () => {
      return pactum
        .spec()
        .post('/games')
        .withBody({ ...gamesPost[0], title: undefined })
        .expectStatus(400)
        .expectBodyContains(ALL_FIELDS_PRESENT);
    });

    it('throws when null values', () => {
      return pactum
        .spec()
        .post('/games')
        .withBody({ ...gamesPost[0], title: null })
        .expectStatus(400)
        .expectBodyContains(NO_NULL_VALUES);
    });

    it('inserts game 1', () => {
      return pactum
        .spec()
        .post('/games')
        .withBody(gamesPost[0])
        .expectStatus(201);
    });

    it('throws when taken id', () => {
      return pactum
        .spec()
        .post('/games')
        .withBody(gamesPost[0])
        .expectStatus(400)
        .expectBodyContains(GAME_ID_TAKEN);
    });

    it('inserts game 2', () => {
      return pactum
        .spec()
        .post('/games')
        .withBody(gamesPost[1])
        .expectStatus(201);
    });

    it('throws when inserting a game with nonexistent publisher', () => {
      return pactum
        .spec()
        .post('/games')
        .withBody({ ...gamesPost[1], publisherId: 0, id: 1000 })
        .expectStatus(400)
        .expectBodyContains(PUBLISHER_NOT_EXISTS)
        .inspect();
    });
  });

  describe('/games/:id (GET)', () => {
    it('throws when id not found', () => {
      return pactum.spec().get('/games/0').expectStatus(404);
    });

    it('fetches game 1', () => {
      return pactum
        .spec()
        .get('/games/1')
        .expectStatus(200)
        .expectBody(games[0]);
    });
  });

  describe('/games/:id/publisher (GET)', () => {
    it('throws when id not found', () => {
      return pactum.spec().get('/games/0/publisher').expectStatus(404);
    });

    it('fetches game 1', () => {
      return pactum
        .spec()
        .get('/games/1/publisher')
        .expectStatus(200)
        .expectBody(games[0].publisher);
    });
  });

  describe('/games/:id (PATCH)', () => {
    it('throws when trying to update a nonexistent game', () => {
      const payload = {
        title: 'Battlefield 2042 (to update) - changed name',
      };
      return pactum
        .spec()
        .patch('/games/0')
        .withBody(payload)
        .expectStatus(404);
    });

    it('throws when trying to update a game with nonexistent publisher', () => {
      const payload = {
        publisherId: 0,
      };
      return pactum
        .spec()
        .patch('/games/1')
        .withBody(payload)
        .expectStatus(400);
    });

    it('updates game 1', () => {
      const payload = {
        title: 'Battlefield 2042 (to update) - changed name',
      };
      return pactum
        .spec()
        .patch('/games/1')
        .withBody(payload)
        .expectStatus(200);
    });
  });

  describe('/games/spring-cleaning (GET)', () => {
    it('removes games older than 18mo. and applies a discount to those between 12 and 18mo.', () => {
      return pactum
        .spec()
        .get('/games/spring-cleaning')
        .expectStatus(200)
        .expectBody({
          deleted: 1,
          discounted: 1,
        });
    });
  });

  describe('/games/:id (DELETE)', () => {
    it('throws when trying to delete a nonexistent game', () => {
      return pactum.spec().delete('/games/0').expectStatus(404);
    });

    it('deletes game 1', () => {
      return pactum.spec().delete('/games/1').expectStatus(200);
    });
  });
});
