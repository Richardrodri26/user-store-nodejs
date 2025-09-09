import jwt, { SignOptions } from 'jsonwebtoken';
import { envs } from './envs';

const JWT_SEED = envs.JWT_SEED

export class JwtAdapter {
  
  static async  generateToken(payload: Record<string, any>, duration: string = "2h"): Promise<string | null> {
    
    return new Promise(resolve => {
      jwt.sign(payload, JWT_SEED, { expiresIn: duration } as SignOptions, (err, token) => {
        if (err) return resolve(null);
        resolve(token || null);
      });

    })


  }

  static validateToken(token: string) {
    throw new Error('Method not implemented.');
  }

}