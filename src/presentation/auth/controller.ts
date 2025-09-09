import { Request, Response } from "express";
import { CustomError, LoginUserDto, RegisterUserDto } from "../../domain";
import { AuthService } from "../services/auth.service";

export class AuthController {
  constructor(public readonly authService: AuthService) {}

  private handleError(error: Error, res: Response) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.log("error :>> ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }

  registerUser = async (req: Request, res: Response) => {
    const [error, registerUserDto] = RegisterUserDto.create(req.body);

    if (error) return res.status(400).json({ error });

    try {
      const user = await this.authService.registerUser(registerUserDto!);
      return res.json(user);
    } catch (err) {
      return this.handleError(err as Error, res);
    }
  };
  loginUser = async (req: Request, res: Response) => {
    const [error, loginUserDto] = LoginUserDto.create(req.body);

    if (error) return res.status(400).json({ error });

    try {
      const user = await this.authService.loginUser(loginUserDto!);
      return res.json(user);
    } catch (err) {
      return this.handleError(err as Error, res);
    }
  };
  validateEmail = (req: Request, res: Response) => {
    res.json({ message: "ValidateEmail" });
  };
}
