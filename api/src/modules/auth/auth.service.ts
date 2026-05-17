import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { authResponseDto } from './dto/authResponse.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(private readonly prismaService: PrismaService,private readonly jwtService:JwtService) { }


    async register(registerDto: RegisterDto): Promise<authResponseDto> {
        console.log('registerDto', registerDto)

        const {email, password, firstName, lastName} = registerDto;
        const existingUser = await this.prismaService.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new ConflictException('User already exists');
        }
  try{
const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.prismaService.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
            },
             select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                phoneNumber:true,
                address:true,
                bio:true,
                profileImage:true,
            password:false,
          
            
            },
        });
        //Generate Access Token
        const tokens = this.generateTokens(user.id,user.email);
        //Generate Refresh Token
        // const refreshToken = this.jwtService.sign({id:user.id,email:user.email});
        // return {
        //     message: 'User registered successfully',
        //     data: user,
        // };
  }catch(error){
    throw new InternalServerErrorException('Failed to register user');
  }



    
     
}


//generate access and refresh tokens
private async generateTokens(userId:string,email:string):Promise<{accessToken:string,refreshToken:string}>{
    const payload={sub:userId,email}

const refreshId = randomBytes(32).toString('hex');
const  [accessToken,refreshToken]=await Promise.all([
    this.jwtService.signAsync(payload,{expiresIn:'15m'}),
    this.jwtService.signAsync({id:userId,refreshId},{expiresIn:'7d'}),
]);

await this.prismaService.session.create({
    data:{
        id:refreshId,
        userId:userId,
        
    }
})

 
}



}
