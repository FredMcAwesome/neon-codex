import { EntityManager } from "@mikro-orm/postgresql";
import { Seeder } from "@mikro-orm/seeder";
import { Spells } from "../models/abilities/spellModel.js";
import { getSpells } from "../seeds/newSeeds/spellsSeed.js";
export class AbilitiesSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const stagedspells: Array<Spells> = getSpells();

    stagedspells.forEach((spell) => {
      em.create(Spells, spell);
    });
  }
}
