const regex = /(-(webkit|moz|o|ms)-)(.*)/i;

export default (value: string): string | null => {
  const matches = value.match(regex);
  return matches ? matches[matches.length - 1] : matches;
};