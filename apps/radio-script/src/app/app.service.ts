import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getData(): { message: string } {
    console.log(
      this.configService.get<number>("SMTP_HOST"),
      this.configService.get<number>("SMTP_PORT")
    );
    console.log("ENVS:", process.env);
    return { message: `${this.configService.get<string>("APP_NAME")} 👋` };
  }
}
