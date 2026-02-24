import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        user: {
            id: string;
            email: string;
            username: string;
        };
        access_token: string;
    }>;
    login(dto: LoginDto): Promise<{
        user: {
            id: string;
            email: string;
            username: string;
        };
        access_token: string;
    }>;
    getMe(userId: string): Promise<{
        id: string;
        email: string;
        username: string;
        createdAt: Date;
    }>;
    private generateToken;
}
