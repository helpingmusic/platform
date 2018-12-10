export class CommandResult {
  successful: boolean;
  error: any;
  data: any;

  constructor(success, data) {
    this.successful = success;
    if (success) {
      this.data = data;
    } else {
      this.error = data;
    }
  }
}