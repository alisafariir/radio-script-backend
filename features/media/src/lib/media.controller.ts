import { multerOptions } from "@/constants";
import { Roles } from "@/decorators";
import { UserRole } from "@/enums";
import { JwtAuthGuard } from "@/guards";
import {
  Controller,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { MediaService } from "./media.service";

@Controller("media")
@UseGuards(JwtAuthGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post("upload")
  @UseInterceptors(FilesInterceptor("file", 10, multerOptions))
  async uploadFile(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req: Request
  ) {
    const user_id = req["user"]["sub"];
    return this.mediaService.uploadFile(files, user_id);
  }
}
