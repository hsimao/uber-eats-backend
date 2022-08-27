import { CoreOutput } from './../common/dtos/output.dto';
import {
  RestaurantsOutput,
  RestaurantsInput,
  CreateRestaurantInput,
  CreateRestaurantOutput,
  EditRestaurantInput,
  EditRestaurantOutput,
  DeleteRestaurantInput,
  DeleteRestaurantOutput,
  AllCategoriesOutput,
  CategoryInput,
  CategoryOutput
} from './dtos';
import { User } from './../users/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant, Category } from './entities';

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

  async checkRestaurantAndOwner(
    restaurantId: number,
    ownerId: number
  ): Promise<CoreOutput> {
    const restaurant = await this.restaurants.findOne({
      where: { id: restaurantId },
      loadRelationIds: true
    });

    // 未找到
    if (!restaurant) {
      return { ok: false, error: 'Restaurant not found' };
    }

    // 非餐廳擁有者
    if (ownerId !== restaurant.ownerId) {
      return {
        ok: false,
        error: "You can't edit a restaurant that you don't own."
      };
    }

    return { ok: true };
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
      const restaurantId = editRestaurantInput.restaurantId;
      const { ok, error } = await this.checkRestaurantAndOwner(
        restaurantId,
        owner.id
      );

      if (!ok) return { ok, error };

      // 如果有輸入類型
      let category: Category = null;
      const categoryName = editRestaurantInput.categoryName;
      if (categoryName) {
        category = await this.getOrCreateCategory(categoryName);
      }

      const newRestaurantData = {
        id: restaurantId,
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

  async deleteRestaurant(
    owner: User,
    deleteRestaurantInput: DeleteRestaurantInput
  ): Promise<DeleteRestaurantOutput> {
    try {
      const restaurantId = deleteRestaurantInput.restaurantId;
      const { ok, error } = await this.checkRestaurantAndOwner(
        restaurantId,
        owner.id
      );

      if (!ok) return { ok, error };

      await this.restaurants.delete(restaurantId);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: 'Could not delete restaurant.' };
    }
  }

  async allCategories(): Promise<AllCategoriesOutput> {
    try {
      const categories = await this.categories.find({
        relations: ['restaurants']
      });
      return { ok: true, categories };
    } catch (error) {
      return { ok: false, error: 'Could not load categories' };
    }
  }

  // 取出相同類型的餐廳數量
  countRestaurant(category: Category) {
    return this.restaurants.count({ where: { category: { id: category.id } } });
  }

  // 依據類型取得餐廳資料
  async findCategoryBySlug({
    slug,
    page,
    limit
  }: CategoryInput): Promise<CategoryOutput> {
    try {
      const category = await this.categories.findOne({ where: { slug } });

      if (!category) return { ok: false, error: 'Category not found' };
      // 餐廳分頁
      const restaurants = await this.restaurants.find({
        where: { category: { id: category.id } },
        // 筆數
        take: limit,
        // 開始抓取資料的起始位置
        skip: (page - 1) * limit
      });

      category.restaurants = restaurants;

      // 全部餐廳數量
      const totalResults = await this.countRestaurant(category);

      // 總頁數, 無條件進位
      const totalPages = Math.ceil(totalResults / limit);

      return { ok: true, category, totalPages };
    } catch (error) {
      return { ok: false, error: 'Colud not load category' };
    }
  }

  // 所有餐廳
  async allRestaurants({
    page,
    limit
  }: RestaurantsInput): Promise<RestaurantsOutput> {
    try {
      const [restaurants, totalResults] = await this.restaurants.findAndCount({
        take: limit,
        skip: (page - 1) * limit
      });

      // 總頁數
      const totalPages = Math.ceil(totalResults / limit);

      return { ok: true, results: restaurants, totalPages, totalResults };
    } catch {
      return { ok: false, error: 'Could not load restaurants' };
    }
  }
}
