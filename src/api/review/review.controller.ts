import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiImplicitBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiUnprocessableEntityResponse,
  ApiUseTags,
} from '@nestjs/swagger';
import { UpdateReviewDto } from 'src/api/review/dto/update-review.dto';
import { ActiveSubscriptionGuard } from 'src/auth/guards/active-subscription.guard';

import { IUser } from 'src/users/interfaces/user.interface';
import { NotFoundInterceptor } from 'src/common/not-found.interceptor';
import { Output } from 'src/common/output.decorator';
import { User } from 'src/common/user.decorator';
import { CreateReviewDto } from './dto/create-review.dto';

import { IReview } from './review.interface';
import { ReviewService } from './review.service';
import { ReviewVm } from './review.vm';

@ApiUseTags('reviews')
@ApiResponse({ status: 401, description: 'User is not logged in' })
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard('jwt'), ActiveSubscriptionGuard)
@Controller('reviews')
export class ReviewController {

  constructor(private readonly reviewService: ReviewService) {
  }


  /**
   * Index
   */
  @ApiOperation({ title: 'List Posts' })
  @ApiOkResponse({
    isArray: true,
    type: ReviewVm,
    description: 'List all Posts',
  })

  @Get()
  @Output([ReviewVm])
  index(@Query() query: { user: string }): Promise<IReview[]> {
    const q = query.user ? {reviewee: query.user} : {};
    return this.reviewService.find(q);
  }

  /**
   * Create
   * @param body {CreateReviewDto}
   */
  @ApiOperation({ title: 'Create Review' })
  @ApiImplicitBody({ name: 'Create Review Input', type: CreateReviewDto })
  @ApiForbiddenResponse({ description: 'Inactive Subscription or not Admin' })
  @ApiUnprocessableEntityResponse({ description: 'Body not valid' })
  @ApiCreatedResponse({ description: 'Create Review', type: ReviewVm })

  @Post()
  @Output(ReviewVm)
  create(@User() user: IUser, @Body() body: CreateReviewDto): Promise<IReview> {
    return this.reviewService.create({
      ...body,
      poster: user._id,
    });
  }

  /**
   * Update
   * @param id {String}
   * @param body {CreateReviewDto}
   */
  @ApiOperation({ title: 'Update Review' })
  @ApiImplicitBody({ name: 'Update Review Input', type: UpdateReviewDto })
  @ApiForbiddenResponse({ description: 'Inactive Subscription or not Admin' })
  @ApiUnprocessableEntityResponse({ description: 'Body not valid' })
  @ApiOkResponse({ type: ReviewVm })
  @ApiNotFoundResponse({ description: 'Review Not Found' })

  @Put(':id')
  @UseInterceptors(new NotFoundInterceptor('Review Not Found'))
  @Output(ReviewVm)
  update(@Param('id') id: string, @Body() body: UpdateReviewDto): Promise<IReview> {
    return this.reviewService.update(id, body);
  }

  /**
   * Delete
   * @param id {String}
   */
  @ApiOperation({ title: 'Delete Review' })
  @ApiForbiddenResponse({ description: 'Inactive Subscription or not Admin' })
  @ApiNotFoundResponse({ description: 'Review Not Found' })
  @ApiOkResponse({ description: 'Review Deleted' })

  @Delete(':id')
  @UseInterceptors(new NotFoundInterceptor('Review Not Found'))
  remove(@Param('id') id: string) {
    return this.reviewService.delete(id);
  }

}
