import * as apis from "../api";

const client = {
  login: new apis.LoginApi(),
  logout: new apis.LogoutApi(),
  users: new apis.UsersApi(),
};

export default client;
