// data Transfer Object (Dto) for user registration

import {IsString,IsEmail, MinLength, IsNotEmpty, matches, IsStrongPassword} from 'class-validator'


export class RegisterDto {
    @IsString()
    @IsEmail({}, {message:'Please enter valid email address'})
    @IsNotEmpty({message:'Email is required'})
    email:string;

    @IsString()
    @MinLength(6, {message:'Password must be at least 6 characters long'})
    @IsNotEmpty({message:'Password is required'})
    @IsStrongPassword({minLength:6,minLowercase:1,minUppercase:1,minNumbers:1,minSymbols:1}, {message:'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'})
    password:string;

    @IsString()
    @MinLength(2, {message:'First name must be at least 2 characters long'})
    @IsNotEmpty({message:'First name is required'})
    firstName:string;

    @IsString()
    @MinLength(2, {message:'Last name must be at least 2 characters long'})
    @IsNotEmpty({message:'Last name is required'})
    lastName:string;
    
    
}

