import { Tag } from '@/entities';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

  findAll() {
    return this.tagRepo.find();
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
