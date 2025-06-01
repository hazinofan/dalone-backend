import { IsString, IsUrl, IsInt, IsDateString, ArrayNotEmpty, IsArray } from 'class-validator';

export class CreateWorkDto {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsUrl({}, { each: true })
    imageUrls: string[];

    @IsUrl()
    category: string;

    @IsUrl()
    date: string;

    @IsDateString()
    userId: number;
}
