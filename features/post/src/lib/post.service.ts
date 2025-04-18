import { Category, Media, Post, Tag, User } from '@/entities';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreatePostDto, PostQueryDto, UpdatePostDto } from '@/dtos';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
    @InjectRepository(Category) private readonly categoryRepo: Repository<Category>,
    @InjectRepository(Tag) private readonly tagRepo: Repository<Tag>,
    @InjectRepository(Media) private readonly mediaRepo: Repository<Media>,
    @InjectRepository(User) private readonly userRepo: Repository<User>
  ) {}

  async create(dto: CreatePostDto): Promise<Post> {
    const { title, content, excerpt, status, type, slug, authorId, categoryIds, tagIds, featuredImageId } = dto;
    const post = this.postRepo.create({ title, content, excerpt, status, type, slug });

    // نویسنده
    post.author = await this.userRepo.findOneByOrFail({ id: authorId });

    // دسته‌بندی‌ها
    if (categoryIds?.length) {
      post.categories = await this.categoryRepo.findByIds(categoryIds);
    }

    // برچسب‌ها
    if (tagIds?.length) {
      post.tags = await this.tagRepo.findByIds(tagIds);
    }

    // تصویر شاخص
    if (featuredImageId) {
      post.featuredImage = await this.mediaRepo.findOneByOrFail({ id: featuredImageId });
    }

    return this.postRepo.save(post);
  }

  async findAll(query: PostQueryDto) {
    const { search, status, type, category, page = 1, limit = 10 } = query;
    const qb = this.postRepo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.categories', 'category')
      .leftJoinAndSelect('post.tags', 'tag')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.featuredImage', 'featuredImage')
      .orderBy('post.createdAt', 'DESC')
      .take(limit)
      .skip((page - 1) * limit);

    if (search) {
      qb.andWhere('post.title ILIKE :s OR post.content ILIKE :s', { s: `%${search}%` });
    }
    if (status) {
      qb.andWhere('post.status = :status', { status });
    }
    if (type) {
      qb.andWhere('post.type = :type', { type });
    }
    if (category) {
      qb.andWhere('category.id = :cat', { cat: category });
    }

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postRepo.findOne({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async update(id: string, dto: UpdatePostDto): Promise<Post> {
    const post = await this.findOne(id);
    Object.assign(post, dto);
    // اگر featuredImageId تغییر کرده
    if (dto.featuredImageId) {
      post.featuredImage = await this.mediaRepo.findOneByOrFail({ id: dto.featuredImageId });
    }
    // دسته‌بندی و تگ می‌تونی مشابه create اضافه کنی
    return this.postRepo.save(post);
  }

  async remove(id: string) {
    const post = await this.findOne(id);
    return this.postRepo.softRemove(post);
  }
}
