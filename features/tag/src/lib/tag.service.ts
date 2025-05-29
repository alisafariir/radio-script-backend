import { TagQueryDto } from '@/dtos';
import { Tag } from '@/entities';
import { PaginateResponse } from '@/interfaces';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private tagRepo: Repository<Tag>
  ) {}

  create(name: string, slug: string) {
    const tag = this.tagRepo.create({ name, slug });
    return this.tagRepo.save(tag);
  }

  async findAll(query: TagQueryDto): Promise<PaginateResponse<Tag[]>> {
    const { name, slug, search, page = 1, limit = 10 } = query;
    const whereConditions: FindOptionsWhere<Tag>[] = [];

    if (search) {
      whereConditions.push({ name: ILike(`%${search}%`) });
    }

    if (name) {
      whereConditions.push({ name });
    }

    if (slug) {
      whereConditions.push({ slug });
    }

    const [data, total] = await this.tagRepo.findAndCount({
      where: whereConditions.length ? whereConditions : undefined,
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const tag = await this.tagRepo.findOne({ where: { id } });
    if (!tag) throw new NotFoundException('Tag not found');
    return tag;
  }

  async remove(id: string) {
    const tag = await this.findOne(id);
    return this.tagRepo.softRemove(tag);
  }

  async recover(id: string) {
    const cat = await this.tagRepo.findOne({
      where: { id },
      withDeleted: true,
    });
    return this.tagRepo.recover(cat);
  }
  deleted() {
    return this.tagRepo.find({
      withDeleted: true,
    });
  }
}
