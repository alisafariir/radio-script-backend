export interface Login {
  access_token: string;
  refresh_token: string;
  first_name: string;
  last_name: string;
  bio: string;
  picture: string;
  email: string;
  phone_number: string;
  blocked: boolean;
  block_reason: string;
}
