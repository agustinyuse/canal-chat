const fs = require("fs");

const PATH = "./messages.txt";

class Messages {
  constructor() {
    this.messages = [];
  }

  save = async () => {
    try {
      await fs.promises.writeFile(PATH, JSON.stringify(this.messages));
    } catch (error) {
      throw new Error(error);
    }
  };

  get = async () => {
    try {
      const messages = await fs.promises.readFile(PATH);
      const json = JSON.parse(messages.toString());

      return json;
    } catch {
      return [];
    }
  };
}

module.exports = new Messages();
