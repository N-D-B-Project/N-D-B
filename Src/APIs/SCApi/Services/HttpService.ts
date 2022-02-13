import fetch, { Response } from "node-fetch";

export default class HttpService {
  public async get(
    url: string | URL,
    authorization: string
  ): Promise<Response> {
    return await fetch(url.toString(), {
      method: "get",
      headers: {
        Authorization: authorization,
        Accept: "application/json",
      },
    });
  }

  public async post(
    url: string | URL,
    authorization: string,
    body?: object
  ): Promise<Response> {
    return await fetch(url.toString(), {
      method: "post",
      headers: {
        Authorization: authorization,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public async put(
    url: string | URL,
    authorization: string,
    body?: object
  ): Promise<Response> {
    return await fetch(url.toString(), {
      method: "put",
      headers: {
        Authorization: authorization,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public async delete(
    url: string | URL,
    authorization: string,
    body?: object
  ): Promise<Response> {
    return await fetch(url.toString(), {
      method: "delete",
      headers: {
        Authorization: authorization,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  }
}
