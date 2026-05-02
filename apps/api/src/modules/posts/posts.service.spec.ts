import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Post } from "../../database/entities/post.entity";
import { NotificationEventsService } from "../notifications/notification-events.service";
import { PostsService } from "./posts.service";

describe("PostsService", () => {
  let service: PostsService;
  let repo: jest.Mocked<Repository<Post>>;
  const notificationEventsService = {
    enqueueEvent: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: getRepositoryToken(Post), useValue: { create: jest.fn(), save: jest.fn() } },
        { provide: NotificationEventsService, useValue: notificationEventsService },
      ],
    }).compile();

    service = moduleRef.get(PostsService);
    repo = moduleRef.get(getRepositoryToken(Post));
  });

  it("enqueues POST_CREATED event on create", async () => {
    const dto = { authorId: "a", title: "Title", content: "Body", visibility: "public" } as any;
    repo.create.mockReturnValue(dto);
    repo.save.mockResolvedValue({ ...dto, id: "post-1" } as Post);

    await service.create(dto);

    expect(notificationEventsService.enqueueEvent).toHaveBeenCalledWith(
      "POST_CREATED",
      expect.objectContaining({ postId: "post-1" }),
    );
  });
});
