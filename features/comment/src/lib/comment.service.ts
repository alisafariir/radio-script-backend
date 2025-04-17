import { Comment, Post, User } from '@/entities';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

  findAllByPost(postId: string) {
    return this.commentRepo.find({
      where: { post: { id: postId } },
      order: { created_at: 'DESC' },
    });
  }

  async remove(id: string) {
    const comment = await this.commentRepo.findOneBy({ id });
    if (!comment) throw new NotFoundException('Comment not found');
    return this.commentRepo.softRemove(comment);
  }
}
