import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
} from "@nestjs/common"

import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import { CurrentUser } from "src/auth/decorators/current-user.decorator"
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard"
import { PostService } from "./post.service"
import { CreatePostDto } from "./dto/create-post.dto"
import { UpdatePostDto } from "./dto/update-post.dto"
import { CreateReactionDto } from "./dto/create-reaction.dto"

@ApiTags("posts")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("posts")
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ApiOperation({ summary: "Create a new post" })
  @ApiResponse({ status: 201, description: "Post created successfully" })
  create(@CurrentUser() userId: string, @Body() createPostDto: CreatePostDto) {
    return this.postService.createPost(userId, createPostDto)
  }

  @Get("feed")
  @ApiOperation({ summary: "Get activity feed" })
  @ApiResponse({ status: 200, description: "Return activity feed" })
  getActivityFeed(@CurrentUser() userId: string, @Query('page') page: number = 1, @Query('limit') limit: number = 20) {
    return this.postService.getActivityFeed(userId, page, limit)
  }

  @Get('trending-hashtags')
  @ApiOperation({ summary: 'Get trending hashtags' })
  @ApiResponse({ status: 200, description: 'Return trending hashtags' })
  getTrendingHashtags(@Query('limit') limit: number = 10) {
    return this.postService.getTrendingHashtags(limit);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a post by ID" })
  @ApiResponse({ status: 200, description: "Return the post" })
  @ApiResponse({ status: 404, description: "Post not found" })
  findOne(@CurrentUser() userId: string, @Param('id') id: string) {
    return this.postService.getPost(userId, id)
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a post" })
  @ApiResponse({ status: 200, description: "Post updated successfully" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "Post not found" })
  update(@CurrentUser() userId: string, @Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.updatePost(userId, id, updatePostDto)
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a post" })
  @ApiResponse({ status: 204, description: "Post deleted successfully" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "Post not found" })
  remove(@CurrentUser() userId: string, @Param('id') id: string) {
    return this.postService.deletePost(userId, id)
  }

  @Post(":id/reactions")
  @ApiOperation({ summary: "React to a post" })
  @ApiResponse({ status: 201, description: "Reaction added successfully" })
  @ApiResponse({ status: 200, description: "Reaction updated successfully" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "Post not found" })
  reactToPost(
    @CurrentUser() userId: string,
    @Param('id') postId: string,
    @Body() createReactionDto: CreateReactionDto,
  ) {
    return this.postService.reactToPost(userId, postId, createReactionDto)
  }

  @Post(":id/share")
  @ApiOperation({ summary: "Share/Repost a post" })
  @ApiResponse({ status: 201, description: "Post shared successfully" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "Post not found" })
  sharePost(@CurrentUser() userId: string, @Param('id') postId: string, @Body() createPostDto: CreatePostDto) {
    // Set the original post ID
    createPostDto.originalPostId = postId
    return this.postService.createPost(userId, createPostDto)
  }
}

