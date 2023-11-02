export const CineEntrySchema = {
  primaryKey: "id",
  version: 0,
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: 100, // <- the primary key must have set maxLength
    },
    title: {
      type: "string",
    },
    type: {
      type: "string",
    },
    releaseDate: {
      type: "string",
    },
    posterPath: {
      type: "string",
    },
    watched: {
      type: "boolean",
    },
    seasons: {
      type: "array",
      items: {
        type: "object",
        properties: {
          seasonNumber: {
            type: "number",
          },
          episodes: {
            type: "array",
            items: {
              type: "object",
              properties: {
                episodeNumber: {
                  type: "number",
                },
                watched: {
                  type: "boolean",
                },
              },
            },
          },
        },
      },
    },
  },
  required: ["id", "title", "type"],
};
