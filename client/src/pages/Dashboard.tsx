import { useState, type JSXElementConstructor, type Key, type ReactElement, type ReactNode, type ReactPortal } from "react";
import { useQuery } from '@apollo/client';
import { QUERY_RECENT_SHIFTS, QUERY_ME } from '../utils/queries';
import { Link } from 'react-router-dom';
import Auth from '../utils/auth';

type LateDeparture = {
  loadId: string;
  store: string;
  trailer: string;
  critical: string;
  actual: string;
  reason: string;
};

type YcRoutines = {
  departureEmails: boolean;
  nearMiss: boolean;
  audit: boolean;
  bols: boolean;
  emptyEmails: boolean;
};

type YardData = {
  storeLDO: number;
  ibFreight: number;
  emptyTarget: number;
  emptyOTR: number;
  emptyFulfillment: number;
  ldoFulfillment: number;
  udcTrailers: number;
  osvPM: number;
  emptyIBT: number;
  loadedIBT: number;
  goodPallet: number;
  badWoodPallet: number;
  csvPOD: number;
  sweep: number;
  udcSweeps: number;
  rejectedFreight: number;
};

const Dashboard = () => {
  // Check if user is logged in
  if (!Auth.loggedIn()) {
    return <div>Please log in to view your dashboard.</div>;
  }

  const userProfile = Auth.getProfile();
  
  // Fetch recent shifts for dashboard overview
  const { loading, data } = useQuery(QUERY_RECENT_SHIFTS, {
    variables: { limit: 1 }
  });

  const recentShifts = data?.recentShifts || [];

  const [shift, setShift] = useState("Day");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [safetyTrends, setSafetyTrends] = useState("");
  const [majorCallout, setMajorCallout] = useState("");
  const [lateDepartures, setLateDepartures] = useState<LateDeparture[]>([
    { loadId: "", store: "", trailer: "", critical: "", actual: "", reason: "" },
  ]);
  const [ycRoutines, setYcRoutines] = useState<YcRoutines>({
    departureEmails: false,
    nearMiss: false,
    audit: false,
    bols: false,
    emptyEmails: false,
  });

  const [yardData, setYardData] = useState<YardData>({
    storeLDO: 0, ibFreight: 0, emptyTarget: 0, emptyOTR: 0,
    emptyFulfillment: 0, ldoFulfillment: 0, udcTrailers: 0, osvPM: 0,
    emptyIBT: 0, loadedIBT: 0, goodPallet: 0, badWoodPallet: 0,
    csvPOD: 0, sweep: 0, udcSweeps: 0, rejectedFreight: 0
  });
  const [auditDefects, setAuditDefects] = useState(0);
  const totalYardSpaces = 200; // Set based on yard capacity

  const totalTrailers = Object.values(yardData).reduce((acc, val) => acc + Number(val || 0), 0);
  const yardUtilization = ((totalTrailers / totalYardSpaces) * 100).toFixed(1);
  const yardAccuracy = totalTrailers === 0
    ? "N/A"
    : (((totalTrailers - auditDefects) / totalTrailers) * 100).toFixed(1);

  const updateLateDeparture = (
    i: number,
    field: keyof LateDeparture,
    value: string
  ) => {
    const updated = [...lateDepartures];
    updated[i][field] = value;
    setLateDepartures(updated);
  };

  const addDepartureRow = () => {
    setLateDepartures([...lateDepartures, { loadId: "", store: "", trailer: "", critical: "", actual: "", reason: "" }]);
  };

  return (
    <div className="container-fluid p-4">
      <main>
        <div className="flex-row justify-center">
          <div className="col-12 col-md-10 mb-3 p-3" style={{ border: '1px dotted #1a1a1a' }}>
            <h2>Welcome back, {userProfile?.data?.username}!</h2>
            <h3>Current Shift Status</h3>
            {/* Your shift turnover content */}
          </div>
        </div>
      </main>

      {/* Shift and Date Selection */}
      <div className="flex items-center gap-4">
        <label>
          Shift:
          <select value={shift} onChange={e => setShift(e.target.value)} className="border p-2 rounded ml-2">
            <option value="Day">Day</option>
            <option value="Night">Night</option>
          </select>
        </label>
        <label>
          Date:
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="border p-2 rounded ml-2"
          />
        </label>
      </div>

      {/* Safety Trends and Major Callout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold">Safety Trends</label>
          <textarea
            className="w-full border p-2 rounded"
            value={safetyTrends}
            onChange={e => setSafetyTrends(e.target.value)}
          />
        </div>
        <div>
          <label className="block font-semibold">Major Callout</label>
          <textarea
            className="w-full border p-2 rounded"
            value={majorCallout}
            onChange={e => setMajorCallout(e.target.value)}
          />
        </div>
      </div>

      {/* Late Departures Table */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Late Departures</h2>
        <table className="w-full border text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th>Load ID</th>
              <th>Store #</th>
              <th>Trailer #</th>
              <th>Critical Time</th>
              <th>Actual Time</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {lateDepartures.map((row, i) => (
              <tr key={i} className="border-t">
                {(Object.keys(row) as (keyof LateDeparture)[]).map(field => (
                  <td key={field}>
                    <input
                      className="w-full border p-1"
                      value={row[field]}
                      onChange={e => updateLateDeparture(i, field, e.target.value)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={addDepartureRow} className="mt-2 bg-blue-600 text-white px-4 py-1 rounded">+ Add Row</button>
      </div>

      {/* YC Routines */}
      <div>
        <h2 className="text-xl font-semibold">YC Routines</h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.keys(ycRoutines).map(key => (
            <label key={key} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={ycRoutines[key as keyof YcRoutines]}
                onChange={() => setYcRoutines({ ...ycRoutines, [key]: !ycRoutines[key as keyof YcRoutines] })}
              />
              {key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}
            </label>
          ))}
        </div>
      </div>

      {/* Yard Health Inputs */}
      <div>
        <h2 className="text-xl font-semibold">Yard Health</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.keys(yardData).map(field => (
            <div key={field}>
              <label className="block capitalize">{field.replace(/([A-Z])/g, " $1")}</label>
              <input
                type="number"
                className="w-full border p-2"
                value={yardData[field as keyof YardData]}
                onChange={e => setYardData({ ...yardData, [field]: Number(e.target.value) })}
                min="0"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Yard Health Calculations */}
      <div className="mt-6 p-4 bg-white rounded shadow-md">
        <h3 className="text-lg font-bold mb-2">Live Yard Stats</h3>
        <p><strong>Total Trailers:</strong> {totalTrailers}</p>
        <p><strong>Yard Utilization:</strong> {yardUtilization}% of {totalYardSpaces} spots</p>
        <div className="mt-2">
          <label className="block font-semibold">Audit Defects</label>
          <input
            type="number"
            className="border p-2 rounded"
            value={auditDefects}
            onChange={e => setAuditDefects(Number(e.target.value))}
            min="0"
          />
        </div>
        <p className="mt-2"><strong>Yard Accuracy:</strong> {yardAccuracy}%</p>
      </div>

      {/* Recent Shifts Overview */}
      <div className="card mt-4">
        <div className="card-header">
          <h4>Recent Shifts</h4>
        </div>
        <div className="card-body">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Shift</th>
                    <th>Completion</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentShifts.map((shift: { _id: Key | null | undefined; date: string | number | Date; shift: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; completedTasks: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; totalTasks: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
                    <tr key={shift._id}>
                      <td>{new Date(shift.date).toLocaleDateString()}</td>
                      <td>{shift.shift}</td>
                      <td>{shift.completedTasks}/{shift.totalTasks}</td>
                      <td>
                        <Link to={`/shiftlog/${shift._id}`}>View Details</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
