import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  type Ref,
} from "@mikro-orm/postgresql";
import Users from "../../accounts/userModel.js";

/**
 * Stores in-progress character creation data.
 * Uses JSON blob with snapshotting approach for character data.
 */
@Entity()
export class DraftCharacters {
  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => Users, ref: true })
  user!: Ref<Users>;

  @Property({ default: "" })
  name: string = "";

  @Property()
  currentStep!: string;

  /**
   * JSON blob containing the entire character creation state.
   * Uses snapshotting - includes full object data for selections.
   */
  @Property({ type: "json" })
  characterData!: Record<string, unknown>;

  /**
   * Version number for optimistic locking / conflict detection.
   * Incremented on each save.
   */
  @Property({ default: 1 })
  version: number = 1;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  constructor(dto: {
    user: Ref<Users>;
    currentStep: string;
    characterData: Record<string, unknown>;
    name?: string;
  }) {
    this.user = dto.user;
    this.currentStep = dto.currentStep;
    this.characterData = dto.characterData;
    if (dto.name !== undefined) {
      this.name = dto.name;
    }
  }
}
