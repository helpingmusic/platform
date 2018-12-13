import { ClassSerializerInterceptor, Controller, Get, Param, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { IThread } from 'src/api/thread/thread.interface';
import { ThreadService } from 'src/api/thread/thread.service';
import { ThreadVm } from 'src/api/thread/thread.vm';
import { ActiveSubscriptionGuard } from 'src/auth/guards/active-subscription.guard';
import { Output } from 'src/common/decorators/output.decorator';

@ApiUseTags('thread')
@ApiResponse({ status: 401, description: 'User is not logged in' })
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard('jwt'), ActiveSubscriptionGuard)
@Controller('threads')
export class ThreadController {

  constructor(private readonly threadService: ThreadService) {
  }

  /**
   * Show
   */
  @ApiOperation({ title: 'Show a thread' })
  @ApiOkResponse({
    isArray: true,
    type: ThreadVm,
  })

  @Get(':id')
  @Output(ThreadVm)
  show(@Param('id') id: string): Promise<IThread> {
    return this.threadService.show(id);
  }

}
