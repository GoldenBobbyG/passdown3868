import { gql } from '@apollo/client';

export const CREATE_ITEM = gql`
    mutation CreateItem($input: CreateItemInput!) {
        createItem(input: $input) {
            id
            name
            description
        }
    }
`;

export const UPDATE_ITEM = gql`
    mutation UpdateItem($id: ID!, $input: UpdateItemInput!) {
        updateItem(id: $id, input: $input) {
            id
            name
            description
        }
    }
`;

export const DELETE_ITEM = gql`
    mutation DeleteItem($id: ID!) {
        deleteItem(id: $id) {
            id
        }
    }
`;

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
        email
        department
        role
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($input: UserInput!) {
    addUser(input: $input) {
      token
      user {
        _id
        username
        email
        department
        role
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation updateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      _id
      username
      email
      department
      role
    }
  }
`;

export const DELETE_USER = gql`
  mutation deleteUser($userId: ID!) {
    deleteUser(userId: $userId) {
      _id
      username
    }
  }
`;

export const ADD_SHIFT_LOG = gql`
  mutation addShiftLog($input: ShiftLogInput!) {
    addShiftLog(input: $input) {
      _id
      date
      shift
      username
      completedTasks
      totalTasks
      notes
      safetyTrends
      majorCallout
      yardUtilization
      yardAccuracy
      auditDefects
      yardData {
        storeLDO
        ibFreight
        emptyTarget
        emptyOTR
        emptyFulfillment
        ldoFulfillment
        udcTrailers
        osvPM
        emptyIBT
        loadedIBT
        goodPallet
        badWoodPallet
        csvPOD
        sweep
        udcSweeps
        rejectedFreight
      }
      lateDepartures {
        loadId
        store
        trailer
        critical
        actual
        reason
      }
      ycRoutines {
        departureEmails
        nearMiss
        audit
        bols
        emptyEmails
      }
      createdAt
    }
  }
`;

export const UPDATE_SHIFT_LOG = gql`
  mutation updateShiftLog($id: ID!, $input: ShiftLogInput!) {
    updateShiftLog(id: $id, input: $input) {
      _id
      date
      shift
      username
      completedTasks
      totalTasks
      notes
      safetyTrends
      majorCallout
      yardUtilization
      yardAccuracy
      auditDefects
      yardData {
        storeLDO
        ibFreight
        emptyTarget
        emptyOTR
        emptyFulfillment
        ldoFulfillment
        udcTrailers
        osvPM
        emptyIBT
        loadedIBT
        goodPallet
        badWoodPallet
        csvPOD
        sweep
        udcSweeps
        rejectedFreight
      }
      lateDepartures {
        loadId
        store
        trailer
        critical
        actual
        reason
      }
      ycRoutines {
        departureEmails
        nearMiss
        audit
        bols
        emptyEmails
      }
      updatedAt
    }
  }
`;

export const DELETE_SHIFT_LOG = gql`
  mutation deleteShiftLog($id: ID!) {
    deleteShiftLog(id: $id) {
      _id
      date
      shift
      username
    }
  }
`;

export const ADD_YARD_HEALTH = gql`
  mutation addYardHealth($input: YardHealthInput!) {
    addYardHealth(input: $input) {
      _id
      date
      totalTrailers
      yardUtilization
      yardAccuracy
      auditDefects
      yardData {
        storeLDO
        ibFreight
        emptyTarget
        emptyOTR
        emptyFulfillment
        ldoFulfillment
        udcTrailers
        osvPM
        emptyIBT
        loadedIBT
        goodPallet
        badWoodPallet
        csvPOD
        sweep
        udcSweeps
        rejectedFreight
      }
      lateDepartures {
        loadId
        store
        trailer
        critical
        actual
        reason
      }
      createdAt
    }
  }
`;

export const UPDATE_YARD_HEALTH = gql`
  mutation updateYardHealth($id: ID!, $input: YardHealthInput!) {
    updateYardHealth(id: $id, input: $input) {
      _id
      date
      totalTrailers
      yardUtilization
      yardAccuracy
      auditDefects
      yardData {
        storeLDO
        ibFreight
        emptyTarget
        emptyOTR
        emptyFulfillment
        ldoFulfillment
        udcTrailers
        osvPM
        emptyIBT
        loadedIBT
        goodPallet
        badWoodPallet
        csvPOD
        sweep
        udcSweeps
        rejectedFreight
      }
      lateDepartures {
        loadId
        store
        trailer
        critical
        actual
        reason
      }
      updatedAt
    }
  }
`;

export const SEND_PASSDOWN_EMAIL = gql`
  mutation sendPassdownEmail($shiftLogId: ID!, $managerEmail: String!, $message: String) {
    sendPassdownEmail(shiftLogId: $shiftLogId, managerEmail: $managerEmail, message: $message) {
      success
      message
    }
  }
`;

export const UPDATE_PASSWORD = gql`
  mutation updatePassword($currentPassword: String!, $newPassword: String!) {
    updatePassword(currentPassword: $currentPassword, newPassword: $newPassword) {
      success
      message
    }
  }
`;

export const RESET_PASSWORD = gql`
  mutation resetPassword($email: String!) {
    resetPassword(email: $email) {
      success
      message
    }
  }
`;