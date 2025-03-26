import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostImage } from './entities/post-image.entity';
import { PostReaction } from './entities/post-reaction.entity';
import { PostRepository } from './repositories/post.repository';
import { HashtagRepository } from './repositories/hashtag.repository';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { UserModule } from 'src/user/user.module';
import { Hashtag } from './entities/hashtag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, PostImage, PostReaction, Hashtag]),
    UserModule,
  ],
  providers: [PostRepository, HashtagRepository, PostService, Function],
  controllers: [PostController],
  exports: [PostService, PostRepository],
})
export class PostModule {}
