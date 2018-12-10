export interface IFacebookProfile {
  id: string;
  emails: Array<{
    value: string;
  }>;
  displayName: string;
  photos: Array<{
    value: string;
  }>;
  _json: string;
  profileUrl: string;
}