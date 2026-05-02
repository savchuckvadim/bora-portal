import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString, IsUUID, MinLength } from "class-validator";
import { PostVisibility } from "../../../database/entities/post.entity";

export class CreatePostDto {
  @ApiProperty()
  @IsUUID()
  authorId!: string;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  title!: string;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  content!: string;

  @ApiProperty({ enum: PostVisibility, required: false })
  @IsEnum(PostVisibility)
  visibility: PostVisibility = PostVisibility.PUBLIC;
}
