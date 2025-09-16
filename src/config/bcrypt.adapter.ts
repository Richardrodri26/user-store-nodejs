import { compareSync, genSaltSync, hashSync } from 'bcryptjs';


export const bcryptAdapter = {

  // synchronous hash helper — returns string immediately
  hash: (password: string) => {
    const salt = genSaltSync();

    return hashSync(password, salt);
  },

  compare: (password: string, hash: string) => {
    return compareSync(password, hash);
  },

}