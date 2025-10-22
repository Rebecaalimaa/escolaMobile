export default class Api {
  uri: string = "http://192.168.1.170:3000";

  get login() {
    return `${this.uri}/login`;
  }

  get turma() {
    return `${this.uri}/turma`;

  }
  get atividade() {
    return `${this.uri}/atividade`;
  }
}
