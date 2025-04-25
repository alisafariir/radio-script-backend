import { Category } from '@/entities';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeRepository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: TreeRepository<Category>
  ) {}

  async create(name: string, slug: string, parentId?: string): Promise<Category> {
    const category = this.categoryRepo.create({ name, slug });

    if (parentId) {
      const parent = await this.categoryRepo.findOneBy({ id: parentId });
      if (!parent) throw new NotFoundException('Parent category not found');
      category.parent = parent;
    }

    return this.categoryRepo.save(category);
  }

  findAll() {
    return this.categoryRepo.findTrees();
  }

  deleted() {
    return this.categoryRepo.find({
      withDeleted: true,
    });
  }

  async findOne(id: string) {
    const cat = await this.categoryRepo.findOne({ where: { id } });
    if (!cat) throw new NotFoundException('Category not found');
    return cat;
  }

  async recover(id: string) {
    const cat = await this.categoryRepo.findOne({
      where: { id },
      withDeleted: true,
    });
    return this.categoryRepo.recover(cat);
  }

  async remove(id: string) {
    const cat = await this.findOne(id);
    return this.categoryRepo.softRemove(cat);
  }
}
