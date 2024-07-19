import { User } from '../schemas/user.schema';

export interface JwtPayload {
  id: string;
  user: User;
  // TODO: añadir todo lo que quieran grabar.
}
