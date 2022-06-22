import * as apis from "../../api";
import {
  FetchParams,
  LoginCreateRequest,
  Middleware,
  ResponseContext,
} from "../../api";
import { deleteCookie, getCookie, setCookie } from "../cookie";

// @TODO: revise this approach. There are more secure options than storing the auth token in plain on a cookie
const AUTH_COOKIE_NAME = "couchers_auth_token";

class AuthTokenMiddleware implements Middleware {
  public async pre(context: ResponseContext): Promise<FetchParams | void> {
    const accessToken = await this.acquireToken();
    return {
      url: context.url,
      init: {
        ...context.init,
        headers: new Headers({
          ...context.init.headers,
          ...(accessToken ? { Authorization: `Token ${accessToken}` } : {}),
        }),
      },
    };
  }

  public post(context: ResponseContext): Promise<Response | void> {
    return Promise.resolve(context.response);
  }

  private acquireToken(): Promise<string | undefined> {
    return Promise.resolve().then(() => {
      const authToken = getCookie(AUTH_COOKIE_NAME);
      return authToken;
    });
  }
}

const configuration = new apis.Configuration({
  basePath: "https://backend-v2-dev.couchers.dev", // @todo: dehardcode this into an env var
  middleware: [new AuthTokenMiddleware()],
});

const client = {
  login: (parameters: LoginCreateRequest) => {
    const loginApi = new apis.LoginApi(configuration);
    return loginApi.loginCreate(parameters).then((response) => {
      /* @ts-ignore */
      setCookie(AUTH_COOKIE_NAME, response.auth_token || "");
      return response;
    });
  },
  logout: () => {
    const logoutApi = new apis.LogoutApi(configuration);
    return logoutApi.logoutCreate().then((response) => {
      deleteCookie(AUTH_COOKIE_NAME);
      return response;
    });
  },
  users: new apis.UsersApi(configuration),
  languages: new apis.LanguagesApi(configuration),
};

export default client;
