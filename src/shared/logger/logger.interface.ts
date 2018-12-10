export interface ILogger {
  info: (...args: any[]) => void;
  error: (...args: any[]) => void;
  verbose: (...args: any[]) => void;
  debug: (...args: any[]) => void;
  stream: {
    write: (...args: any[]) => void;
  };
}