import { User } from './../users/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant, Category } from './entities';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput
} from './dtos/create-restaurant.dto';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
    @InjectRepository(Category)
    private readonly categories: Repository<Category>
  ) {}

  async createRestaurant(
    owner: User,
    createRestaurantInput: CreateRestaurantInput
  ): Promise<CreateRestaurantOutput> {
    try {
      const newRestaurant = this.restaurants.create(createRestaurantInput);
      newRestaurant.owner = owner;

      const categoryName = createRestaurantInput.categoryName
        .trim()
        .toLowerCase();

      // south korea bbq => south-korea-bbq
      const categorySlug = categoryName.replace(/ /g, '-');

      let category = await this.categories.findOne({
        where: { slug: categorySlug }
      });

      // 若該類別資料庫未存在, 則自動建立
      if (!category) {
        category = await this.categories.save(
          this.categories.create({ name: categoryName, slug: categorySlug })
        );
      }

      newRestaurant.category = category;
      await this.restaurants.save(newRestaurant);

      return { ok: true };
    } catch (error) {
      return { ok: false, error: 'Could not create restaurant' };
    }
  }
}
