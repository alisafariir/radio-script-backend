import { Module } from '@nestjs/common';
import { I18nModule } from 'nestjs-i18n';
import { join } from 'path';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en', // Default language if the user's language is not available
      loaderOptions: {
        path: join(__dirname, '/i18n/'), // Path to your translation files
        watch: true, // Watch files for changes
      },
    }),
    // Other modules
  ],
})
export class TranslateModule {}
