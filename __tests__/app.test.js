const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection");
const seed = require('../db/seeds/seed');
const endpointsJson = require("../endpoints.json");
const {articleData, commentData, topicData, userData} = require("../db/data/test-data/index.js");

beforeEach(() => seed({ topicData, userData, articleData, commentData }));
afterAll(() => db.end());

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an object containing all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((data) => {
        const topicsArr = data.body.topics;
        expect(topicsArr[0].description).toBe('The man, the Mitch, the legend');
        expect(topicsArr[0].slug).toBe('mitch');
      });
  });
});