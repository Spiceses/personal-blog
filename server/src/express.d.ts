import { IUserDocument } from "./models/User.js"; // 确保导入类型

declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument;
      // 如果未来有其他扩展，也可以加在这里
      // session?: ISessionData;
    }
  }
}
