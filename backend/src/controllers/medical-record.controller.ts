import ChatModel from "@models/chat.model";
import MedicalRecord from "@models/medical-record";
import { NextFunction, Request, Response } from "express";
import { FARMER_ROLE, VETERINARIAN_ROLE } from "src/constants";
import { getGeneratedMedicalRecord } from "./aiAssistant.controller";
import { Role } from "@interfaces/user.interface";
import ProfileModel from "@models/profile.model";
import { throwUnauthorizedError } from "src/utils/util";

/* Create Medical Record */
export const createMedicalRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.authorized_user;

    if (!req.authorized_user) {
      return throwUnauthorizedError(req);
    }

    // Only the veterinarian's can perform this request
    if (!user || user.role === Role.Farmer) {
      res.status(403).json({
        message: "You do not have permission to perform this action",
      });
    } else {
      const newMedicalRecord = new MedicalRecord({
        animalId: req.body?.animalId,
        species: req.body?.species,
        breed: req.body?.breed,
        sex: req.body?.sex,
        dob: new Date(req.body?.dob),
        color: req.body?.color,
        weight: req.body?.weight,
        assessment: req.body?.assessment,
        treatment: req.body?.treatment,
        plan: req.body?.plan,
        farmer: req.body?.farmerId,
        createdBy: user.profileId,
      });

      const savedMedicalRecord = await newMedicalRecord.save();

      res.status(201).json({
        message: "Medical Record Created Successfully",
        data: savedMedicalRecord,
      });
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

/* Get Medical Records */
export const getMedicalRecords = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = req.authorized_user;
    if (!user) {
      return throwUnauthorizedError(req);
    } else {
      const role = user.role;
      const filterCriteria =
        role === VETERINARIAN_ROLE
          ? {
              createdBy: user.profileId,
            }
          : role === FARMER_ROLE
            ? {
                farmer: user.profileId,
              }
            : {};

      const records = await MedicalRecord.find(filterCriteria)
        .populate("farmer")
        .populate("createdBy");

      res.json(records?.length > 0 ? records : []);
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

/* Get Medical Record By Id */
export const getMedicalRecordById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = req.authorized_user;
    if (!user) {
      return throwUnauthorizedError(req);
    } else {
      const records = await MedicalRecord.findById(req.params.id)
        .populate("farmer")
        .populate("createdBy");
      res.status(200).json(records);
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

/* Get Medical Records */
export const generateMedicalRecord = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = req.authorized_user;
    if (!user) {
      return throwUnauthorizedError(req);
    }
    if (user.role === Role.Farmer) {
      res.status(403).json({
        message: "You do not have permission to perform this action",
      });
    } else {
      if (!req.params.chatId) {
        res.status(400).json({
          message: "Chat ID did not found",
        });
      } else {
        const chat = await ChatModel.findById(req.params.chatId);
        if (!chat) {
          res.status(500).json({
            message: "Chat not found",
          });
        } else {
          const participants = chat.participants;
          const vetId = participants.find(
            (participant) => participant === user.id
          );
          const farmerId = participants.find(
            (participant) => participant !== user.id
          );
          const farmerProfile = await ProfileModel.findOne({
            userId: farmerId,
          });

          if (!vetId) {
            res.status(400).json({
              message:
                "Only the channeled veterinariant can generate the medical record",
            });
          }
          if (!farmerProfile?.id) {
            res.status(400).json({
              message: "Channeled farmer profile cannot find",
            });
          }

          if (farmerId) {
            const generatedRecord = await getGeneratedMedicalRecord(chat);
            res.status(200).json({
              farmerId: farmerProfile?.id,
              animalId: generatedRecord?.animalId || "",
              breed: generatedRecord?.breed || "",
              color: generatedRecord?.color || "",
              dob: generatedRecord?.dob || "",
              sex: generatedRecord?.sex || "",
              species: generatedRecord?.species || "",
              weight: generatedRecord?.weight
                ? parseFloat(String(generatedRecord?.weight))
                : undefined,
              assessment: generatedRecord?.assessment || "",
              plan: generatedRecord?.plan || "",
              treatment: generatedRecord?.treatment || "",
            });
          } else {
            res.status(500).json({
              message: "Cannot find the farmer associated with the chat",
            });
          }
        }
      }
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
