// src/api/auth.routes.ts

import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

// @desc   使用 Google token 登录或注册
// @route  POST /api/auth/google-login
router.post("/google-login", authController.googleLogin);

// @desc   获取当前登录用户的信息
// @route  GET /api/auth/me
// @access Private
router.get("/me", protect, authController.getMe);

export default router;
