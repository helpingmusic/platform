export interface IGoogleProfile {
  id: string;
  emails: Array<{ value: string; }>;
  _json: {
    id: string;
  };

  name: {
    givenName: string;
    familyName: string;
  };
}