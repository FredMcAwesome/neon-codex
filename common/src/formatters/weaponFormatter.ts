import { blastTypeEnum, damageTypeEnum } from "../enums.js";
import type { DamageAmountType, DamageType } from "../schemas/weaponSchemas.js";

export function formatDamage(unformattedDamage: DamageType): string {
  let damageString = "";
  for (const damage of unformattedDamage) {
    const damageAmount = formatDamageAmount(damage.damageAmount);
    const multipleBarrels =
      damage.barrels !== undefined ? `X${damage.barrels}` : "";
    let damageType = "";
    switch (damage.type) {
      case damageTypeEnum.Physical:
        damageType = "P";
        break;
      case damageTypeEnum.Stun:
        damageType = "S";
        break;
      case damageTypeEnum.Special:
        damageType = "Special";
        break;
      case damageTypeEnum.None:
        break;
    }
    damageString += `(${damageAmount})` + damageType + multipleBarrels;
    if (damage.annotation !== undefined) {
      const damageAnnotation = damage.annotation;
      damageString += ` (${damageAnnotation})`;
    }
    if (damage.blast !== undefined) {
      const blast = damage.blast;
      switch (blast.type) {
        case blastTypeEnum.Radius:
          damageString += ` (${blast.value} Radius)`;
          break;
        case blastTypeEnum.Reducing:
          damageString += ` (${blast.value}/m)`;
          break;
      }
    }
  }
  return damageString;
}

function formatDamageAmount(unformattedDamageAmount: DamageAmountType): string {
  let damageAmount = "";
  for (const dmgValue of unformattedDamageAmount) {
    if (typeof dmgValue === "number") {
      damageAmount += dmgValue.toString();
    } else if ("option" in dmgValue) {
      damageAmount += dmgValue.option;
    } else if ("operator" in dmgValue) {
      damageAmount += dmgValue.operator;
    } else {
      damageAmount += formatDamageAmount(dmgValue.subnumbers);
    }
  }
  return damageAmount;
}
