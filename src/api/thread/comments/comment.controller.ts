import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  NotFoundException,
  Param,
  Post,
  Put,
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
import { IComment } from 'src/api/thread/comments/comment.interface';
import { CommentService } from 'src/api/thread/comments/comment.service';
import { CommentVm } from 'src/api/thread/comments/comment.vm';
import { CreateCommentDto } from 'src/api/thread/comments/dto/create-comment.dto';
import { UpdateCommentDto } from 'src/api/thread/comments/dto/update-comment.dto';
import { ActiveSubscriptionGuard } from 'src/auth/guards/active-subscription.guard';
import { IUser } from 'src/users/interfaces/user.interface';
import { Output } from 'src/common/output.decorator';
import { User } from 'src/common/user.decorator';

@ApiUseTags('comments')
@ApiResponse({ status: 401, description: 'User is not logged in' })
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard('jwt'), ActiveSubscriptionGuard)
@Controller('threads/:threadId/comments')
export class CommentController {

  constructor(private readonly commentService: CommentService) {
  }

  /**
   * Create
   */
  @ApiOperation({ title: 'Create comment' })
  @ApiImplicitBody({ name: 'Create comment Input', type: CreateCommentDto })
  @ApiForbiddenResponse({ description: 'Inactive Subscription or not Admin' })
  @ApiUnprocessableEntityResponse({ description: 'Body not valid' })
  @ApiCreatedResponse({ description: 'Create Comment', type: CommentVm })

  @Post()
  @Output(CommentVm)
  create(@User() user: IUser, @Param('threadId') threadId: string, @Body() body: CreateCommentDto): Promise<IComment> {
    return this.commentService.create({
      ...body,
      thread: threadId,
      commenter: user._id,
    });
  }

  /**
   * Update
   */
  @ApiOperation({ title: 'Update Comment' })
  @ApiImplicitBody({ name: 'Update Comment Input', type: UpdateCommentDto })
  @ApiForbiddenResponse({ description: 'Inactive Subscription or not Admin' })
  @ApiUnprocessableEntityResponse({ description: 'Body not valid' })
  @ApiOkResponse({ type: CommentVm })
  @ApiNotFoundResponse({ description: 'Comment Not Found' })

  @Put(':commentId')
  @Output(CommentVm)
  async update(
    @User() user: IUser,
    @Param('commentId') commentId: string,
    @Param('threadId') threadId: string,
    @Body() body: UpdateCommentDto,
  ): Promise<IComment> {
    const p = await this.commentService.show(commentId);

    if (!p) {
      throw new NotFoundException('Comment not found');
    }

    if (String(user._id) !== String(p.commenter)) {
      throw new UnauthorizedException('You cannot edit a comment that is not your own.');
    }

    return this.commentService.update(commentId, body);
  }

  /**
   * Delete
   */
  @ApiOperation({ title: 'Remove Comment' })
  @ApiForbiddenResponse({ description: 'Inactive Subscription or not Admin' })
  @ApiNotFoundResponse({ description: 'Comment Not Found' })
  @ApiOkResponse({ description: 'Comment Deleted' })

  @Delete(':commentId')
  @Output(CommentVm)
  async remove(
    @User() user: IUser,
    @Param('commentId') commentId: string,
    @Param('threadId') threadId: string,
  ): Promise<IComment> {
    const c = await this.commentService.show(commentId);

    if (!c) {
      throw new NotFoundException('Comment not found');
    }

    if (String(user._id) !== String(c.commenter)) {
      throw new UnauthorizedException('You cannot remove a comment that is not your own.');
    }

    return this.commentService.remove(c);
  }

}
