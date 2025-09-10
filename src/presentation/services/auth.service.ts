import { bcryptAdapter, envs, JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError, LoginUserDto, UserEntity } from "../../domain";
import { RegisterUserDto } from "../../domain/dtos/auth/register-user.dto";
import { EmailService } from "./email.service";

export class AuthService {
  constructor(
    private readonly emailService: EmailService
  ) {}

  public async registerUser(registerUserDto: RegisterUserDto) {
    const existUser = await UserModel.findOne({ email: registerUserDto.email });

    if (existUser) throw CustomError.badRequest("Email already exists");

    try {
      const user = new UserModel(registerUserDto);

      // Encriptar la contrasena
      user.password = await bcryptAdapter.hash(registerUserDto.password);

      await user.save();
      // JWT <--- para mantener la autenticacion del usuario

      // Email de confirmacion
      await this.sendEmailValidationLink(user.email);

      const { password, ...userEntity } = UserEntity.fromObject(user);

      const token = await JwtAdapter.generateToken({
        id: user.id,
        email: user.email,
      });

      if (!token) throw CustomError.internalServer("Error generating token");

      return {
        user: userEntity,
        token,
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async loginUser(loginUserDto: LoginUserDto) {
    const user = await UserModel.findOne({ email: loginUserDto.email });

    if (!user) throw CustomError.badRequest("Email not exists");

    const isMatching = bcryptAdapter.compare(
      loginUserDto.password,
      user.password
    );

    if (!isMatching) throw CustomError.badRequest("Password is not valid");

    const { password, ...userEntity } = UserEntity.fromObject(user);

    const token = await JwtAdapter.generateToken({
      id: user.id,
      email: user.email,
    });

    if (!token) throw CustomError.internalServer("Error generating token");

    return {
      user: userEntity,
      token,
    };
  }

  private sendEmailValidationLink = async ( email: string ) => {

    const token = await JwtAdapter.generateToken({ email }, '15m');

    if (!token) throw CustomError.internalServer("Error generating token");

    const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;

    const html = `
      <h1>Email Verification</h1>
      <p>Click on the following link to validate your email</p>
      <a href="${link}">Validate your email: ${link}</a>
    `;

    const options = {
      to: email,
      subject: "Email Verification",
      htmlBody: html
    }

    const isSent = await this.emailService.sendEmail(options);

    if (!isSent) throw CustomError.internalServer("Error sending email");

    return true;

  }

  validateEmail = async ( token: string ) => {
    const payload = await JwtAdapter.validateToken<{ email: string }>(token);

    if (!payload) throw CustomError.badRequest("Invalid token");

    const { email } = payload;

    if (!email) throw CustomError.internalServer("Email not in token");

    const user = await UserModel.findOne({ email });

    if (!user) throw CustomError.internalServer("User not found");

    user.emailValidated = true;
    await user.save();
    return true;
  }

}
