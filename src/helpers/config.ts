export class Config {
  static getDb(initName: string) {
    return `${initName}_db`;
  }
}
