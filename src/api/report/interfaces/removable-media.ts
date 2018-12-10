export interface IRemovableMedia {
  remove: () => Promise<any>;
  show: () => Promise<any>;
}