import NDBClient from "@Client/NDBClient";

export default class Tools {
  public constructor(private client: NDBClient) {
    this.client = client;
  }

  static getMomentFormat(
    mode: "time" | "calendar" = "calendar",
    lang = "pt-BR"
  ): string {
    switch (mode) {
      case "calendar":
        if (lang === "pt-BR") return "DD/MM/YYYY | LTS";
        else return "DD-MM-YYYY LTS";

      case "time":
        if (lang === "pt-BR") return "L";
        else return "DD-MM-YYYY LTS";
    }
  }
}
