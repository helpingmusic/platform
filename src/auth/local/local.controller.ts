import { Controller, Post, Request, Response, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiCreatedResponse, ApiImplicitBody, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { LoginResponseDto } from 'src/auth/dto/login-response.dto';
import { User } from 'src/common/decorators/user.decorator';
import { AuthService } from '../auth.service';
import { LocalCredentialsDto } from './local-credentials.dto';
import { Output } from 'src/common/decorators/output.decorator';

@ApiUseTags('auth')
@Controller('auth/local')
export class LocalController {

  constructor(private auth: AuthService) {
  }

  /**
   * Login
   */
  @ApiOperation({ title: 'Local Login' })
  @ApiImplicitBody({ name: 'Credentials', type: LocalCredentialsDto })
  @ApiCreatedResponse({ description: 'Logged In' })
  @ApiResponse({ status: 401, description: 'Incorrect credentials' })

  @Post()
  @UseGuards(AuthGuard('local'))
  @Output(LoginResponseDto)
  login(@User() user, @Response() res) {
    const token = this.auth.signToken(user);
    res.cookie('token', token);
    return res.json({ token, user });
  }

}
