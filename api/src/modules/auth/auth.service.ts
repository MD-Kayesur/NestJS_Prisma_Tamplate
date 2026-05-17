import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { authResponseDto } from './dto/authResponse.dto';

@Injectable()
export class AuthService {

    constructor(private readonly prismaService: PrismaService) { }


    async register(registerDto: RegisterDto): Promise<authResponseDto> {
        console.log('registerDto', registerDto)

        const {email, password, firstName, lastName} = registerDto;
        const existingUser = await this.prismaService.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new Error('User already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.prismaService.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
            },
        });
        return {
            message: 'User registered successfully',
            data: user,
        };
    }

}
