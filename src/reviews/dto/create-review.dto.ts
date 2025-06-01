import { IsInt, Min, Max, IsString, Length, IsNotEmpty } from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsNotEmpty()
  @Length(5, 1000)
  comment: string;

  @IsInt()
  professionalId: number;
}
