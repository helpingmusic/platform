import { Controller, Get, Request, Response, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { AuthService } from '../auth.service';

@ApiUseTags('auth')
@Controller('auth/facebook')
export class FacebookController {

  constructor(private auth: AuthService) {
  }

  /**
   * initiates oauth login
   */
  @ApiOperation({ title: 'Facebook Login' })
  @Get()
  @UseGuards(AuthGuard('facebook'))
  login() {
  }

  /**
   * Callback for facebook to finish login
   */
  @ApiOperation({ title: 'Facebook Oauth Callback' })
  @Get('/callback')
  @UseGuards(AuthGuard('facebook'))
  callback(@Request() req, @Response() res) {
    const token = this.auth.signToken(req.user);
    res.cookie('token', token);
    return res.json({ token });
  }

}
