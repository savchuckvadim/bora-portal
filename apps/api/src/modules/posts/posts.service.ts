import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Post } from "../../database/entities/post.entity";
import { NotificationEventsService } from "../notifications/notification-events.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postsRepo: Repository<Post>,
    private readonly notificationEventsService: NotificationEventsService,
  ) {}

  async create(dto: CreatePostDto): Promise<Post> {
    const post = this.postsRepo.create(dto);
    const saved = await this.postsRepo.save(post);
    await this.notificationEventsService.enqueueEvent("POST_CREATED", {
      postId: saved.id,
      title: saved.title,
      authorId: saved.authorId,
    });
    return saved;
  }

  async findAll(params?: { page?: number; limit?: number; search?: string }): Promise<Post[]> {
    const page = Math.max(params?.page ?? 1, 1);
    const limit = Math.min(Math.max(params?.limit ?? 20, 1), 100);
    const query = this.postsRepo.createQueryBuilder("posts").orderBy("posts.created_at", "DESC");

    if (params?.search) {
      query.where("posts.title ILIKE :search OR posts.content ILIKE :search", {
        search: `%${params.search}%`,
      });
    }

    query.skip((page - 1) * limit).take(limit);
    return query.getMany();
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postsRepo.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException("Post not found");
    }
    return post;
  }

  async update(id: string, dto: UpdatePostDto): Promise<Post> {
    const post = await this.findOne(id);
    Object.assign(post, dto);
    return this.postsRepo.save(post);
  }

  async remove(id: string): Promise<void> {
    const post = await this.findOne(id);
    await this.postsRepo.remove(post);
  }
}
