export type userInfo = {
  username: string;
  discriminator: string;
  userId: string;
  avatar: string;
  email: string;
  accessToken: string;
  refreshToken: string;
};

export type Done = (err: Error, user: User) => void;

export type PartialGuild = {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
  permissions: string;
  features: string[];
};
