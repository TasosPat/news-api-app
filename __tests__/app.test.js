const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection");
const seed = require('../db/seeds/seed');
const {articleData, commentData, topicData, userData} = require("../db/data/test-data/index.js");

const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */

/* Set up your beforeEach & afterAll functions here */
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

describe.only("GET /api/topics", () => {
  test("200: Responds with an object containing all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((data) => {
        expect(data.body).toEqual({topics: topicData});
      });
  });
  test("POST 201: Inserts a new topic and responds with the newly inserted topic", () => {
    return request(app)
      .post("/api/topics")
      .send({
        slug: "Rock",
        description: "That hard thing which is also a celebrity's nickname"
      })
      .expect(201)
      .then((res) => {
        console.log(res.body)
        expect(res.body.topic.slug).toBe("Rock");
        expect(res.body.topic.description).toBe("That hard thing which is also a celebrity's nickname");
      });
  });
  test("POST 400: Responds with an appropriate status and error message when provided with a bad topic (no slug)", () => {
    return request(app)
      .post("/api/topics")
      .send({
        description: "That hard thing which is also a celebrity's nickname"
      })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad Request");
      });
  });
});