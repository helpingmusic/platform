import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
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
import { ActiveSubscriptionGuard } from 'src/auth/guards/active-subscription.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { IUser } from 'src/users/interfaces/user.interface';

import { NotFoundInterceptor } from 'src/common/not-found.interceptor';
import { Output } from 'src/common/output.decorator';
import { User } from 'src/common/user.decorator';
import { CreatePostDto } from './dto/create-post.dto';

import { IPost } from './post.interface';
import { PostService } from './post.service';
import { PostVm } from './post.vm';

@ApiUseTags('posts')
@ApiResponse({ status: 401, description: 'User is not logged in' })
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard('jwt'), ActiveSubscriptionGuard, RolesGuard)
@Controller('posts')
export class PostController {

  constructor(private readonly postService: PostService) {
  }

  /**
   * Index
   */
  @ApiOperation({ title: 'List Posts' })
  @ApiOkResponse({
    isArray: true,
    type: PostVm,
    description: 'List all Posts',
  })

  @Get()
  @Output([PostVm])
  index(@Query() query: { page: number, poster: string }): Promise<IPost[]> {
    const q = query.poster ? {poster: query.poster} : {};
    return this.postService.paginate(q, query.page - 1);
  }

  /**
   * Show
   */
  @ApiOperation({ title: 'Show a Post' })
  @ApiOkResponse({
    isArray: true,
    type: PostVm,
  })

  @Get(':id')
  @Output(PostVm)
  show(@Param('id') id: string): Promise<IPost> {
    return this.postService.findById(id);
  }

  /**
   * Create
   */
  @ApiOperation({ title: 'Create Post' })
  @ApiImplicitBody({ name: 'Create Post Input', type: CreatePostDto })
  @ApiForbiddenResponse({ description: 'Inactive Subscription or not Admin' })
  @ApiUnprocessableEntityResponse({ description: 'Body not valid' })
  @ApiCreatedResponse({ description: 'Create Post', type: PostVm })

  @Post()
  @Output(PostVm)
  create(@User() user: IUser, @Body() body: CreatePostDto): Promise<IPost> {
    return this.postService.create({
      ...body,
      poster: user._id,
    });
  }

  /**
   * Update
   */
  @ApiOperation({ title: 'Update Post' })
  @ApiImplicitBody({ name: 'Update Post Input', type: CreatePostDto })
  @ApiForbiddenResponse({ description: 'Inactive Subscription or not Admin' })
  @ApiUnprocessableEntityResponse({ description: 'Body not valid' })
  @ApiOkResponse({ type: PostVm })
  @ApiNotFoundResponse({ description: 'Post Not Found' })

  @Put(':id')
  @UseInterceptors(new NotFoundInterceptor('Post Not Found'))
  @Output(PostVm)
  async update(@User() user: IUser, @Param('id') id: string, @Body() body: CreatePostDto): Promise<IPost> {
    const p = await this.postService.findById(id);
    if (String(user._id) !== String(p.poster._id)) {
      throw new UnauthorizedException('You cannot edit a post that is not your own.');
    }

    return this.postService.update(p, body);
  }

  /**
   * Delete
   */
  @ApiOperation({ title: 'Delete Post' })
  @ApiForbiddenResponse({ description: 'Inactive Subscription or not Admin' })
  @ApiNotFoundResponse({ description: 'Post Not Found' })
  @ApiOkResponse({ description: 'Post Deleted' })

  @Delete(':id')
  @UseInterceptors(new NotFoundInterceptor('Post Not Found'))
  async remove(@User() user: IUser, @Param('id') id: string) {
    const p = await this.postService.findById(id);
    if (String(user._id) !== String(p.poster._id)) {
      throw new UnauthorizedException('You cannot remove a post that is not your own.');
    }
    return this.postService.delete(id);
  }
}
