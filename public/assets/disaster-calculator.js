const WATER_LITERS_PER_PERSON_DAY = 3;
const MEALS_PER_PERSON_DAY = 3;
const TOILETS_PER_PERSON_DAY = 5;
const TOILET_PAPER_ROLLS_PER_PERSON_WEEK = 1;
const GAS_CANISTERS_PER_PERSON_WEEK = 6;

function clampPerson(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.min(30, Math.max(0, Math.trunc(number)));
}

export function calculateDisasterStockpile({ adults, children, days }) {
  const adultCount = clampPerson(adults);
  const childCount = clampPerson(children);
  const people = adultCount + childCount;
  const dayCount = Number(days);

  if (people < 1) throw new RangeError('大人または子どもを1人以上指定してください。');
  if (!Number.isInteger(dayCount) || dayCount < 1 || dayCount > 30) {
    throw new RangeError('備蓄日数は1〜30日で指定してください。');
  }

  const waterLiters = people * dayCount * WATER_LITERS_PER_PERSON_DAY;
  return {
    people,
    waterLiters,
    twoLiterBottles: Math.ceil(waterLiters / 2),
    meals: people * dayCount * MEALS_PER_PERSON_DAY,
    portableToilets: people * dayCount * TOILETS_PER_PERSON_DAY,
    toiletPaperRolls: Math.ceil((people * dayCount * TOILET_PAPER_ROLLS_PER_PERSON_WEEK) / 7),
    gasCanisters: Math.ceil((people * dayCount * GAS_CANISTERS_PER_PERSON_WEEK) / 7),
  };
}
