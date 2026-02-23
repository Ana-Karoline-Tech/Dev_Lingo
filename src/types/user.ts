export type CreateUserProfileInput = {
  name: string;
  email: string;
  password?: string;
};

export type CreateUserProfileResult =
  | { success: true; data: unknown }
  | { success: false; error: string };

export type RegisterUserInput = {
  name: string;
  email: string;
  password: string;
};

export type RegisterUserResult =
  | { success: true; data: { user: unknown; profile: unknown } }
  | { success: false; error: string };
