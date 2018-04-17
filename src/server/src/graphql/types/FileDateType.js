export default `
type DataDates {
  voterFileDate:isoDate
  earlyVoteDataDate:isoDate
}

type Query {
  dataDates: DataDates
}
`;
