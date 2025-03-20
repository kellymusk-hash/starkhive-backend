import type { Repository } from "typeorm"
import { Hashtag } from "../entities/hashtag.entity"
import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"

@Injectable()
export class HashtagRepository {
  constructor(
    @InjectRepository(Hashtag)
    private readonly repository: Repository<Hashtag>,
  ) {}

  async findOrCreate(names: string[]): Promise<Hashtag[]> {
    const hashtags: Hashtag[] = []

    for (const name of names) {
      const normalizedName = name.toLowerCase().trim()
      let hashtag = await this.repository.findOne({ where: { name: normalizedName } })

      if (!hashtag) {
        hashtag = this.repository.create({ name: normalizedName })
        await this.repository.save(hashtag)
      } else {
        // Increment the post count
        await this.repository.increment({ id: hashtag.id }, "postCount", 1)
      }

      hashtags.push(hashtag)
    }

    return hashtags
  }

  async getTrending(limit = 10): Promise<Hashtag[]> {
    return this.repository.find({
      order: { postCount: "DESC" },
      take: limit,
    })
  }
}

