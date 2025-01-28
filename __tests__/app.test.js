const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection");
const seed = require('../db/seeds/seed');
const endpointsJson = require("../endpoints.json");
const {articleData, commentData, topicData, userData} = require("../db/data/test-data/index.js");
const {convertTimestampToDate, createRef, formatComments} = require("../db/seeds/utils.js");

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

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with a single article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        const article = response.body.article;
        expect(article.title).toBe("Living in the shadow of a great man");
        expect(article.topic).toBe('mitch');
        expect(article.author).toBe("butter_bridge");
        expect(article.body).toBe("I find this existence challenging");
        expect(typeof article.created_at).toBe("string");
        expect(article.votes).toBe(100);
        expect(article.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700");
      });
  });
  test('GET:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
    return request(app)
      .get('/api/articles/999')
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('No article found for article_id: 999');
      });
  });
  test('GET:400 sends an appropriate status and error message when given an invalid id', () => {
    return request(app)
      .get('/api/articles/not-a-team')
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad Request');
      });
  });
});

describe("GET /api/articles",() => {
  test("200: Responds with all articles with the comment count property added and sorted by date in descending order", () => {
    return request(app)
    .get('/api/articles')
    .expect(200)
    .then(({body}) => {
      console.log(body.articles);
      expect(body.articles).toBeInstanceOf(Array);
      expect(body.articles.length).toBeGreaterThan(0);
      body.articles.forEach((article) => {
        expect(article).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number),
        });
        expect(article).not.toHaveProperty("body");
      });
    })
  });
});