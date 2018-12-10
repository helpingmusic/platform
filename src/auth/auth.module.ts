import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from 'src/auth/local/local.strategy';
import { GoogleController } from 'src/auth/google/google.controller';
import { SharedModule } from 'src/shared/shared.module';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { FacebookController } from './facebook/facebook.controller';
import { JwtStrategy } from './jwt.strategy';
import { LocalController } from './local/local.controller';

@Module({
  imports: [
    SharedModule,
    JwtModule.register({
      secretOrPrivateKey: process.env.SESSION_SECRET,
      signOptions: { expiresIn: 3600 },
    }),
    UsersModule,
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
  ],
  controllers: [LocalController, FacebookController, GoogleController],
  exports: [],
})
export class AuthModule {
}
