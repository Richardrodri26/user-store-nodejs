import { Request, Response } from 'express';

export class AuthController {

  constructor() {};

  registerUser = (req: Request, res: Response) => {


    res.json({ message: 'RegisterUser' });
  }
  loginUser = (req: Request, res: Response) => {


    res.json({ message: 'LoginUser' });
  }
  validateEmail = (req: Request, res: Response) => {


    res.json({ message: 'ValidateEmail' });
  }

}