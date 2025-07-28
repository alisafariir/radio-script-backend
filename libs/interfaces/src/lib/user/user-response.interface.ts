import { User } from '@/entities';
import { PaginateResponse } from '../responses/paginate-response.interface';

export type UserPaginateResponse = PaginateResponse<User[]>;
