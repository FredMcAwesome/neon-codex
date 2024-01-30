import { biowareCategoryEnum } from "@neon-codex/common/build/enums.js";
import { biowareXmlCategoryEnum } from "./BiowareParserSchemas.js";

export const convertBiowareCategory = function (
  category: biowareXmlCategoryEnum
) {
  switch (category) {
    case biowareXmlCategoryEnum.Basic:
      return biowareCategoryEnum.Basic;
    case biowareXmlCategoryEnum.BioWeapons:
      return biowareCategoryEnum.BioWeapons;
    case biowareXmlCategoryEnum.Biosculpting:
      return biowareCategoryEnum.Biosculpting;
    case biowareXmlCategoryEnum.ChemicalGlandModifications:
      return biowareCategoryEnum.ChemicalGlandModifications;
    case biowareXmlCategoryEnum.ComplimentaryGenetics:
      return biowareCategoryEnum.ComplimentaryGenetics;
    case biowareXmlCategoryEnum.CosmeticBioware:
      return biowareCategoryEnum.CosmeticBioware;
    case biowareXmlCategoryEnum.Cultured:
      return biowareCategoryEnum.Cultured;
    case biowareXmlCategoryEnum.EnvironmentalMicroadaptation:
      return biowareCategoryEnum.EnvironmentalMicroadaptation;
    case biowareXmlCategoryEnum.ExoticMetagenetics:
      return biowareCategoryEnum.ExoticMetagenetics;
    case biowareXmlCategoryEnum.GeneticRestoration:
      return biowareCategoryEnum.GeneticRestoration;
    case biowareXmlCategoryEnum.Immunization:
      return biowareCategoryEnum.Immunisation;
    case biowareXmlCategoryEnum.OrthoskinUpgrades:
      return biowareCategoryEnum.OrthoskinUpgrades;
    case biowareXmlCategoryEnum.PhenotypeAdjustment:
      return biowareCategoryEnum.PhenotypeAdjustment;
    case biowareXmlCategoryEnum.Symbionts:
      return biowareCategoryEnum.Symbionts;
    case biowareXmlCategoryEnum.TransgenicAlteration:
      return biowareCategoryEnum.TransgenicAlteration;
    case biowareXmlCategoryEnum.Transgenics:
      return biowareCategoryEnum.Transgenics;
  }
};
