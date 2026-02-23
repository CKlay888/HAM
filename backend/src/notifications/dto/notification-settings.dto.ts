import { IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class NotificationTypesDto {
  @IsBoolean()
  @IsOptional()
  purchase?: boolean;

  @IsBoolean()
  @IsOptional()
  review?: boolean;

  @IsBoolean()
  @IsOptional()
  system?: boolean;

  @IsBoolean()
  @IsOptional()
  promotion?: boolean;
}

export class NotificationSettingsDto {
  @IsBoolean()
  @IsOptional()
  emailEnabled?: boolean;

  @IsBoolean()
  @IsOptional()
  pushEnabled?: boolean;

  @ValidateNested()
  @Type(() => NotificationTypesDto)
  @IsOptional()
  types?: NotificationTypesDto;
}
