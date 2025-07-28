import { CategoryQueryDto } from '@/dtos';
import { Category } from '@/entities';
import { PaginateResponse } from '@/interfaces';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, TreeRepository } from 'typeorm';

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

  async findAll(query: CategoryQueryDto): Promise<PaginateResponse<Category[]>> {
    const { search, name, slug, page = 1, limit = 10 } = query;
    const whereConditions: FindOptionsWhere<Category>[] = [];

    if (search) {
      whereConditions.push({ name: ILike(`%${search}%`) });
    }
    if (name) {
      whereConditions.push({ name });
    }
    if (slug) {
      whereConditions.push({ slug });
    }
    const [data, total] = await this.categoryRepo.findAndCount({
      where: whereConditions.length ? whereConditions : undefined,
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
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
