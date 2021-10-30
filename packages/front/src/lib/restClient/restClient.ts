import { HttpError } from "@lib/exception/HttpError"
import axios, { AxiosError, AxiosRequestConfig } from "axios"
import { NetworkError } from "@lib/exception/NetworkError"

export interface RestClientInterface {
  get: <Res>(path: string) => Promise<Res>
  post: <Req, Res>(path: string, body: Req) => Promise<Res>
  postForm: <Res>(path: string, formData: FormData) => Promise<Res>
  patch: <Req, Res>(path: string, body: Req) => Promise<Res>
  put: <Req, Res>(path: string, body: Req) => Promise<Res>
  delete: (path: string) => Promise<void>
  setIdToken: (idToken: string) => void
}

// TODO:API_ORIGIN決まり次第ここに定義
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""

export class RestClient implements RestClientInterface {
  static instance: RestClient | null
  private constructor(private idToken?: string) {}

  static getInstance(idToken?: string) {
    if (RestClient.instance == null) {
      RestClient.instance = new RestClient(idToken)
    }
    return RestClient.instance
  }

  public async get<Res>(path: string): Promise<Res> {
    return await axios
      .get<{ data: Res }>(path, this.requestConfig())
      .catch(this.errorHandling)
      .then((res) => res.data.data)
  }

  public async post<Req, Res>(path: string, body: Req): Promise<Res> {
    return await axios
      .post<{ data: Res }>(path, body, this.requestConfig())
      .catch(this.errorHandling)
      .then((res) => res.data.data)
  }

  public async postForm<FormData, Res>(
    path: string,
    formData: FormData,
  ): Promise<Res> {
    return await axios
      .post<{ data: Res }>(path, formData, this.requestConfig(true))
      .catch(this.errorHandling)
      .then((res) => res.data.data)
  }

  public async patch<Req, Res>(path: string, body: Req): Promise<Res> {
    return await axios
      .patch<{ data: Res }>(path, body, this.requestConfig())
      .catch(this.errorHandling)
      .then((res) => res.data.data)
  }

  public async put<Req, Res>(path: string, body: Req): Promise<Res> {
    return await axios
      .put<{ data: Res }>(path, body, this.requestConfig())
      .catch(this.errorHandling)
      .then((res) => res.data.data)
  }

  public async delete(path: string): Promise<void> {
    return await axios
      .delete<void>(path, this.requestConfig())
      .catch(this.errorHandling)
      .then((res) => res.data)
  }

  public setIdToken(idToken?: string) {
    this.idToken = idToken
  }

  private requestConfig(isBinary = false): AxiosRequestConfig {
    const authorization =
      this.idToken != null ? { Authorization: `Bearer ${this.idToken}` } : null
    return {
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": isBinary ? "multipart/form-data" : "application/json",
        ...authorization,
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

export const getClient = (idToken?: string): RestClientInterface => {
  return RestClient.getInstance(idToken)
}
