export interface JwtPayload {
  _id: string;
  role: string;
  active_until: Date;
}