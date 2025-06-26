###### 项目结构

```
my-react-ts-app/
├── dist/                   # Webpack 打包后的生产环境文件
├── node_modules/           # 项目依赖
├── public/                 # 静态资源 (会被直接复制到 dist 目录)
│   ├── index.html          # 应用的 HTML 入口文件
│   ├── favicon.ico         # 网站图标
│   └── manifest.json       # PWA 配置文件
│   └── ...                 # 其他静态文件 (如 robots.txt, 图片等)
├── src/                    # 项目源码
│   ├── @types/             # (可选) 自定义类型声明或第三方库的类型补充
│   │   └── global.d.ts     # 全局类型声明 (例如，声明 CSS Modules, 图片导入等)
│   │   └── some-library.d.ts # 某个没有官方 @types 包的库的声明
│   ├── assets/             # 静态资源 (会被 Webpack 处理，如图片、字体等)
│   │   ├── images/
│   │   ├── fonts/
│   │   └── svgs/
│   ├── components/         # 可复用的 UI 组件 (展示型组件)
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.module.scss  # CSS Modules (或 .css, .less, styled-components)
│   │   │   ├── Button.stories.tsx  # (可选) Storybook 文件
│   │   │   └── Button.test.tsx     # (可选) 单元测试文件
│   │   └── ...
│   ├── constants/          # 应用常量 (如 API 地址、事件名、固定配置等)
│   │   └── index.ts
│   ├── contexts/           # React Context API 相关文件
│   │   └── ThemeContext.tsx
│   ├── features/           # (可选，推荐用于中大型应用) 基于特性的模块组织
│   │   └── User/
│   │       ├── components/     # 此特性独有的组件
│   │       ├── hooks/          # 此特性独有的 Hooks
│   │       ├── services/       # 此特性的 API 请求 (例如 userService.ts)
│   │       ├── slices/         # (如果使用 Redux Toolkit) UserSlice.ts
│   │       ├── types/          # 此特性相关的 TypeScript 类型和接口
│   │       ├── utils/          # 此特性相关的工具函数
│   │       └── index.ts        # 特性模块的入口/导出文件
│   ├── hooks/              # 自定义 React Hooks (全局可复用)
│   │   └── useDebounce.ts
│   ├── layouts/            # 布局组件 (如页面头部、底部、侧边栏等)
│   │   ├── MainLayout/
│   │   │   ├── MainLayout.tsx
│   │   │   └── MainLayout.module.scss
│   ├── pages/              # 页面级组件 (通常与路由对应，可作为容器型组件)
│   │   ├── HomePage/
│   │   │   ├── HomePage.tsx
│   │   │   └── HomePage.module.scss
│   │   ├── AboutPage/
│   │   │   ├── AboutPage.tsx
│   │   │   └── AboutPage.module.scss
│   │   └── ...
│   ├── services/           # API 请求服务 (全局配置或与特性无关的 API)
│   │   ├── apiClient.ts      # API 客户端实例 (如 axios 实例)
│   │   └── authService.ts
│   ├── store/              # 状态管理 (如 Redux, Zustand, Jotai)
│   │   ├── index.ts          # store 的入口和配置
│   │   ├── slices/         # (如果使用 Redux Toolkit)
│   │   │   └── counterSlice.ts
│   │   └── rootReducer.ts    # (如果使用原生 Redux)
│   ├── styles/             # 全局样式、主题、CSS变量等
│   │   ├── _variables.scss   # SCSS 变量、mixins (如果使用 SCSS)
│   │   ├── global.scss       # 全局样式
│   │   └── theme.ts          # 主题对象 (例如用于 styled-components 或 Material-UI)
│   ├── types/              # 全局共享的 TypeScript 类型和接口
│   │   └── index.ts
│   ├── utils/              # 工具函数 (全局可复用)
│   │   └── formatters.ts
│   ├── App.tsx               # 应用主组件 (通常包含路由配置)
│   ├── index.tsx             # 应用入口文件 (将 App 组件渲染到 DOM)
│   ├── reportWebVitals.ts    # (可选) 性能报告 (Create React App 默认包含)
│   └── setupTests.ts       # (可选) 测试环境配置文件 (如 Jest, React Testing Library)
├── webpack/                # (可选) 如果 Webpack 配置复杂，可以拆分到此目录
│   ├── webpack.common.js   # 通用配置
│   ├── webpack.dev.js      # 开发环境配置
│   ├── webpack.prod.js     # 生产环境配置
│   └── paths.js            # (可选) 路径常量
├── .babelrc                # Babel 配置文件 (或 babel.config.js, 或在 package.json 中配置)
├── .editorconfig           # 编辑器配置文件，用于统一代码风格
├── .env                    # (Git 会忽略此文件) 本地环境变量
├── .env.example            # 环境变量示例文件
├── .eslintignore           # ESLint 忽略检查的文件和目录
├── .eslintrc.js            # ESLint 配置文件 (或 .json, .yaml, .cjs)
├── .gitignore              # Git 忽略提交的文件和目录
├── .prettierrc.js          # Prettier 配置文件 (或 .json, .yaml, .toml)
├── jest.config.js          # (如果使用 Jest) Jest 测试框架配置文件
├── package.json            # 项目元数据和依赖管理
├── package-lock.json       # (或 yarn.lock, pnpm-lock.yaml) 依赖版本锁定文件
├── README.md               # 项目说明文档
├── tsconfig.json           # TypeScript 编译器配置文件
└── webpack.config.js       # Webpack 配置文件 (如果未拆分到 webpack/ 目录)
```

##### design

###### Empathize

- 不知道怎么展示自己
  - 性格
  - 爱好
  - 理想
- 背景选什么
  - 颜色
  - 图案
  - 贴纸
- 组件如何设计

###### Define

亲和图

###### Ideate

- profile 组件, 展示自己的性格, 爱好, 理想

###### Prototype

###### Test

##### 页面

###### home

- 导航栏

- 自我介绍

  狼与香辛料, 绘制香辛料的小故事介绍自己的名字

  - 性格
    - 冷淡而真诚
  - 爱好
    - 游泳
    - 音乐
  - 志向
    - 拯救世界

###### about me

###### blog

###### love story

###### friends

#### api

###### get /api/posts

成功响应 200 OK

```json
{
  "success": true,
  "data": [
    {
      "_id": "mongooseObjectId1",
      "title": "文章标题1",
      "slug": "wen-zhang-biao-ti-1",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    },
    {
      "_id": "mongooseObjectId2",
      "title": "文章标题2",
      "slug": "wen-zhang-biao-ti-2",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  ]
}
```

错误响应

- 500 Internal Server Error

```json
{
  "success": false,
  "error": {
    "message": "服务器发生了一个意外错误。"
  }
}
```

###### get /api/posts/:slug

成功响应 200 OK

```json
{
  "success": true,
  "data": {
    "_id": "mongooseObjectId",
    "title": "文章标题",
    "slug": "wen-zhang-biao-ti",
    "markdownContent": "这是文章的完整 Markdown 内容...",
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
}
```

错误响应

- `404 Not Found`: 如果具有给定 `id` 或 `slug` 的文章不存在。

  ```json
  {
    "success": false,
    "error": {
      "message": "文章未找到。"
    }
  }
  ```

- 500 Internal Server Error

  ```json
  {
    "success": false,
    "error": {
      "message": "服务器发生了一个意外错误。"
    }
  }
  ```

###### post /api/posts(/md)

Request Body

```json
{
  "title": "你的文章标题",
  "markdownContent": "你的文章 Markdown 内容"
}
```

成功响应

状态码: `201 Created`

```json
{
  "success": true,
  "data": {
    "_id": "generatedObjectId",
    "title": "你的文章标题",
    "slug": "ni-de-wen-zhang-biao-ti",
    "markdownContent": "你的文章 Markdown 内容",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

错误响应

状态码:

- 400 Bad Request 如果请求数据不符合要求（例如，`title` 或 `markdownContent` 缺失）。

  ```json
  {
    "success": false,
    "error": {
      "message": "请求数据不符合要求。"
    }
  }
  ```

- 500 Internal Server Error

  ```json
  {
    "success": false,
    "error": {
      "message": "服务器发生了一个意外错误。"
    }
  }
  ```

###### post /api/posts/zip

请求体

zip 文件

成功响应

状态码: `201 Created`

```json
{
  "success": true,
  "data": {
    "_id": "generatedObjectId",
    "title": "你的文章标题",
    "slug": "ni-de-wen-zhang-biao-ti",
    "markdownContent": "你的文章 Markdown 内容",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

错误响应

状态码:

- 400 Bad Request 如果请求数据不符合要求（例如，压缩包不包含 md 文件或者存在多个 md 文件, 或者md文件不包含yaml头 ）。

  ```json
  {
    "success": false,
    "error": {
      "message": "压缩包未包含.md文件。"
    }
  }
  ```

- 500 Internal Server Error

  ```json
  {
    "success": false,
    "error": {
      "message": `Expected 1 markdown file in the zip, but found ${markdownFiles.length}.`,
    }
  }
  ```

##### prompt

我的代码如下

###### package.json

{

 "name": "spices-server",

 "version": "1.0.0",

 "private": true,

 "type": "module",

 "main": "./dist/server.js",

 "scripts": {

  "start": "nodemon",

  "test": "node --experimental-vm-modules node_modules/jest/bin/jest.js"

 },

 "keywords": [],

 "author": "",

 "license": "ISC",

 "description": "",

 "dependencies": {

  "adm-zip": "^0.5.16",

  "ali-oss": "^6.23.0",

  "cors": "^2.8.5",

  "dotenv": "^16.5.0",

  "express": "^5.1.0",

  "gray-matter": "^4.0.3",

  "mongodb": "^6.17.0",

  "mongoose": "^8.15.1",

  "multer": "^2.0.1",

  "slugify": "^1.6.6",

  "uuid": "^11.1.0"

 },

 "devDependencies": {

  "@types/adm-zip": "^0.5.7",

  "@types/ali-oss": "^6.16.11",

  "@types/cors": "^2.8.19",

  "@types/express": "^5.0.3",

  "@types/jest": "^30.0.0",

  "@types/mongoose": "^5.11.96",

  "@types/multer": "^1.4.13",

  "@types/node": "^22.15.33",

  "@types/supertest": "^6.0.3",

  "cross-env": "^7.0.3",

  "esbuild": "^0.25.5",

  "jest": "^30.0.3",

  "supertest": "^7.1.1",

  "ts-jest": "^29.4.0",

  "ts-node": "^10.9.2",

  "tsx": "^4.19.4",

  "typescript": "^5.8.3"

 }

}

{

 "compilerOptions": {

  "module": "NodeNext",

  "moduleResolution": "NodeNext",

  "target": "ES2022",

  "esModuleInterop": true,

  "allowSyntheticDefaultImports": true,

  "strict": true,

  "forceConsistentCasingInFileNames": true,

  "isolatedModules": true,

  "outDir": "./dist",

  "rootDir": "./src",

 },

 "ts-node": {

  "esm": true

 },

 "include": ["src/**/*.ts"],

 "exclude": ["node_modules", "dist", "tests"]

}

###### tsconfig.json

{

 "compilerOptions": {

  "module": "NodeNext",

  "moduleResolution": "NodeNext",

  "target": "ES2022",

  "esModuleInterop": true,

  "allowSyntheticDefaultImports": true,

  "strict": true,

  "forceConsistentCasingInFileNames": true,

  "isolatedModules": true,

  "outDir": "./dist",

  "rootDir": "./src",

 },

 "ts-node": {

  "esm": true

 },

 "include": ["src/**/*.ts"],

 "exclude": ["node_modules", "dist", "tests"]

}

###### tsconfig.jest.json

// tsconfig.jest.json

{

 // 关键：继承基础配置

 "extends": "./tsconfig.json",

 "compilerOptions": {

  // 关键：为测试环境添加 jest 的类型

  "types": ["jest", "node"]

 },

 // 关键：告诉 TS 编译器，测试文件也属于这个 "项目"

 "include": ["src/**/*.ts", "tests/**/*.ts"]

}

###### jest.config.ts

```ts
// jest.config.ts
import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  moduleFileExtensions: ["js", "ts", "json", "node"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        // 关键：指定使用哪个 tsconfig 文件
        tsconfig: "tsconfig.jest.json",
        useESM: true,
      },
    ],
  },
  // 这个配置项告诉 Jest 如何处理模块导入路径
  moduleNameMapper: {
    // 这条规则使用正则表达式匹配所有以 '.js' 结尾的相对导入
    // 然后将 '.js' 替换掉，让 ts-jest 能够找到并处理对应的 '.ts' 源文件
    // 例如，它会将 './my-module.js' 的导入请求映射到 './my-module.ts'
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};

export default config;

```



###### src/models/Post.ts

import mongoose, { Schema, Document } from "mongoose";

import slugify from "slugify";

export interface IPost extends Document {

 title: string;

 slug: string;

 markdownContent: string;

 createdAt: Date;

 updatedAt: Date;

}

const PostSchema = new Schema(

 {

  title: {

   type: String,

   required: [true, "标题不能为空"],

   trim: true,

   maxLength: [150, "标题不能超过150个字符"],

  },

  slug: {

   type: String,

   unique: true,

   lowercase: true,

   trim: true,

  },

  markdownContent: { type: String, required: [true, "post内容不能为空"] },

 },

 { timestamps: true }

);

PostSchema.pre<IPost>("save", function (next) {

 if ((this.isModified("title") || this.isNew) && this.title) {

  this.slug = slugify.default(this.title, {

   lower: true,

   strict: true,

   replacement: "-",

   remove: /[*+~.()'"!:@]/g,

  });

 }

 next();

});

const Post = mongoose.model<IPost>("Post", PostSchema);

export default Post;

###### tests/unit/services/post.service.test.ts

// tests/unit/services/post.service.test.ts

import { jest, describe, test, expect, afterEach } from "@jest/globals";

import { postService } from "../../../src/services/post.service"; // 导入我们要测试的服务实例

import Post from "../../../src/models/Post.js"; // 导入我们需要模拟的 Mongoose 模型

// 告诉 Jest: 当代码中导入 Post 模型时，使用一个假的 (mock) 版本替代。

// 注意：因为你的源码中是 import ... from '../models/Post.js'，所以这里也要带 .js 后缀。

jest.mock("../../../src/models/Post.js");

describe("PostService - getAllPosts", () => {

 // 在每次测试后，清除 mock 的使用记录

 afterEach(() => {

  jest.clearAllMocks();

 });

 test("应该调用 Post.find 并返回文章列表", async () => {

  // 1. 准备 (Arrange)

  // 创建一组假的返回数据，模拟数据库中存储的内容

  const fakePostList = [

   {

​    title: "文章标题1",

​    slug: "wen-zhang-biao-ti-1",

​    createdAt: new Date(),

​    updatedAt: new Date(),

   },

   {

​    title: "文章标题2",

​    slug: "wen-zhang-biao-ti-2",

​    createdAt: new Date(),

​    updatedAt: new Date(),

   },

  ];

  // 配置我们的假 Post 模型：

  // 当 Post.find 方法被调用时，让它“假装”异步操作成功，并返回我们的假数据。

  (Post.find as jest.Mock).mockResolvedValue(fakePostList);

  // 2. 执行 (Act)

  // 调用我们真正要测试的 getAllPosts 方法

  const result = await postService.getAllPosts();

  // 3. 断言 (Assert)

  // 断言一：方法的返回值应该和我们准备的假数据完全一样

  expect(result).toEqual(fakePostList);

  // 断言二：Post.find 方法确实被调用了，而且只调用了一次

  expect(Post.find).toHaveBeenCalledTimes(1);

  // 断言三：确认 Post.find 是用正确的参数被调用的

  // 这确保了我们正确地查询了数据库，并且只选择了需要的字段。

  expect(Post.find).toHaveBeenCalledWith({}, "title slug createdAt updatedAt");

 });

});



###### 运行测试结果

Jiaha@jiahao MINGW64 ~/Desktop/personal-blog/server (main)
$ npm run test

> spices-server@1.0.0 test
> node --experimental-vm-modules node_modules/jest/bin/jest.js

 FAIL  tests/unit/services/post.service.test.ts
  ● Test suite failed to run
                                                                                                                                       
    ReferenceError: jest is not defined
    
       6 | // 告诉 Jest: 当代码中导入 Post 模型时，使用一个假的 (mock) 版本替代。
       7 | // 注意：因为你的源码中是 import ... from '../models/Post.js'，所以这里也要带 .js 后缀。
    >  8 | jest.mock("../../../src/models/Post.js");
         | ^
       9 |
      10 | describe("PostService - getAllPosts", () => {
      11 |   // 在每次测试后，清除 mock 的使用记录
    
      at tests/unit/services/post.service.test.ts:8:1

Test Suites: 1 failed, 1 total                                                                                                         
Tests:       0 total                                                                                                                   
Snapshots:   0 total
Time:        0.856 s
Ran all test suites.
(node:19812) ExperimentalWarning: VM Modules is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)

