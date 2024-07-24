import { Socket } from 'socket.io';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import UserModel from '@models/user.model';
import cookie from 'cookie';
import { User } from "@models/user.model";


const parseCookies = (cookieString: string | undefined) => {
  if (!cookieString) return {};
  return cookie.parse(cookieString);
};

/**
 * check if the user is authenticated before allowing the socket connection
 * @param socket the socket connection
 */
export const authenticateSocket = async (socket: Socket): Promise<User> => {
  const cookies = parseCookies(socket.handshake.headers.cookie);
  const token = cookies.token;

  if (!token || !process.env.JWT_SECRET) {
    return Promise.reject('Unauthorized');
  }

  return new Promise((resolve, reject) => {
    if(!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not defined in .env file');
    jwt.verify(token, process.env.JWT_SECRET, async (err: VerifyErrors | null, decoded: any) => {
      if (err) {
        reject('Unauthorized');
      } else {
        try {
          const user = await UserModel.findById(decoded.id) as User;
          if ( !user) {
            reject('Unauthorized');
          } else {
            resolve(user);
          }
        } catch (error) {
          reject('Unauthorized');
        }
      }
    });
  });
};