//jwt tokens for auth requests

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { PrismaService } from "src/prisma/prisma.service";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(  private prisma:PrismaService,
        private config:ConfigService,){


      
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey:  ConfigService.get<string>('JWT_SECRET'),
        });
    }
    async validate(payload: {sub:string,email:string}) {
 const user = await this.prisma.user.findUnique({
    where:{id:payload.sub},
    select:{
        id:true,
        email:true,
        firstName:true,
        lastName:true,
        role:true,
        phoneNumber:true,
        address:true,
        bio:true,
        profileImage:true,
    }
 })
 if(!user){
    throw new UnauthorizedException();
 }   
 return user;
    }
}
