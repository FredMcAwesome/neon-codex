import { Entity, Enum, ManyToOne, PrimaryKey } from "@mikro-orm/postgresql";
import type { Ref } from "@mikro-orm/postgresql";
import { Characters } from "../characters/characterModel.js";
import { ComplexForms } from "../abilities/complexFormModel.js";
import { matrixAttributeEnum } from "@neon-codex/common/build/enums.js";
import { Critters } from "../creatures/critterModel.js";

@Entity({
  discriminatorColumn: "discr",
  abstract: true,
})
export abstract class ActiveComplexForms {
  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => ComplexForms, ref: true })
  complexForm!: Ref<ComplexForms>;

  @Enum({ items: () => matrixAttributeEnum, nullable: true })
  matrixAttribute?: matrixAttributeEnum;

  constructor(
    complexForm: Ref<ComplexForms>,
    matrixAttribute?: matrixAttributeEnum
  ) {
    this.complexForm = complexForm;
    if (matrixAttribute !== undefined) {
      this.matrixAttribute = matrixAttribute;
    }
  }
}

@Entity({ discriminatorValue: "included" })
export class IncludedComplexForms extends ActiveComplexForms {
  constructor(
    complexForm: Ref<ComplexForms>,
    matrixAttribute?: matrixAttributeEnum
  ) {
    super(complexForm, matrixAttribute);
  }
}

@Entity({ discriminatorValue: "critterIncluded" })
export class CritterIncludedComplexForms extends ActiveComplexForms {
  @ManyToOne({ entity: () => Critters, ref: true })
  standardCritter: Ref<Critters>;

  constructor(
    complexForm: Ref<ComplexForms>,
    standardCritter: Ref<Critters>,
    matrixAttribute?: matrixAttributeEnum
  ) {
    super(complexForm, matrixAttribute);
    this.standardCritter = standardCritter;
  }
}

@Entity({ discriminatorValue: "customised" })
export class CustomisedComplexForms extends ActiveComplexForms {
  @ManyToOne({ entity: () => Characters, ref: true })
  character!: Ref<Characters>;

  constructor(
    complexForm: Ref<ComplexForms>,
    matrixAttribute?: matrixAttributeEnum
  ) {
    super(complexForm, matrixAttribute);
  }
}
