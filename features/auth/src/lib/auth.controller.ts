import { avatarMulterOptions } from '@/constants';
import { ChangePasswordDto, ForgotPasswordDto, GoogleOneTapDto, IdentityDto, LoginDto, LoginOtpDto, OtpDto, RegisterDto, UpdateProfileDto } from '@/dtos';
import { JwtAuthGuard, RefreshTokenGuard } from '@/guards';
import { CookieService } from '@/helpers';
import { DeviceInterceptor } from '@/interceptors';
import { Body, Controller, Delete, Get, Patch, Post, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
@UseInterceptors(DeviceInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService, private cookieService: CookieService) {}

  @Post('identity')
  async identity(@Body() identityDto: IdentityDto) {
    return this.authService.identityVerification(identityDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Req() request: Request) {
    return this.authService.register(registerDto, request['deviceInfo']);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Req() request: Request, @Res({ passthrough: true }) res: Response) {
    const user = await this.authService.login(loginDto, request['deviceInfo']);
    await this.cookieService.setResponseTokenCookies(res, user.access_token, user.refresh_token);
    return user;
  }

  @Post('login-otp')
  async loginOtp(@Body() loginDto: LoginOtpDto, @Req() request: Request, @Res({ passthrough: true }) res: Response) {
    const user = await this.authService.loginOtp(loginDto, request['deviceInfo']);
    await this.cookieService.setResponseTokenCookies(res, user.access_token, user.refresh_token);
    return user;
  }

  @Post('google-one-tap')
  async googleOneTap(@Req() request: Request, @Body() googleOneTapDto: GoogleOneTapDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.authService.googleOneTapLogin(googleOneTapDto, request['deviceInfo']);
    await this.cookieService.setResponseTokenCookies(res, user.access_token, user.refresh_token);
    return user;
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Initiates the Google OAuth2 login flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Res() res: Response, @Req() request: Request) {
    const data = await this.authService.socialAuth(request['user'], 'google', request['deviceInfo']);
    await this.cookieService.setResponseTokenCookies(res, data.access_token, data.refresh_token);
    return res.redirect(data.url);
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth() {
    // Initiates the GitHub OAuth2 login flow
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubAuthRedirect(@Res() res: Response, @Req() request: Request) {
    const data = await this.authService.socialAuth(request['user'], 'github', request['deviceInfo']);
    await this.cookieService.setResponseTokenCookies(res, data.access_token, data.refresh_token);
    return res.redirect(data.url);
  }

  @Post('send-otp')
  async sendOtp(@Body() otpDto: OtpDto) {
    return this.authService.sendOtp(otpDto);
  }

  @Post('forgot-password')
  async forgotPassword(@Req() req: Request, @Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Patch('change-password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto, @Req() request: Request) {
    return this.authService.changePassword(changePasswordDto, request['deviceInfo']);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: Request) {
    const user_id = req['user']['sub'];
    return this.authService.getProfile(user_id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(@Req() req: Request, @Body() updateProfileDto: UpdateProfileDto) {
    const user_id = req['user']['sub'];
    return this.authService.updateProfile(user_id, updateProfileDto);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar', avatarMulterOptions))
  @Patch('avatar')
  async updateAvatar(@Req() req: Request, @UploadedFile() avatar: Express.Multer.File) {
    const user_id = req['user']['sub'];
    return this.authService.updateAvatar(user_id, avatar);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('avatar')
  async removeAvatar(@Req() req: Request) {
    const user_id = req['user']['sub'];
    return this.authService.removeAvatar(user_id);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh-token')
  async refresh_token(@Req() request: Request, @Res({ passthrough: true }) res: Response) {
    const user: any = request.user;
    const data = await this.authService.refresh_token(user, request['deviceInfo']);
    await this.cookieService.setResponseTokenCookies(res, data.access_token, data.refresh_token);
    return data;
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.cookieService.deleteResponseTokenCookies(res);
    return await this.authService.logout(req);
  }
}
