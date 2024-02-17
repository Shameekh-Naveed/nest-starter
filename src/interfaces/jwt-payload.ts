import { UserRole } from 'src/enums/user-role.enum';
import Stripe from 'stripe';

export interface JwtPayload {
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole | string;
    phoneNumber: string;
    profilePicture: string;
  };
  roles: string[];
}
