import { ChangePasswordDto, ForgotPasswordDto, GoogleOneTapDto, IdentityDto, LoginDto, LoginOtpDto, OtpDto, RegisterDto, UpdateProfileDto } from '@/dtos';
import { User } from '@/entities';
import { EncryptionService, S3Service } from '@/helpers';
import { DeviceInfo } from '@/interfaces';
import { OtpService } from '@/otp';
import { TokenService } from '@/token';
import { SocialLoginProvider } from '@/types';
import { BadRequestException, ConflictException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { extname } from 'path';
import { Repository } from 'typeorm';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly otpService: OtpService,
    private readonly s3Service: S3Service,
    private readonly encryptionService: EncryptionService,
    private tokenService: TokenService,
    private configService: ConfigService
  ) {}

  async identityVerification({ email, phone_number }: IdentityDto) {
    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { phone_number }],
    });
    if (existingUser) {
      return {
        userExist: true,
        hasPassword: existingUser.password ? true : false,
      };
    }

    if (email) {
      await this.otpService.sendOtp(email);
    }
    if (phone_number) {
      await this.otpService.sendOtp(phone_number);
    }

    return { userExist: false };
  }

  async register({ email, phone_number, otp, password }: RegisterDto, deviceInfo: DeviceInfo) {
    const recipient = email ? email : phone_number;
    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { phone_number }],
    });

    if (existingUser) {
      throw new ConflictException('حساب کاربری از قبل وجود دارد');
    }

    await this.otpService.verifyOtp(otp, recipient);

    const hashedPassword = await this.encryptionService.hash(password);
    const user = this.userRepository.create({
      email,
      phone_number,
      password: hashedPassword,
      created_by: email ? 'email' : 'phone_number',
    });
    const createdUser = await this.userRepository.save(user);

    return this.createToken(createdUser, deviceInfo);
  }

  async login({ email, phone_number, password }: LoginDto, deviceInfo: DeviceInfo) {
    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { phone_number }],
    });
    if (!existingUser) {
      throw new NotFoundException('حساب کاربری یافت نشد.');
    }
    if (existingUser.created_by === 'social_login') {
      throw new BadRequestException('رمز عبور صحیح نیست، شما قبلا با ورود از طریق شبکه های اجتماعی ثبت نام کرده اید و برای حساب کاربری خود رمز عبور قرار نداده اید.');
    }
    const isValidPassword = await this.encryptionService.compare(password, existingUser.password);

    if (!password || !isValidPassword) {
      throw new BadRequestException('رمز عبور صحیح نمی‌باشد.');
    }

    const token = await this.createToken(existingUser, deviceInfo);
    const profile = await this.getProfile(existingUser.id);
    return { ...token, ...profile };
  }

  async sendOtp({ email, phone_number }: OtpDto) {
    const recipient = email ? email : phone_number;

    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { phone_number }],
    });

    if (!existingUser) {
      throw new NotFoundException('حساب کاربری یافت نشد.');
    }

    await this.otpService.sendOtp(recipient);

    return { message: 'رمز یکبار‌مصرف ارسال شد.' };
  }

  async loginOtp({ email, phone_number, otp }: LoginOtpDto, deviceInfo: DeviceInfo) {
    const recipient = email ? email : phone_number;
    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { phone_number }],
    });

    if (!existingUser) {
      throw new NotFoundException('حساب کاربری یافت نشد.');
    }

    await this.otpService.verifyOtp(otp, recipient);

    const token = await this.createToken(existingUser, deviceInfo);
    const profile = await this.getProfile(existingUser.id);

    return { ...token, ...profile };
  }

  async googleOneTapLogin({ credential }: GoogleOneTapDto, deviceInfo: DeviceInfo) {
    const { email, given_name, family_name, picture } = await this.tokenService.decodeJwt(credential);
    const existingUser = await this.userRepository.findOne({
      where: [{ email }],
    });

    if (existingUser) {
      await this.userRepository.update(existingUser.id, {
        first_name: given_name,
        last_name: family_name,
        avatar_url: picture,
      });
      const tokens = await this.createToken(existingUser, deviceInfo);
      const profile = await this.getProfile(existingUser.id);

      return { ...tokens, ...profile };
    } else {
      const user = this.userRepository.create({
        email,
        first_name: given_name,
        last_name: family_name,
        avatar_url: picture,
        created_by: 'social_login',
      });
      await this.userRepository.save(user);
      const tokens = await this.createToken(user, deviceInfo);
      const profile = await this.getProfile(user.id);

      return { ...tokens, ...profile };
    }
  }

  async socialAuth({ email, first_name, last_name, picture }: any, provider: SocialLoginProvider, deviceInfo: DeviceInfo) {
    const existingUser = await this.userRepository.findOne({
      where: [{ email }],
    });

    if (existingUser) {
      await this.userRepository.update(existingUser.id, {
        first_name,
        last_name,
        avatar_url: picture,
      });
      const { access_token, refresh_token } = await this.createToken(existingUser, deviceInfo);
      return {
        url: this.createSocialCallbackUrl(access_token, refresh_token, provider),
        access_token,
        refresh_token,
      };
    } else {
      const user = this.userRepository.create({
        email,
        first_name,
        last_name,
        avatar_url: picture,
        created_by: 'social_login',
      });
      await this.userRepository.save(user);
      const { access_token, refresh_token } = await this.createToken(user, deviceInfo);
      return {
        url: this.createSocialCallbackUrl(access_token, refresh_token, provider),
        access_token,
        refresh_token,
      };
    }
  }

  async forgotPassword({ email, phone_number }: ForgotPasswordDto) {
    const recipient = email ? email : phone_number;
    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { phone_number }],
    });
    if (!existingUser) {
      throw new NotFoundException('حساب کاربری یافت نشد.');
    }

    await this.otpService.sendOtp(recipient);

    return { message: 'رمز یکبار‌مصرف ارسال شد.' };
  }

  async changePassword({ email, phone_number, otp, password }: ChangePasswordDto, deviceInfo: DeviceInfo) {
    const recipient = email ? email : phone_number;

    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { phone_number }],
    });
    if (!existingUser) {
      throw new NotFoundException('حساب کاربری یافت نشد.');
    }

    await this.otpService.verifyOtp(otp, recipient);

    const hashedPassword = await this.encryptionService.hash(password);

    this.userRepository.update(existingUser.id, { password: hashedPassword });

    const token = await this.createToken(existingUser, deviceInfo);
    const profile = await this.getProfile(existingUser.id);
    return { ...token, ...profile };
  }

  async getProfile(user_id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, tokens, id, media, ...filtredUserData } = await this.userRepository.findOne({ where: { id: user_id } });

    return filtredUserData;
  }

  async updateProfile(user_id: string, updateProfileDto: UpdateProfileDto) {
    if (updateProfileDto.phone_number) {
      const existingPhoneNumber = await this.userRepository.findOne({
        where: { phone_number: updateProfileDto.phone_number },
      });
      if (existingPhoneNumber) {
        throw new ConflictException('کاربری با این شماره همراه وجود دارد، با پشتیبانی تماس بگیرید.');
      }
    }

    if (updateProfileDto.email) {
      const existingEmail = await this.userRepository.findOne({
        where: { email: updateProfileDto.email },
      });
      if (existingEmail) {
        throw new ConflictException('کاربری با این ایمیل وجود دارد، با پشتیبانی تماس بگیرید.');
      }
    }

    await this.userRepository.update(user_id, updateProfileDto);
    const profile = await this.getProfile(user_id);
    return { message: 'پروفایل بروز شد.', ...profile };
  }

  async updateAvatar(user_id: string, file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('No file uploaded', 400);
    }
    const user = await this.userRepository.findOne({ where: { id: user_id } });

    if (user.avatar_url) {
      await this.s3Service.deleteDirectory(`avatars/${user_id}`);
      await this.setAvatar(user_id, file);
    } else {
      await this.setAvatar(user_id, file);
    }
    const profile = await this.getProfile(user_id);

    return { message: 'تصویر پروفایل بروز شد.', ...profile };
  }

  async removeAvatar(user_id: string) {
    const user = await this.userRepository.findOne({ where: { id: user_id } });
    await this.s3Service.deleteDirectory(`avatars/${user.id}`);
    await this.userRepository.update(user.id, { avatar_url: '' });
    return { message: 'تصویر پروفایل حذف شد.' };
  }

  async setAvatar(user_id: string, file: Express.Multer.File) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: user_id },
      });
      const fileExtension = extname(file.originalname).toLowerCase();

      const avatar_url = await this.s3Service.uploadFile(file, `avatars/${user.id}`, `avatar${fileExtension}`);
      await this.userRepository.update(user.id, {
        avatar_url: `${avatar_url}?${Date.now()}`,
      });
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
    return { message: 'تصویر پروفایل بروز شد.' };
  }

  async createToken(user: User, deviceInfo: DeviceInfo) {
    return await this.tokenService.generateTokens(user, deviceInfo);
  }

  async refresh_token(user: any, deviceInfo: DeviceInfo) {
    return await this.tokenService.refresh_token(user.refresh_token, deviceInfo);
  }

  async logout(request: Request) {
    return await this.tokenService.revokeTokenByRequest(request);
  }

  async deleteAccount(user_id: string) {
    const user = await this.userRepository.findOne({ where: { id: user_id } });
    if (!user) throw new NotFoundException('کاربر یافت نشد.');
    return await this.userRepository.softDelete(user.id);
  }

  private createSocialCallbackUrl(access_token: string, refresh_token: string, provider: SocialLoginProvider) {
    const redirectUrl = this.configService.get<string>('SOCIAL_AUTH_FRONT_END_CALLBACK_URL');
    return `${redirectUrl}?access_token=${access_token}&refresh_token=${refresh_token}&provider=${provider}`;
  }
}
