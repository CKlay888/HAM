import { IsString, IsOptional, MinLength, MaxLength, IsUrl } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsOptional()
  username?: string;

  @IsString()
  @MaxLength(200)
  @IsOptional()
  bio?: string;

  @IsUrl()
  @IsOptional()
  avatar?: string;
}
