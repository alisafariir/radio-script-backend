import { CommentQueryDto } from '@/dtos';
import { Comment, Post, User } from '@/entities';
import { PaginateResponse } from '@/interfaces';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Post) private postRepo: Repository<Post>
  ) {}

  async create(content: string, authorId: string, postId: string) {
    const comment = this.commentRepo.create({ content });

    comment.author = await this.userRepo.findOneByOrFail({ id: authorId });
    comment.post = await this.postRepo.findOneByOrFail({ id: postId });

    return this.commentRepo.save(comment);
  }

  async findAll(query: CommentQueryDto): Promise<PaginateResponse<Comment[]>> {
    const { search, authorId, postId, content, page = 1, limit = 10 } = query;
    const whereConditions: FindOptionsWhere<Comment>[] = [];

    if (search) {
      whereConditions.push({ content: ILike(`%${search}%`) });
    }

    if (authorId) {
      whereConditions.push({ author: { id: authorId } });
    }

    if (postId) {
      whereConditions.push({ post: { id: postId } });
    }

    if (content) {
      whereConditions.push({ content });
    }

    const [data, total] = await this.commentRepo.findAndCount({
      where: whereConditions.length ? whereConditions : undefined,
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  findAllByPost(postId: string, query: CommentQueryDto) {
    const { search, authorId, content, page = 1, limit = 10 } = query;
    const whereConditions: FindOptionsWhere<Comment>[] = [];

    if (search) {
      whereConditions.push({ content: ILike(`%${search}%`) });
    }

    if (authorId) {
      whereConditions.push({ author: { id: authorId } });
    }

    if (content) {
      whereConditions.push({ content });
    }
    return this.commentRepo.find({
      where: { post: { id: postId, ...whereConditions } },
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async remove(id: string) {
    const comment = await this.commentRepo.findOneBy({ id });
    if (!comment) throw new NotFoundException('Comment not found');
    return this.commentRepo.softRemove(comment);
  }
}
