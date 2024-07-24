import { Router } from "express";
import CmsController from "@controllers/cms.controller";
import { validationMiddleware } from "@middlewares/validation.middleware";
import { CreateCmsPageDto, UpdateCmsDto } from "@dtos/cms-page.dto";

const router = Router();
const cmsController = new CmsController();

// Route to get all public cms pages
router.get("/public/", cmsController.getAllCmsPages);

router.get("/editor/own", cmsController.getOwnCmsPages);

router.get("/editor/in-review", cmsController.getAllInReview);

router.get("/editor/:id", cmsController.getCmsPageById);

router.get("/url/:url", cmsController.getCmsPageByUrl);

router.get("/available/:relativeUrl", cmsController.getIsCmsUrlAvailable);

router.post(
  "/",
  validationMiddleware(CreateCmsPageDto),
  cmsController.createCmsPage
);

router.put(
  "/:id",
  validationMiddleware(UpdateCmsDto),
  cmsController.updateCmsPage
);

router.delete("/:id", cmsController.deleteCmsPage);

export default router;
