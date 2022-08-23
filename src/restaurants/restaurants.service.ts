import { User } from './../users/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant, Category } from './entities';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput
} from './dtos/create-restaurant.dto';
import {
  EditRestaurantInput,
  EditRestaurantOutput
} from './dtos/edit-restaurant.dto';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
    @InjectRepository(Category)
    private readonly categories: Repository<Category>
  ) {}

  async getOrCreateCategory(name: string): Promise<Category> {
    const categoryName = name.trim().toLowerCase();

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

    return category;
  }

  async createRestaurant(
    owner: User,
    createRestaurantInput: CreateRestaurantInput
  ): Promise<CreateRestaurantOutput> {
    try {
      const newRestaurant = this.restaurants.create(createRestaurantInput);
      newRestaurant.owner = owner;

      const category = await this.getOrCreateCategory(
        createRestaurantInput.categoryName
      );

      newRestaurant.category = category;
      await this.restaurants.save(newRestaurant);

      return { ok: true };
    } catch (error) {
      return { ok: false, error: 'Could not create restaurant' };
    }
  }

  async editRestaurant(
    owner: User,
    editRestaurantInput: EditRestaurantInput
  ): Promise<EditRestaurantOutput> {
    try {
      const restaurant = await this.restaurants.findOne({
        where: { id: editRestaurantInput.restaurantId },
        loadRelationIds: true
      });

      // 未找到
      if (!restaurant) {
        return { ok: false, error: 'Restaurant not found' };
      }

      // 非餐廳擁有者
      if (owner.id !== restaurant.ownerId) {
        return {
          ok: false,
          error: "You can't edit a restaurant that you don't own."
        };
      }

      // 如果有輸入類型
      let category: Category = null;
      const categoryName = editRestaurantInput.categoryName;
      if (categoryName) {
        category = await this.getOrCreateCategory(categoryName);
      }

      const newRestaurantData = {
        id: editRestaurantInput.restaurantId,
        ...editRestaurantInput,
        ...(category && { category }) // 若沒有 category 則不會新增
      };

      // 更新餐廳
      await this.restaurants.save([newRestaurantData]);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: 'Could not edit Restaurant' };
    }
  }
}
