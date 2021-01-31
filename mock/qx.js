export default [
  // user login
  // {
  //   url: "/vue-admin-template/user/login",
  //   type: "post",
  //   response: config => {
  //     const { account } = config.body;
  //     const token = tokens[account];
  //     // mock error
  //     if (!token) {
  //       return {
  //         code: 60204,
  //         message: "Account and password are incorrect."
  //       };
  //     }

  //     return {
  //       code: 0,
  //       data: token
  //     };
  //   }
  // },
  // get user info
  {
    url: "/qx/getMap",
    type: "get",
    response: config => {
      // const token = config.headers["x-token"];

      return {
        code: 0,
        data: {
          name: "57818",
          value: 25.6
        }
      };
    }
  }
];
