import { Fragment } from "react";
import Dropdown from "react-dropdown";
import { trpc } from "../../../utils/trpc.js";
import type { QualityListType } from "@neon-codex/common/build/schemas/qualitySchemas.js";
import { qualityCategoryEnum } from "@neon-codex/common/build/enums.js";

interface IProps {
  karmaPoints: number;
  setKarmaPoints: (loadingKarma: number) => void;
  positiveQualitiesSelected: QualityListType;
  setPositiveQualitiesSelected: (
    loadingPositiveQualities: QualityListType
  ) => void;
  negativeQualitiesSelected: QualityListType;
  setNegativeQualitiesSelected: (
    loadingNegativeQualities: QualityListType
  ) => void;
}

export const QualitiesSelect = function (props: IProps) {
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
          selectedQualitiesList={props.positiveQualitiesSelected}
          setQualities={props.setPositiveQualitiesSelected}
          setKarma={setKarma}
        />
      </div>
      <div>
        <h2>Negative Qualities</h2>
        <QualitySelectionComponent
          positive={false}
          qualityList={qualities.data.filter(
            (quality) => quality.category === qualityCategoryEnum.Negative
          )}
          selectedQualitiesList={props.negativeQualitiesSelected}
          setQualities={props.setNegativeQualitiesSelected}
          setKarma={setKarma}
        />
      </div>
    </Fragment>
  );
};

// interface IRatingProps {
//   quality: QualityType;
//   qualitiesList: QualityListType;
//   index: number;
//   setKarma: (removeKarma: boolean, difference: number) => void;
//   setQualities: (loadingQualities: QualityListType) => void;
// }

// const RatingComponent = function ({
//   quality,
//   qualitiesList,
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
//           const newQualities = [...qualitiesList];
//           const currentRating = qualitiesList[index].ratingSelected || 0;
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
  qualitiesList: QualityListType;
  selectedQualitiesList: QualityListType;
  setQualities: (loadingQualities: QualityListType) => void;
  setKarma: (removeKarma: boolean, difference: number) => void;
  index: number;
}

function QualityDropdownComponent({
  positive,
  currentValue,
  qualitiesList,
  selectedQualitiesList,
  setQualities,
  setKarma,
  index,
}: IQualityDropdownProps) {
  return (
    <Dropdown
      options={qualitiesList.map((quality) => {
        return quality.name;
      })}
      value={currentValue}
      onChange={(arg) => {
        const newQuality = qualitiesList.find((quality) => {
          return quality.name === arg.value;
        });

        if (newQuality) {
          if (index === -1) {
            setQualities([...selectedQualitiesList, newQuality]);
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
            const oldQuality = selectedQualitiesList[index];
            if (selectedQualitiesList.length - 1 === index) {
              setQualities([
                ...selectedQualitiesList.slice(0, index),
                newQuality,
              ]);
            } else {
              setQualities([
                ...selectedQualitiesList.slice(0, index),
                newQuality,
                ...selectedQualitiesList.slice(index + 1),
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
  selectedQualitiesList: QualityListType;
  setQualities: (loadingQualities: QualityListType) => void;
  setKarma: (removeKarma: boolean, difference: number) => void;
}

const QualitySelectionComponent = function ({
  positive,
  qualityList,
  selectedQualitiesList,
  setQualities,
  setKarma,
}: IQualitySelectionProps) {
  return (
    <div>
      {selectedQualitiesList.map((quality, index) => {
        return (
          <div key={index}>
            <QualityDropdownComponent
              currentValue={quality.name}
              positive={positive}
              selectedQualitiesList={selectedQualitiesList}
              qualitiesList={qualityList}
              setQualities={setQualities}
              setKarma={setKarma}
              index={index}
            />
            <p>{quality.description}</p>
            {/* {quality.subqualities && (
              <SubqualitiesComponent
                quality={quality}
                qualitiesList={qualitiesList}
                index={index}
                setKarma={setKarma}
                setQualities={setQualities}
              />
            )} */}
            <h4>Karma cost: {quality.karma} </h4>
            {/* {quality.maxRating && (
              <RatingComponent
                quality={quality}
                qualitiesList={qualitiesList}
                index={index}
                setKarma={setKarma}
                setQualities={setQualities}
              />
            )} */}
            <button
              onClick={() => {
                let difference = 0;
                const removedQuality = selectedQualitiesList[index];

                difference = removedQuality.karma;

                // difference *= removedQuality. || 1;
                setKarma(
                  removedQuality.category === qualityCategoryEnum.Negative,
                  difference
                );
                if (selectedQualitiesList.length - 1 === index) {
                  setQualities([...selectedQualitiesList.slice(0, index)]);
                } else {
                  setQualities([
                    ...selectedQualitiesList.slice(0, index),
                    ...selectedQualitiesList.slice(index + 1),
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
          currentValue={"Select a quality"}
          positive={positive}
          qualitiesList={qualityList}
          selectedQualitiesList={selectedQualitiesList}
          setQualities={setQualities}
          setKarma={setKarma}
          index={-1}
        />
      }
    </div>
  );
};
