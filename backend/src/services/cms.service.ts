import { CreateCmsPageDto, UpdateCmsDto } from "@dtos/cms-page.dto";
import { CmsPage, CmsPageState } from "@interfaces/cms.interface";
import CmsPostModel from "@models/cms-post.model";
import { HttpException } from "../exceptions/HttpException";
import { sanitizeQuery } from "src/utils/util";
import { Condition, ObjectId } from "mongoose";

class CmsService {
  public cmsPosts = CmsPostModel;
  private profileAttributes = [
    "id",
    "firstName",
    "lastName",
    "profileImageUrl",
  ];

  public async findAllCmsPosts(
    searchQuery?: string,
    filterByState: CmsPageState[] = [],
    limit?: number
  ): Promise<Omit<CmsPage, "hasAuthorReadFeedback" | "authorFeedback">[]> {
    let filter: Record<string, Condition<unknown>> = {};

    if (searchQuery) {
      filter.title = { $regex: sanitizeQuery(searchQuery), $options: "i" };
    }

    if (filterByState.length > 0) {
      filter.state = { $in: filterByState };
    }

    let query = CmsPostModel.find(filter)
      .populate("createdBy", this.profileAttributes)
      .select("-hasAuthorReadFeedback -authorFeedback")
      .sort({ lastEditedDate: -1 });

    if (limit) {
      query = query.limit(limit);
    }

    return query;
  }

  public async findAllCmsPostsByProfile(profileId: string): Promise<CmsPage[]> {
    const filter = {
      createdBy: profileId,
    };

    return CmsPostModel.find(filter).populate(
      "createdBy",
      this.profileAttributes
    );
  }

  public async isCmsUrlAvailable(
    relativeUrl: string,
    excludingPostId?: string
  ): Promise<boolean> {
    const cmsPostId = await CmsPostModel.exists({ relativeUrl: relativeUrl });
    return !cmsPostId || cmsPostId._id.toString() === excludingPostId;
  }

  public async findCmsPostById(id: string): Promise<CmsPage> {
    const cmsPage = await CmsPostModel.findById(id);
    if (!cmsPage) {
      throw new HttpException(404, "CMS Page not found");
    }

    return cmsPage.populate("createdBy", this.profileAttributes);
  }

  public async findCmsPostByUrl(
    relativeUrl: string
  ): Promise<Omit<CmsPage, "hasAuthorReadFeedback" | "authorFeedback">> {
    const cmsPage = await CmsPostModel.findOne({
      relativeUrl: relativeUrl,
    }).select("-hasAuthorReadFeedback -authorFeedback");

    if (!cmsPage) {
      throw new HttpException(404, "CMS Page not found");
    }

    return cmsPage.populate("createdBy", this.profileAttributes);
  }

  public async createCmsPost(
    cmsPostData: CreateCmsPageDto,
    createdById: ObjectId
  ): Promise<CmsPage> {
    let cmsPost = {
      ...cmsPostData,
      createdBy: createdById,
    };
    const cmsPageCreated = await this.cmsPosts.create(cmsPost);
    return cmsPageCreated.populate("createdBy", this.profileAttributes);
  }

  public async updateCmsPost(
    cmsPostData: UpdateCmsDto,
    id: string
  ): Promise<CmsPage> {
    const updateFields = { ...cmsPostData };

    // Create a map of the components by their existing _id, to avoid changing all _ids when updating
    updateFields.cmsComponents = cmsPostData.cmsComponents?.map(
      (component) => ({
        _id: component.id,
        ...component,
      })
    );

    const cmsPage = await this.cmsPosts.findByIdAndUpdate(
      id,
      {
        $set: updateFields,
      },
      { new: true }
    );

    if (!cmsPage) {
      throw new HttpException(404, "CMS Page not found");
    }

    return cmsPage.populate("createdBy", this.profileAttributes);
  }

  public async deleteCmsPage(id: string): Promise<void> {
    const deletedCmsPage = await this.cmsPosts.findByIdAndDelete(id);

    if (!deletedCmsPage) {
      throw new HttpException(404, "CMS Page to delete does not exist");
    }
  }
}

export default CmsService;
