import { CoreOutput } from './../../common/dtos/output.dto';
import { Category } from './../entities/category.entity';
import { Field, ObjectType, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class CategoryInput {
  @Field(type => String)
  slug: string;
}

@ObjectType()
export class CategoryOutput extends CoreOutput {
  @Field(type => Category, { nullable: true })
  category?: Category;
}
