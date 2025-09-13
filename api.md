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

- `404 Not Found`: 如果具有给定 `slug` 的文章不存在。

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



###### POST /api/auth/google-login

**请求体 (Request Body)**:

JSON

```
{
  "token": "来自谷歌的 credential JWT 字符串"
}
```

**成功响应 (200 OK)**:

- 后端验证 Google Token 成功后，会查询数据库。如果用户不存在，则创建新用户。
- 然后，后端会生成一个**自己系统**的 JWT，并通过 `HttpOnly` Cookie 发送给浏览器，同时返回用户信息。

JSON

```
// Response Header 中会包含:
// Set-Cookie: session-token=your-app-jwt; HttpOnly; Path=/; Secure; SameSite=Strict

// Response Body:
{
  "success": true,
  "data": {
    "user": {
      "_id": "yourAppUserId",
      "name": "用户的谷歌名字",
      "email": "用户的谷歌邮箱",
      "picture": "用户的谷歌头像URL"
    }
  }
}
```

**错误响应**:

- **401 Unauthorized**: 如果 Google Token 无效或验证失败。

  JSON

  ```
  {
    "success": false,
    "error": {
      "message": "无效的凭证。"
    }
  }
  ```

- **500 Internal Server Error**: 服务器内部错误（如数据库问题）。



###### GET /api/auth/me

这个接口用于前端应用加载时，检查用户是否已经处于登录状态。

- **用途**: 无需任何请求体，仅通过浏览器自动发送的 Cookie 来验证用户身份，并返回当前用户信息。

- **请求体**: 无

- **成功响应 (200 OK)**:

  - 如果请求中包含了有效的会话 Cookie，服务器会验证它并返回用户信息。

  JSON

  ```
  {
    "success": true,
    "data": {
      "user": {
        "_id": "yourAppUserId",
        "name": "用户的谷歌名字",
        "email": "用户的谷歌邮箱",
        "picture": "用户的谷歌头像URL"
      }
    }
  }
  ```

- **错误响应**:

  - **401 Unauthorized**: 如果没有 Cookie 或 Cookie 无效/过期。这告诉前端用户未登录。

    JSON

    ```
    {
      "success": false,
      "error": {
        "message": "请先登录。"
      }
    }
    ```



###### POST /api/auth/logout