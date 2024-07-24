import { IsMongoId, IsNotEmpty, IsEmail, IsEnum, IsString, Matches, MinLength } from "class-validator";
import { Role } from "@interfaces/user.interface";


export class RegisterUserDto {
  @IsMongoId()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum(Role)
  role: Role;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/.*[a-z].*/, {
    message: "Password must contain at least one lowercase letter",
  })
  @Matches(/.*\d.*/, {
    message: "Password must contain at least one digit",
  })
  @Matches(/.*[A-Z].*/, {
    message: "Password must contain at least one uppercase letter",
  })
  @Matches(/.*([!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+).*/, {
    message: "Password must contain at least one special character",
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;
}

export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}