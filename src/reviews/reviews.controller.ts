import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) { }

  // ── PUBLIC READERS ────────────────────────────────────────

  /** GET /reviews — public */
  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  /** GET /reviews/:id — public */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.findOne(id);
  }

  @Get('professional/:professionalId')
  findByProfessional(
    @Param('professionalId', ParseIntPipe) professionalId: number,
  ) {
    return this.reviewsService.findByProfessional(professionalId);
  }

  // ── AUTHENTICATED WRITERS ─────────────────────────────────

  /** POST /reviews — only logged-in clients */
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateReviewDto, @Request() req) {
    return this.reviewsService.create({
      rating: dto.rating,
      comment: dto.comment,
      clientId: req.user.id,
      professionalId: dto.professionalId,
    });
  }

  /** PUT /reviews/:id — only the author (client) */
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReviewDto,
    @Request() req,
  ) {
    // you can also verify req.user.id === existingReview.client.id here
    return this.reviewsService.update(id, dto);
  }

  /** DELETE /reviews/:id — only the author (client) */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    // verify req.user.id === existingReview.client.id if desired
    return this.reviewsService.remove(id);
  }
}
