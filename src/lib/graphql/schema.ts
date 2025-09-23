export const typeDefs = `
  type Image {
    id: ID!
    title: String!
    description: String
    thumbnail: String!
    fullImage: String!
    tags: [String!]!
    createdAt: String!
    updatedAt: String!
    fileSize: Int!
    width: Int!
    height: Int!
  }

  type Tag {
    id: ID!
    name: String!
    count: Int!
  }

  input ImageUploadInput {
    title: String!
    description: String
    tags: [String!]
    file: String!
  }

  type Query {
    images(limit: Int, offset: Int, sortBy: String): [Image!]!
    image(id: ID!): Image
    searchImages(query: String!, limit: Int, offset: Int): [Image!]!
    tags: [Tag!]!
  }

  type Mutation {
    uploadImage(input: ImageUploadInput!): Image!
  }
`;
