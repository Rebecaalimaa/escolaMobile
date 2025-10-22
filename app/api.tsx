export default class Api {
  uri: string = "http://10.87.202.159:3000";

  get login() {
    return `${this.uri}/login`;
  }

  get turma() {
    return `${this.uri}/turma`;
  }
}
