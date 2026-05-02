import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post as HttpPost,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { PostsService } from "./posts.service";

@ApiTags("posts")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @HttpPost()
  create(@Body() dto: CreatePostDto) {
    return this.postsService.create(dto);
  }

  @Get()
  findAll(@Query("page") page?: string, @Query("limit") limit?: string, @Query("search") search?: string) {
    return this.postsService.findAll({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
      search,
    });
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdatePostDto) {
    return this.postsService.update(id, dto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    await this.postsService.remove(id);
    return { success: true };
  }
}
