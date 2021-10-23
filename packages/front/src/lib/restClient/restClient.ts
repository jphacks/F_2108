import { HttpError } from "@lib/exception/HttpError"
import axios, { AxiosError, AxiosRequestConfig } from "axios"
import { NetworkError } from "@lib/exception/NetworkError"

export interface RestClientInterface {
  get: <Res>(path: string) => Promise<Res>
  post: <Req, Res>(path: string, body: Req) => Promise<Res>
  patch: <Req, Res>(path: string, body: Req) => Promise<Res>
  put: <Req, Res>(path: string, body: Req) => Promise<Res>
  delete: (path: string) => Promise<void>
}

// TODO:API_ORIGIN決まり次第ここに定義
const API_ORIGIN: string = "https://hogehogehoge" || ""

export class RestClient implements RestClientInterface {
  async get<Res>(path: string): Promise<Res> {
    return await axios
      .get<Res>(path, this.requestConfig)
      .catch(this.errorHandling)
      .then((res) => res.data)
  }

  async post<Req, Res>(path: string, body: Req): Promise<Res> {
    return await axios
      .post<Res>(path, body, this.requestConfig)
      .catch(this.errorHandling)
      .then((res) => res.data)
  }

  async patch<Req, Res>(path: string, body: Req): Promise<Res> {
    return await axios
      .patch<Res>(path, body, this.requestConfig)
      .catch(this.errorHandling)
      .then((res) => res.data)
  }

  async put<Req, Res>(path: string, body: Req): Promise<Res> {
    return await axios
      .put<Res>(path, body, this.requestConfig)
      .catch(this.errorHandling)
      .then((res) => res.data)
  }

  async delete(path: string): Promise<void> {
    return await axios
      .delete<void>(path, this.requestConfig)
      .catch(this.errorHandling)
      .then((res) => res.data)
  }

  private get requestConfig(): AxiosRequestConfig {
    return {
      baseURL: API_ORIGIN,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    }
  }

  private errorHandling(error: AxiosError): never {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          throw new HttpError(400, error.message)
        case 401:
          throw new HttpError(401, error.message)
        case 403:
          throw new HttpError(401, error.message)
        case 404:
          throw new HttpError(404, error.message)
        case 500:
          throw new HttpError(500, error.message)
        default:
          throw new Error(error.message)
      }
    } else if (error.request) {
      throw new NetworkError(error.message)
    } else {
      throw new Error(error.message)
    }
  }
}

export const getClient = (): RestClientInterface => {
  return new RestClient()
}
