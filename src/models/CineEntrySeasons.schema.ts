export const CineEntrySeasonsSchema = {
  primaryKey: "seasonId",
  version: 0,
  type: "object",
  properties: {
    cineEntryId: {
      type: "string",
      maxLength: 100,
    },
    seasonId: {
      type: "string",
      maxLength: 100,
    },
    seasonNumber: {
      type: "number",
    },
    watched: {
      type: "boolean",
      default: false,
    },
  },
  required: ["cineEntryId", "seasonId", "seasonNumber"],
};
