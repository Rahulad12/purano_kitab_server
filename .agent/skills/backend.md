# Backend Skill

## Purpose

Create and maintain NestJS backend APIs, database models, and business logic.

## When to Use

- Creating new API endpoints
- Adding database models
- Implementing business logic
- Integrating external APIs (e.g., Google OAuth)

## Execution Strategy

### 1. Create New Module

```bash
nest g module <module-name>
nest g controller <module-name>
nest g service <module-name>
```

### 2. Create Schema

```typescript
// src/modules/<module>/<module>.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ModuleNameDocument = HydratedDocument<ModuleName>;

@Schema({ timestamps: true })
export class ModuleName {
  @Prop() fieldName: string;
}

export const ModuleNameSchema = SchemaFactory.createForClass(ModuleName);
```

### 3. Create DTOs

```typescript
// src/modules/dto/<module-name>.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class CreateModuleNameDto {
  @IsString()
  fieldName: string;
}
```

### 4. Create Service

```typescript
// src/modules/<module>/<module>.service.ts
@Injectable()
export class ModuleNameService {
  constructor(
    @InjectModel(ModuleName.name) private model: Model<ModuleNameDocument>,
  ) {}

  async create(data: CreateModuleNameDto): Promise<ModuleName> {
    const created = new this.model(data);
    return created.save();
  }
}
```

### 5. Create Controller

```typescript
// src/modules/<module>/<module>.controller.ts
@ApiTags('module-name')
@Controller('module-name')
export class ModuleNameController {
  constructor(private readonly service: ModuleNameService) {}

  @Get()
  findAll(): Promise<ModuleName[]> {
    return this.service.findAll();
  }

  @Post()
  @ApiBody({ type: CreateModuleNameDto })
  create(@Body() data: CreateModuleNameDto): Promise<ModuleName> {
    return this.service.create(data);
  }
}
```

### 6. Register in Module

```typescript
// src/modules/<module>/<module>.module.ts
@Module({
  imports: [MongooseModule.forFeature([{ name: ModuleName.name, schema: ModuleNameSchema }])],
  controllers: [ModuleNameController],
  providers: [ModuleNameService],
  exports: [ModuleNameService],
})
export class ModuleNameModule {}
```

## Code Examples

### Database Query with Filters

```typescript
async findWithFilters(filters: {
  page: number;
  limit: number;
  search?: string;
}): Promise<ModuleName[]> {
  const query: Record<string, unknown> = {};

  if (filters.search) {
    query.title = { $regex: filters.search, $options: 'i' };
  }

  return this.model
    .find(query)
    .skip((filters.page - 1) * filters.limit)
    .limit(filters.limit)
    .exec();
}
```

### Aggregation Pipeline

```typescript
async getAggregatedData(): Promise<any[]> {
  return this.model.aggregate([
    { $lookup: { from: 'other', localField: '_id', foreignField: 'ref', as: 'data' } },
    { $match: { 'data.0': { $exists: true } } },
    { $sort: { createdAt: -1 } },
  ]);
}
```

## Commands

```bash
yarn start:dev       # Development server
yarn build          # Production build
yarn start:prod     # Production run
yarn lint          # Run linter
```