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
      .get('/api/articles/not-an-article')
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

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of comments sorted by date", () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then((response) => {
        const comments = response.body.comments;
        expect
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 1
          });
        })
      });
  });
  test('GET:200 sends an empty array when the input is an article_id that exists, but has no comments', () => {
    return request(app)
      .get('/api/articles/12/comments')
      .expect(200)
      .then((response) => {
        const comments = response.body.comments;
        expect(comments.length).toBe(0);
      });
  });
  test('GET:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
    return request(app)
      .get('/api/articles/999/comments')
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('No article found for article_id: 999');
      });
  });
  test('GET:400 sends an appropriate status and error message when given an invalid id', () => {
    return request(app)
      .get('/api/articles/not-an-id/comments')
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad Request');
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("return the new comment", () => {
    return request(app)
      .post("/api/articles/4/comments")
      .send({
        username: "lurker",
        body: "Jaki fajny bober"
      })
      .expect(201)
      .then((res) => {
        expect(res.body.comment).toMatchObject({
          comment_id: expect.any(Number),
          body: "Jaki fajny bober",
          votes: 0,
          author: "lurker",
          article_id: 4,
          created_at: expect.any(String)
        });
      });
  });
  test("POST 400: Responds with an appropriate status and error message when provided with a bad topic (no body)", () => {
    return request(app)
      .post("/api/articles/4/comments")
      .send({
        username: "lurker"
      })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad Request");
      });
  });
  test("POST 404: Responds with an appropriate status and error message when provided with a bad topic (no username)", () => {
    return request(app)
      .post("/api/articles/4/comments")
      .send({
        username: "Tasos",
        body: "jaki fajny bober"
      })
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("User doesn't exist");
      });
  });
  test('POST:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
    return request(app)
      .post('/api/articles/999/comments')
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('No article found for article_id: 999');
      });
  });
  test('POST:400 sends an appropriate status and error message when given an invalid id', () => {
    return request(app)
      .post('/api/articles/not-an-article/comments')
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad Request');
      });
  });
  })

  describe("/api/articles/:article_id", () => {
    test("PATCH: 200 return the updated article", () => {
      return request(app)
      .patch("/api/articles/1")
      .send({
        inc_votes: 2
      })
      .expect(200)
      .then((res) => {
        const article = res.body.article;
        expect(article.title).toBe("Living in the shadow of a great man");
        expect(article.topic).toBe('mitch');
        expect(article.author).toBe("butter_bridge");
        expect(article.body).toBe("I find this existence challenging");
        expect(typeof article.created_at).toBe("string");
        expect(article.votes).toBe(102);
        expect(article.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700");
      });
    })
    test('PATCH:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
      return request(app)
        .patch('/api/articles/999')
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe('No article found for article_id: 999');
        });
    });
    test('PATCH:400 sends an appropriate status and error message when given an invalid id', () => {
      return request(app)
        .patch('/api/articles/not-an-article')
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe('Bad Request');
        });
    });
  })