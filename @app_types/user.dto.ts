export interface LoginUserDTO {
  username: string;
  password: string;
}

export interface CreateUserDTO extends LoginUserDTO {}

export interface UserResponse {
  id: string;
  username: string;
}
