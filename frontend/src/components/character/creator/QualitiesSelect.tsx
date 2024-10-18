import { Fragment } from "react";
import Dropdown from "react-dropdown";
import { trpc } from "../../../utils/trpc.js";
import {
  BonusSourceEnum,
  qualityCategoryEnum,
} from "@neon-codex/common/build/enums.js";
import type { QualitySelectedListType } from "@neon-codex/common/build/schemas/characters/characterSchemas.js";
import type { QualityListType } from "@neon-codex/common/build/schemas/abilities/qualitySchemas.js";
import type { CharacterCreatorBonusListType } from "../commonSchemas.js";

const QualityDefault = "Select a quality";

interface IProps {
  karmaPoints: number;
  setKarmaPoints: (loadingKarma: number) => void;
  positiveQualitiesSelected: QualitySelectedListType;
  setPositiveQualitiesSelected: (
    loadingPositiveQualities: QualitySelectedListType
  ) => void;
  negativeQualitiesSelected: QualitySelectedListType;
  setNegativeQualitiesSelected: (
    loadingNegativeQualities: QualitySelectedListType
  ) => void;
  bonusInfo: CharacterCreatorBonusListType;
  setBonusInfo: (loadingBonusInfo: CharacterCreatorBonusListType) => void;
}

export const QualityListSelect = function (props: IProps) {
  const qualities = trpc.character.qualities.useQuery();
  function setKarma(removeKarma: boolean, difference: number) {
    props.setKarmaPoints(
      props.karmaPoints + (removeKarma ? -1 : 1) * difference
    );
  }
  if (qualities.isLoading) {
    return <span>Loading...</span>;
  }

  if (qualities.isError) {
    return <span>Error: {qualities.error.message}</span>;
  }
  return (
    <Fragment>
      <h1>Qualities Selection</h1>
      <div>
        <p>
          Karma Remaining: <span id="karma_points">{props.karmaPoints}</span>
        </p>
      </div>
      <div>
        <h2>Positive Qualities</h2>
        <QualitySelectionComponent
          positive={true}
          qualityList={qualities.data.filter(
            (quality) => quality.category === qualityCategoryEnum.Positive
          )}
          selectedQualityList={props.positiveQualitiesSelected}
          setQualities={props.setPositiveQualitiesSelected}
          setKarma={setKarma}
          bonusInfo={props.bonusInfo}
          setBonusInfo={props.setBonusInfo}
        />
      </div>
      <div>
        <h2>Negative Qualities</h2>
        <QualitySelectionComponent
          positive={false}
          qualityList={qualities.data.filter(
            (quality) => quality.category === qualityCategoryEnum.Negative
          )}
          selectedQualityList={props.negativeQualitiesSelected}
          setQualities={props.setNegativeQualitiesSelected}
          setKarma={setKarma}
          bonusInfo={props.bonusInfo}
          setBonusInfo={props.setBonusInfo}
        />
      </div>
    </Fragment>
  );
};

// interface IRatingProps {
//   quality: QualityType;
//   qualityList: QualityListType;
//   index: number;
//   setKarma: (removeKarma: boolean, difference: number) => void;
//   setQualities: (loadingQualities: QualityListType) => void;
// }

// const RatingComponent = function ({
//   quality,
//   qualityList,
//   index,
//   setKarma,
//   setQualities,
// }: IRatingProps) {
//   return (
//     <p>
//       <h4>Rating:</h4>
//       <Dropdown
//         options={[...Array(quality.limit).keys()].map((rating) =>
//           (rating + 1).toString()
//         )}
//         value={quality.ratingSelected?.toString() || "Select Rating value"}
//         onChange={(arg) => {
//           const newQualities = [...qualityList];
//           const currentRating = qualityList[index].ratingSelected || 0;
//           const newRating = parseInt(arg.value);
//           newQualities[index].ratingSelected = newRating;

//           let currentCost = 0;
//           const selectedQuality = newQualities[index];
//           if (
//             selectedQuality.costSelected ||
//             typeof selectedQuality.cost === "number"
//           ) {
//             currentCost =
//               selectedQuality.costSelected || (selectedQuality.cost as number);
//             const difference = currentCost * (newRating - currentRating);
//             setKarma(selectedQuality.positive, difference);
//           }
//           setQualities(newQualities);
//         }}
//         className={
//           quality.ratingSelected
//             ? QualityEnum[quality.id] + quality.ratingSelected.toString()
//             : QualityEnum[quality.id] + "_newRating"
//         }
//       />
//     </p>
//   );
// };

interface IQualityDropdownProps {
  positive: boolean;
  currentValue: string;
  qualityList: QualityListType;
  selectedQualityList: QualitySelectedListType;
  setQualities: (loadingQualities: QualitySelectedListType) => void;
  setKarma: (removeKarma: boolean, difference: number) => void;
  index: number;
  bonusInfo: CharacterCreatorBonusListType;
  setBonusInfo: (loadingBonusInfo: CharacterCreatorBonusListType) => void;
}

function QualityDropdownComponent({
  positive,
  currentValue,
  qualityList,
  selectedQualityList,
  setQualities,
  setKarma,
  index,
  bonusInfo,
  setBonusInfo,
}: IQualityDropdownProps) {
  return (
    <Dropdown
      options={qualityList.map((quality) => {
        return quality.name;
      })}
      value={currentValue}
      onChange={(arg) => {
        const newQuality = qualityList.find((quality) => {
          return quality.name === arg.value;
        });
        const oldQuality = qualityList.find((quality) => {
          return quality.name === currentValue;
        });

        if (
          newQuality !== undefined &&
          (oldQuality !== undefined || currentValue === QualityDefault)
        ) {
          let newBonusInfo = bonusInfo;
          if (oldQuality === undefined) {
            setQualities([...selectedQualityList, { name: newQuality.name }]);
            if (
              typeof newQuality.karma === "number" &&
              newQuality.limit === undefined
            ) {
              setKarma(
                newQuality.category === qualityCategoryEnum.Positive,
                newQuality.karma
              );
            }
          } else {
            if (selectedQualityList.length - 1 === index) {
              setQualities([
                ...selectedQualityList.slice(0, index),
                { name: newQuality.name },
              ]);
            } else {
              setQualities([
                ...selectedQualityList.slice(0, index),
                { name: newQuality.name },
                ...selectedQualityList.slice(index + 1),
              ]);
            }
            let newCost = 0;
            if (
              typeof newQuality.karma === "number" &&
              newQuality.limit === undefined
            ) {
              newCost = newQuality.karma;
            }
            setKarma(
              newQuality.category === qualityCategoryEnum.Positive,
              newCost - oldQuality.karma
            );

            const bonusIndex = newBonusInfo.findIndex(
              (element) => element.source === oldQuality.name
            );
            if (bonusIndex > -1) {
              newBonusInfo = newBonusInfo.splice(bonusIndex, 1);
            } else {
              console.log(`Quality: ${oldQuality.name} has no bonus to remove`);
            }
          }
          if (newQuality.bonus !== undefined) {
            const bonusParsed = {
              sourceType: BonusSourceEnum.Quality,
              source: newQuality.name,
              ...(newQuality.bonus.linkMentorSpirit !== undefined && {
                linkMentorSpirit: true as const,
              }),
              ...(newQuality.bonus.linkParagon !== undefined && {
                linkParagon: true as const,
              }),
            };
            newBonusInfo.push(bonusParsed);
            setBonusInfo(newBonusInfo);
          }
        } else {
          console.error("Quality: " + arg.value + " not found");
        }
      }}
      className={
        currentValue.startsWith("Select")
          ? positive
            ? "newPositiveQuality"
            : "newNegativeQuality"
          : currentValue
      }
    />
  );
}

interface IQualitySelectionProps {
  positive: boolean;
  qualityList: QualityListType;
  selectedQualityList: QualitySelectedListType;
  setQualities: (loadingQualities: QualitySelectedListType) => void;
  setKarma: (removeKarma: boolean, difference: number) => void;
  bonusInfo: CharacterCreatorBonusListType;
  setBonusInfo: (loadingBonusInfo: CharacterCreatorBonusListType) => void;
}

const QualitySelectionComponent = function ({
  positive,
  qualityList,
  selectedQualityList,
  setQualities,
  setKarma,
  bonusInfo,
  setBonusInfo,
}: IQualitySelectionProps) {
  return (
    <div>
      {selectedQualityList.map((quality, index) => {
        const fullQuality = qualityList.find((qual) => {
          return qual.name === quality.name;
        });
        if (fullQuality === undefined) {
          throw new Error(`Quality ${quality.name} doesn't exist`);
        }
        return (
          <div key={index}>
            <QualityDropdownComponent
              currentValue={fullQuality.name}
              positive={positive}
              selectedQualityList={selectedQualityList}
              qualityList={qualityList}
              setQualities={setQualities}
              setKarma={setKarma}
              index={index}
              bonusInfo={bonusInfo}
              setBonusInfo={setBonusInfo}
            />
            <p>{fullQuality.description}</p>
            {/* {quality.subqualities && (
              <SubqualitiesComponent
                quality={quality}
                qualityList={qualityList}
                index={index}
                setKarma={setKarma}
                setQualities={setQualities}
              />
            )} */}
            <h4>Karma cost: {fullQuality.karma} </h4>
            {/* {quality.maxRating && (
              <RatingComponent
                quality={quality}
                qualityList={qualityList}
                index={index}
                setKarma={setKarma}
                setQualities={setQualities}
              />
            )} */}
            <button
              onClick={() => {
                let difference = 0;
                const removedQuality = selectedQualityList[index];

                const fullQuality = qualityList.find(
                  (qual) => qual.name === removedQuality.name
                );
                if (fullQuality === undefined) {
                  throw new Error(
                    `Quality ${removedQuality.name} is not found`
                  );
                }
                difference = fullQuality.karma;

                // difference *= removedQuality. || 1;
                setKarma(
                  fullQuality.category === qualityCategoryEnum.Negative,
                  difference
                );
                if (selectedQualityList.length - 1 === index) {
                  setQualities([...selectedQualityList.slice(0, index)]);
                } else {
                  setQualities([
                    ...selectedQualityList.slice(0, index),
                    ...selectedQualityList.slice(index + 1),
                  ]);
                }
              }}
            >
              Remove
            </button>
          </div>
        );
      })}
      <h3>Add Quality:</h3>
      {
        <QualityDropdownComponent
          currentValue={QualityDefault}
          positive={positive}
          qualityList={qualityList}
          selectedQualityList={selectedQualityList}
          setQualities={setQualities}
          setKarma={setKarma}
          index={-1}
          bonusInfo={bonusInfo}
          setBonusInfo={setBonusInfo}
        />
      }
    </div>
  );
};
