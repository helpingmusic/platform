import { Controller, Get, Request, Response, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { AuthService } from '../auth.service';

@ApiUseTags('auth')
@Controller('auth/google')
export class GoogleController {

  constructor(private auth: AuthService) {
  }

  /**
   * initiates oauth login
   */
  @ApiOperation({ title: 'Google Login' })
  @Get()
  @UseGuards(AuthGuard('google'))
  login() {
  }

  /**
   * Callback for google to finish login
   */
  @ApiOperation({ title: 'Google Oauth Callback' })
  @Get('/callback')
  @UseGuards(AuthGuard('google'))
  callback(@Request() req, @Response() res) {
    const token = this.auth.signToken(req.user);
    res.cookie('token', token);
    return res.json({ token });
  }

}
