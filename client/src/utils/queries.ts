import { gql } from '@apollo/client';

export const QUERY_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      email
      createdAt
      department
      role
      shiftHistory {
        _id
        date
        shift
        completedTasks
        totalTasks
        notes
        safetyTrends
        majorCallout
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
      }
    }
  }
`;

export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      email
      createdAt
      department
      role
      shiftHistory {
        _id
        date
        shift
        completedTasks
        totalTasks
        notes
        safetyTrends
        majorCallout
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
      }
    }
  }
`;

export const QUERY_ALL_USERS = gql`
  query users {
    users {
      _id
      username
      email
      createdAt
      department
      role
    }
  }
`;

export const QUERY_SHIFT_LOGS = gql`
  query shiftLogs($username: String, $dateRange: String) {
    shiftLogs(username: $username, dateRange: $dateRange) {
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
      createdAt
    }
  }
`;

export const QUERY_YARD_HEALTH = gql`
  query yardHealth($date: String) {
    yardHealth(date: $date) {
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
    }
  }
`;

export const QUERY_RECENT_SHIFTS = gql`
  query recentShifts($limit: Int) {
    recentShifts(limit: $limit) {
      _id
      date
      shift
      username
      completedTasks
      totalTasks
      yardUtilization
      yardAccuracy
      createdAt
    }
  }
`;