import { Test, type TestingModule } from "@nestjs/testing"
import { PostController } from "./post.controller"
import { PostService } from "./post.service"
import { PostPrivacy } from "./entities/post.entity"
import { CreatePostDto } from "./dto/create-post.dto"
import { UpdatePostDto } from "./dto/update-post.dto"
import { ReactionType } from "./entities/post-reaction.entity"
import { CreateReactionDto } from "./dto/create-reaction.dto"

// Mock PostService
const mockPostService = () => ({
  createPost: jest.fn(),
  getActivityFeed: jest.fn(),
  getTrendingHashtags: jest.fn(),
  getPost: jest.fn(),
  updatePost: jest.fn(),
  deletePost: jest.fn(),
  reactToPost: jest.fn(),
})

describe("PostController", () => {
  let controller: PostController
  let postService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        {
          provide: PostService,
          useFactory: mockPostService,
        },
      ],
    }).compile()

    controller = module.get<PostController>(PostController)
    postService = module.get<PostService>(PostService)
  })

  it("should be defined", () => {
    expect(controller).toBeDefined()
  })

  describe("create", () => {
    it("should create a new post", async () => {
      // Arrange
      const userId = "user-123"
      const createPostDto: CreatePostDto = {
        content: "Test post with #hashtag",
        privacy: PostPrivacy.PUBLIC,
      }
      const createdPost = {
        id: "post-123",
        content: createPostDto.content,
        privacy: createPostDto.privacy,
        authorId: userId,
      }

      // Mock implementation
      postService.createPost.mockResolvedValue(createdPost)

      // Act
      const result = await controller.create(userId, createPostDto)

      // Assert
      expect(postService.createPost).toHaveBeenCalledWith(userId, createPostDto)
      expect(result).toEqual(createdPost)
    })
  })

  describe("getActivityFeed", () => {
    it("should return activity feed", async () => {
      // Arrange
      const userId = "user-123"
      const page = 1
      const limit = 20
      const feedResult = {
        posts: [
          { id: "post-1", content: "Post 1" },
          { id: "post-2", content: "Post 2" },
        ],
        total: 2,
      }

      // Mock implementation
      postService.getActivityFeed.mockResolvedValue(feedResult)

      // Act
      const result = await controller.getActivityFeed(userId, page, limit)

      // Assert
      expect(postService.getActivityFeed).toHaveBeenCalledWith(userId, page, limit)
      expect(result).toEqual(feedResult)
    })
  })

  describe("getTrendingHashtags", () => {
    it("should return trending hashtags", async () => {
      // Arrange
      const limit = 10
      const trendingHashtags = [
        { name: "trending1", count: "42" },
        { name: "trending2", count: "36" },
      ]

      // Mock implementation
      postService.getTrendingHashtags.mockResolvedValue(trendingHashtags)

      // Act
      const result = await controller.getTrendingHashtags(limit)

      // Assert
      expect(postService.getTrendingHashtags).toHaveBeenCalledWith(limit)
      expect(result).toEqual(trendingHashtags)
    })
  })

  describe("findOne", () => {
    it("should return a post by ID", async () => {
      // Arrange
      const userId = "user-123"
      const postId = "post-123"
      const post = {
        id: postId,
        content: "Test post",
        authorId: "other-user-456",
      }

      // Mock implementation
      postService.getPost.mockResolvedValue(post)

      // Act
      const result = await controller.findOne(userId, postId)

      // Assert
      expect(postService.getPost).toHaveBeenCalledWith(userId, postId)
      expect(result).toEqual(post)
    })
  })

  describe("update", () => {
    it("should update a post", async () => {
      // Arrange
      const userId = "user-123"
      const postId = "post-123"
      const updatePostDto: UpdatePostDto = {
        content: "Updated content",
        privacy: PostPrivacy.CONNECTIONS,
      }
      const updatedPost = {
        id: postId,
        content: updatePostDto.content,
        privacy: updatePostDto.privacy,
        authorId: userId,
      }

      // Mock implementation
      postService.updatePost.mockResolvedValue(updatedPost)

      // Act
      const result = await controller.update(userId, postId, updatePostDto)

      // Assert
      expect(postService.updatePost).toHaveBeenCalledWith(userId, postId, updatePostDto)
      expect(result).toEqual(updatedPost)
    })
  })

  describe("remove", () => {
    it("should delete a post", async () => {
      // Arrange
      const userId = "user-123"
      const postId = "post-123"

      // Mock implementation
      postService.deletePost.mockResolvedValue(undefined)

      // Act
      const result = await controller.remove(userId, postId)

      // Assert
      expect(postService.deletePost).toHaveBeenCalledWith(userId, postId)
      expect(result).toBeUndefined()
    })
  })

  describe("reactToPost", () => {
    it("should add a reaction to a post", async () => {
      // Arrange
      const userId = "user-123"
      const postId = "post-123"
      const createReactionDto: CreateReactionDto = {
        type: ReactionType.LIKE,
      }
      const reaction = {
        id: "reaction-123",
        postId,
        userId,
        type: createReactionDto.type,
      }

      // Mock implementation
      postService.reactToPost.mockResolvedValue(reaction)

      // Act
      const result = await controller.reactToPost(userId, postId, createReactionDto)

      // Assert
      expect(postService.reactToPost).toHaveBeenCalledWith(userId, postId, createReactionDto)
      expect(result).toEqual(reaction)
    })
  })

  describe("sharePost", () => {
    it("should share/repost a post", async () => {
      // Arrange
      const userId = "user-123"
      const postId = "post-123"
      const createPostDto: CreatePostDto = {
        content: "Check out this post!",
      }
      const sharedPost = {
        id: "shared-post-456",
        content: createPostDto.content,
        authorId: userId,
        originalPostId: postId,
      }

      // Mock implementation
      postService.createPost.mockResolvedValue(sharedPost)

      // Act
      const result = await controller.sharePost(userId, postId, createPostDto)

      // Assert
      expect(postService.createPost).toHaveBeenCalledWith(userId, {
        ...createPostDto,
        originalPostId: postId,
      })
      expect(result).toEqual(sharedPost)
    })
  })
})

