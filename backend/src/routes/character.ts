import express from "express";
import { WeaponListType, weaponTypeEnum } from "@shadowrun/common";
import { Database } from "../utils/db.js";
import * as logger from "../utils/logger.js";
import { IAuthRequest, isLoggedIn } from "./authentication.js";
import { FirearmWeapons, MeleeWeapons } from "../models/gear/weaponModel.js";

const router = express.Router();

router.get(
  "/weapons",
  isLoggedIn,
  async function (_req: IAuthRequest, res: express.Response) {
    try {
      const weapons = await Database.weaponRespository.findAll();
      const weaponsResponse: WeaponListType = weapons.map((weapon) => {
        const isMeleeWeapon = weapon.type === weaponTypeEnum.Melee;
        const isFirearmWeapon = weapon.type === weaponTypeEnum.Firearm;
        const meleeWeapon: MeleeWeapons = weapon as MeleeWeapons;
        const firearmWeapon: FirearmWeapons = weapon as FirearmWeapons;
        return {
          type: weapon.type,
          subtype: weapon.subtype,
          name: weapon.name,
          accuracy: weapon.accuracy,
          damage: weapon.damage,
          armourPenetration: weapon.armourPenetration,
          availability: weapon.availability,
          rating: weapon.rating,
          cost: weapon.cost,
          meleeOptions: isMeleeWeapon
            ? {
                reach: meleeWeapon.reach || 0,
              }
            : undefined,
          firearmOptions: isFirearmWeapon
            ? {
                mode: firearmWeapon.mode,
                recoilCompensation: firearmWeapon.recoilCompensation,
                ammo: firearmWeapon.ammo,
              }
            : undefined,
          description: weapon.description,
          wireless: weapon.wireless,
          relatedSkill: weapon.relatedSkill,
        };
      });
      logger.log(JSON.stringify(weaponsResponse, null, 2));
      res.json(weaponsResponse);
    } catch (error) {
      logger.error("Unable to connect to the database:", error);

      res.status(500).send("Database error");
    }
  }
);

export default router;
