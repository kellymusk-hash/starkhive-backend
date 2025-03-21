import { Test, type TestingModule } from "@nestjs/testing"
import { type INestApplication, ValidationPipe } from "@nestjs/common"
import * as request from "supertest"
import { AppModule } from "../src/app.module"
import { JwtAuthGuard } from "../src/auth/guards/jwt-auth.guard"
import { PostPrivacy } from "../src/post/entities/post.entity"
import { ReactionType } from "../src/post/entities/post-reaction.entity"

// Mock JWT Auth Guard to bypass authentication for testing
const mockJwtAuthGuard = {
  canActivate: (context) => {
    // Set the user in the request object
    const req = context.switchToHttp().getRequest()
    req.user = { id: "test-user-id" }
    return true
  },
}

describe("PostController (e2e)", () => {
  let app: INestApplication
  let postId: string

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile()

    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new ValidationPipe())
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it("/posts (POST) - should create a new post", () => {
    return request(app.getHttpServer())
      .post("/posts")
      .send({
        content: "Test post with #hashtag for e2e testing",
        privacy: PostPrivacy.PUBLIC,
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty("id")
        expect(res.body.content).toBe("Test post with #hashtag for e2e testing")
        expect(res.body.privacy).toBe(PostPrivacy.PUBLIC)
        expect(res.body.authorId).toBe("test-user-id")

        // Save the post ID for later tests
        postId = res.body.id
      })
  })

  it("/posts/feed (GET) - should return activity feed", () => {
    return request(app.getHttpServer())
      .get("/posts/feed")
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty("posts")
        expect(res.body).toHaveProperty("total")
        expect(Array.isArray(res.body.posts)).toBe(true)
      })
  })

  it("/posts/trending-hashtags (GET) - should return trending hashtags", () => {
    return request(app.getHttpServer())
      .get("/posts/trending-hashtags")
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true)
      })
  })

  it("/posts/:id (GET) - should return a post by ID", () => {
    return request(app.getHttpServer())
      .get(`/posts/${postId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty("id", postId)
        expect(res.body.content).toBe("Test post with #hashtag for e2e testing")
      })
  })

  it("/posts/:id (PATCH) - should update a post", () => {
    return request(app.getHttpServer())
      .patch(`/posts/${postId}`)
      .send({
        content: "Updated test post with #newtag",
        privacy: PostPrivacy.CONNECTIONS,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty("id", postId)
        expect(res.body.content).toBe("Updated test post with #newtag")
        expect(res.body.privacy).toBe(PostPrivacy.CONNECTIONS)
      })
  })

  it("/posts/:id/reactions (POST) - should add a reaction to a post", () => {
    return request(app.getHttpServer())
      .post(`/posts/${postId}/reactions`)
      .send({
        type: ReactionType.LIKE,
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty("id")
        expect(res.body.postId).toBe(postId)
        expect(res.body.userId).toBe("test-user-id")
        expect(res.body.type).toBe(ReactionType.LIKE)
      })
  })

  it("/posts/:id/share (POST) - should share/repost a post", () => {
    return request(app.getHttpServer())
      .post(`/posts/${postId}/share`)
      .send({
        content: "Sharing this post!",
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty("id")
        expect(res.body.content).toBe("Sharing this post!")
        expect(res.body.originalPostId).toBe(postId)
        expect(res.body.authorId).toBe("test-user-id")
      })
  })

  it("/posts/:id (DELETE) - should delete a post", () => {
    return request(app.getHttpServer()).delete(`/posts/${postId}`).expect(204)
  })

  it("/posts/:id (GET) - should return 404 for deleted post", () => {
    return request(app.getHttpServer()).get(`/posts/${postId}`).expect(404)
  })
})

