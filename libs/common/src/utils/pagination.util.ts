import { SelectQueryBuilder, ObjectLiteral } from 'typeorm';
import { PageOptionsDto } from '../dto/page-options.dto';
import { PageMetaDto } from '../dto/page-meta.dto';
import { PageDto } from '../dto/page.dto';

export async function paginate<T extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<T>,
  pageOptionsDto: PageOptionsDto,
): Promise<PageDto<T>> {
  if (pageOptionsDto.sortField) {
    queryBuilder.orderBy(
      `${queryBuilder.alias}.${pageOptionsDto.sortField}`,
      pageOptionsDto.order,
    );
  }

  queryBuilder.skip(pageOptionsDto.skip).take(pageOptionsDto.limit);

  const itemCount = await queryBuilder.getCount();
  const { entities } = await queryBuilder.getRawAndEntities();

  const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

  return new PageDto(entities, pageMetaDto);
}
