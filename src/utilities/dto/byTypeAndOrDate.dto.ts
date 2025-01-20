import { ApiProperty } from '@nestjs/swagger';

export class ByTypeAndOrDateDto {
  @ApiProperty({
    required: false,
    example: 'toilet',
    description: 'The type of utility',
  })
  type?: string;

  @ApiProperty({
    required: false,
    example: ['2021-09-15', '2021-09-16'],
    description: 'The date the utility is available',
  })
  date?: string[];
}
