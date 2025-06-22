// src/api/posts.routes.ts

import { Router } from "express";
import { postsController } from "../controllers/posts.controller.js";
import multer from "multer";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", postsController.getAllPosts);
router.post("/", postsController.createPost);

router.post("/zip", upload.single("blogPackage"), postsController.createPostFromZip);

router.get("/:slug", postsController.getPostBySlug);

export default router;
