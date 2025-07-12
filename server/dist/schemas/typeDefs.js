import { gql } from 'graphql-tag';
const typeDefs = gql `
  # ========== SCALAR TYPES ==========
  scalar Date

  # ========== OBJECT TYPES ==========

  type User {
    _id: ID!
    username: String!
    email: String!
    department: String
    role: String
    createdAt: Date
    shiftHistory: [ShiftLog]
  }

  type ShiftLog {
    _id: ID!
    date: String!
    shift: String!
    username: String!
    completedTasks: Int
    totalTasks: Int
    notes: String
    safetyTrends: String
    majorCallout: String
    yardUtilization: Float
    yardAccuracy: Float
    auditDefects: Int
    yardData: YardData
    lateDepartures: [LateDeparture]
    ycRoutines: YcRoutines
    createdAt: Date
    updatedAt: Date
  }

  type YardHealth {
    _id: ID!
    date: String!
    totalTrailers: Int
    yardUtilization: Float
    yardAccuracy: Float
    auditDefects: Int
    yardData: YardData
    lateDepartures: [LateDeparture]
    createdAt: Date
    updatedAt: Date
  }

  type YardData {
    storeLDO: Int
    ibFreight: Int
    emptyTarget: Int
    emptyOTR: Int
    emptyFulfillment: Int
    ldoFulfillment: Int
    udcTrailers: Int
    osvPM: Int
    emptyIBT: Int
    loadedIBT: Int
    goodPallet: Int
    badWoodPallet: Int
    csvPOD: Int
    sweep: Int
    udcSweeps: Int
    rejectedFreight: Int
  }

  type LateDeparture {
    loadId: String
    store: String
    trailer: String
    critical: String
    actual: String
    reason: String
  }

  type YcRoutines {
    departureEmails: Boolean
    nearMiss: Boolean
    audit: Boolean
    bols: Boolean
    emptyEmails: Boolean
  }

  type AuthPayload {
    token: String
    user: User
  }

  type MutationResponse {
    success: Boolean
    message: String
  }

  # ========== INPUT TYPES ==========

  input UserInput {
    username: String!
    email: String!
    password: String!
    department: String
    role: String
  }

  input UpdateUserInput {
    username: String
    email: String
    department: String
    role: String
  }

  input YardDataInput {
    storeLDO: Int
    ibFreight: Int
    emptyTarget: Int
    emptyOTR: Int
    emptyFulfillment: Int
    ldoFulfillment: Int
    udcTrailers: Int
    osvPM: Int
    emptyIBT: Int
    loadedIBT: Int
    goodPallet: Int
    badWoodPallet: Int
    csvPOD: Int
    sweep: Int
    udcSweeps: Int
    rejectedFreight: Int
  }

  input LateDepartureInput {
    loadId: String
    store: String
    trailer: String
    critical: String
    actual: String
    reason: String
  }

  input YcRoutinesInput {
    departureEmails: Boolean
    nearMiss: Boolean
    audit: Boolean
    bols: Boolean
    emptyEmails: Boolean
  }

  input ShiftLogInput {
    date: String!
    shift: String!
    username: String!
    completedTasks: Int
    totalTasks: Int
    notes: String
    safetyTrends: String
    majorCallout: String
    yardUtilization: Float
    yardAccuracy: Float
    auditDefects: Int
    yardData: YardDataInput
    lateDepartures: [LateDepartureInput]
    ycRoutines: YcRoutinesInput
  }

  input YardHealthInput {
    date: String!
    totalTrailers: Int
    yardUtilization: Float
    yardAccuracy: Float
    auditDefects: Int
    yardData: YardDataInput
    lateDepartures: [LateDepartureInput]
  }

  # ========== QUERIES ==========

  type Query {
    user(username: String!): User
    me: User
    users: [User]
    shiftLogs(username: String, dateRange: String): [ShiftLog]
    yardHealth(date: String): YardHealth
    recentShifts(limit: Int): [ShiftLog]
  }

  # ========== MUTATIONS ==========

  type Mutation {
    login(email: String!, password: String!): AuthPayload
    addUser(input: UserInput!): AuthPayload
    updateUser(input: UpdateUserInput!): User
    deleteUser(userId: ID!): User

    addShiftLog(input: ShiftLogInput!): ShiftLog
    updateShiftLog(id: ID!, input: ShiftLogInput!): ShiftLog
    deleteShiftLog(id: ID!): ShiftLog

    addYardHealth(input: YardHealthInput!): YardHealth
    updateYardHealth(id: ID!, input: YardHealthInput!): YardHealth

    sendPassdownEmail(shiftLogId: ID!, managerEmail: String!, message: String): MutationResponse

    updatePassword(currentPassword: String!, newPassword: String!): MutationResponse
    resetPassword(email: String!): MutationResponse
  }
`;
export default typeDefs;
