import { User } from './entities/user.entity';
export declare class UsersService {
    private users;
    findByEmail(email: string): Promise<User | undefined>;
    findById(id: string): Promise<User | undefined>;
    create(email: string, username: string, password: string): Promise<User>;
    validatePassword(user: User, password: string): Promise<boolean>;
}
