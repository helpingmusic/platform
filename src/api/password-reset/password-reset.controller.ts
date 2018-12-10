import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { PasswordResetDto } from 'src/api/password-reset/password-reset.dto';
import { PasswordResetService } from 'src/api/password-reset/password-reset.service';

@Controller('password-reset')
@ApiUseTags('password-reset')
export class PasswordResetController {

  constructor(
    private resetService: PasswordResetService,
  ) {
  }

  @Post()
  @ApiOperation({ title: 'Send User forgot password email' })
  sendForgotEmail(@Body() body: { email: string }) {
    return this.resetService.createReset(body.email);
  }

  @Post(':id')
  @ApiOperation({ title: 'Update user password from user token' })
  updatePassword(@Param('id') resetId: string, @Body() body: PasswordResetDto) {
    return this.resetService.resetPassword(resetId, body.token, body.newPassword);
  }

}
