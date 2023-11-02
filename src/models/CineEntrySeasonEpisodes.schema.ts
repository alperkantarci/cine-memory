export const CineEntrySeasonEpisodesSchema = {
  primaryKey: "episodeId",
  version: 0,
  type: "object",
  properties: {
    episodeId: {
      type: "string",
      maxLength: 100,
    },
    seasonNumber: {
      type: "number",
    },
    episodeNumber: {
      type: "number",
    },
    title: {
      type: "string",
    },
    watched: {
      type: "boolean",
      default: false,
    },
  },
  required: ["cineEntryId", "seasonId", "seasonNumber"],
};
