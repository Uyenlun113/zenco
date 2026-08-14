import { Controller, Get, Put, Body } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { Setting } from './schemas/setting.schema';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async getSettings(): Promise<Setting> {
    return this.settingsService.getSettings();
  }

  @Put()
  async updateSettings(@Body() body: Partial<Setting>): Promise<Setting> {
    return this.settingsService.updateSettings(body);
  }
}
