import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
    getMe(req: any): Promise<{
        id: string;
        email: string;
        username: string;
        createdAt: Date;
    }>;
}
