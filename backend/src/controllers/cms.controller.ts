import { NextFunction, Request, Response } from "express";
import { CreateCmsPageDto, UpdateCmsDto } from "@dtos/cms-page.dto";
import CmsService from "@services/cms.service";
import { CmsPage, CmsPageState } from "@interfaces/cms.interface";
import { Role } from "@interfaces/user.interface";
import { HttpException } from "../exceptions/HttpException";
import { Profile } from "@models/profile.model";

export default class CmsController {
  public cmsService = new CmsService();

  public getAllCmsPages = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const searchQuery = req.query.search as string;
      const cmsPosts = await this.cmsService.findAllCmsPosts(
        searchQuery,
        [CmsPageState.Published],
        8
      );

      res.status(200).json(cmsPosts);
    } catch (e) {
      next(e);
    }
  };

  public getOwnCmsPages = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.authorized_user) {
        throw new HttpException(401, "Unauthorized");
      }
      if (req.authorized_user.role === Role.Admin) {
        // And admin has authorisation to see and edit all cms posts
        const cmsPosts = await this.cmsService.findAllCmsPosts();

        return res.status(200).json(cmsPosts);
      }

      const cmsPosts = await this.cmsService.findAllCmsPostsByProfile(
        req.authorized_user.profileId.toString()
      );

      res.status(200).json(cmsPosts);
    } catch (e) {
      next(e);
    }
  };

  public getAllInReview = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.authorized_user) {
        throw new HttpException(401, "Unauthorized");
      }

      if (req.authorized_user.role !== Role.Admin) {
        throw new HttpException(403, "Forbidden");
      }

      const cmsPosts = await this.cmsService.findAllCmsPosts(undefined, [
        CmsPageState.InReview,
      ]);

      res.status(200).json(cmsPosts);
    } catch (e) {
      next(e);
    }
  };

  public getCmsPageById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.authorized_user) {
        throw new HttpException(401, "Unauthorized");
      }

      const cmsPost = await this.cmsService.findCmsPostById(req.params.id);

      const createdBy: Partial<Profile> = cmsPost.createdBy as Partial<Profile>;
      if (
        req.authorized_user.role !== Role.Admin &&
        req.authorized_user.profileId.toString() !== createdBy?.id
      ) {
        throw new HttpException(403, "Forbidden");
      }

      res.status(200).json(cmsPost);
    } catch (e) {
      next(e);
    }
  };

  public getCmsPageByUrl = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const cmsPosts = await this.cmsService.findCmsPostByUrl(req.params.url);

      if (cmsPosts.state === CmsPageState.Published) {
        return res.status(200).json(cmsPosts);
      }

      let createdBy: Partial<Profile> = cmsPosts.createdBy as Partial<Profile>;
      if (
        req.authorized_user?.role === Role.Admin ||
        req.authorized_user?.profileId === createdBy?.id
      ) {
        return res.status(200).json(cmsPosts);
      }

      throw new HttpException(404, "CMS Page not found");
    } catch (e) {
      next(e);
    }
  };

  public getIsCmsUrlAvailable = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const isAvailable = await this.cmsService.isCmsUrlAvailable(
        req.params.relativeUrl
      );
      res.status(200).json(isAvailable);
    } catch (e) {
      next(e);
    }
  };

  public createCmsPage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const authUser = req.authorized_user;
      if (
        !authUser ||
        (authUser.role !== Role.Admin && authUser.role !== Role.Vet)
      ) {
        throw new HttpException(
          403,
          "Only Veterinarians and Admins can create blog posts"
        );
      }

      if (!authUser.profileId) {
        throw new HttpException(
          500,
          "No profile ID associated with the User found"
        );
      }

      const cmsPostData: CreateCmsPageDto = req.body;
      const createCmsPostData: CmsPage = await this.cmsService.createCmsPost(
        cmsPostData,
        authUser.profileId
      );

      res.status(201).json(createCmsPostData);
    } catch (err: any) {
      next(err);
    }
  };

  public updateCmsPage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.authorized_user) {
        throw new HttpException(401, "Unauthorized");
      }

      const cmsPost = await this.cmsService.findCmsPostById(req.params.id);

      const createdBy: Partial<Profile> = cmsPost.createdBy as Partial<Profile>;
      if (
        req.authorized_user.role !== Role.Admin &&
        req.authorized_user.profileId.toString() !== createdBy?.id
      ) {
        throw new HttpException(403, "Forbidden");
      }

      const cmsPostData: UpdateCmsDto = req.body;
      const updateCmsPostData: CmsPage = await this.cmsService.updateCmsPost(
        cmsPostData,
        req.params.id
      );

      res.status(200).json(updateCmsPostData);
    } catch (err: any) {
      next(err);
    }
  };

  public deleteCmsPage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const pageId: string = req.params.id;
      await this.cmsService.deleteCmsPage(pageId);

      res.status(200).json({ id: req.params.id, message: "deleted" });
    } catch (error) {
      next(error);
    }
  };
}
