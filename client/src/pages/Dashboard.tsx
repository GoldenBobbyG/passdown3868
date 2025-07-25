import { useState, useRef } from "react";
import { useQuery } from '@apollo/client';
import { QUERY_RECENT_SHIFTS } from '../utils/queries.js';
import { Link } from 'react-router-dom';
import Auth from '../utils/auth';
import html2canvas from 'html2canvas';

// This commit adds a dashboard page that includes: Late Departures, Yard Health, Safety Trends, Major Callouts, and Recent Shifts.
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
// This commit completes the dashboard page with functionality to manage late departures, yard health, safety trends, major callouts, and recent shifts.
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
// If no data is returned, use an empty array
  // This ensures that recentShifts is always defined
  // and avoids potential errors when mapping over it.
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
// This commit calculates yard utilization and accuracy based on the yard data.
  // Calculate total trailers and utilization
  const totalTrailers = Object.values(yardData).reduce((acc, val) => acc + Number(val || 0), 0);
  const yardUtilization = ((totalTrailers / totalYardSpaces) * 100).toFixed(1);
  const yardAccuracy = totalTrailers === 0
    ? "N/A"
    : (((totalTrailers - auditDefects) / totalTrailers) * 100).toFixed(1);
// This commit adds functionality to update late departures, add new rows, and manage yard health inputs.
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

  const dashboardRef = useRef<HTMLDivElement>(null);
  const [isSending, setIsSending] = useState(false);
  const [emailStatus, setEmailStatus] = useState<string>('');

  const sendDashboardEmail = async () => {
    if (!dashboardRef.current) return;

    setIsSending(true);
    setEmailStatus('Capturing dashboard...');

    try {
      // Capture the dashboard as an image
      const canvas = await html2canvas(dashboardRef.current, {
        background: '#ffffff',
        logging: false,
        useCORS: true,
      });

      // Convert canvas to blob
      canvas.toBlob(async (blob) => {
        if (!blob) {
          throw new Error('Failed to create image');
        }

        setEmailStatus('Sending email...');

        // Create FormData to send image
        const formData = new FormData();
        formData.append('image', blob, 'dashboard.png');
        formData.append('userEmail', userProfile?.data?.email || '');
        formData.append('username', userProfile?.data?.username || '');
        formData.append('date', date);
        formData.append('shift', shift);

        // Send to backend
        const response = await fetch('http://localhost:3001/api/send-dashboard-image', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          setEmailStatus('✅ Dashboard sent successfully!');
          setTimeout(() => setEmailStatus(''), 3000);
        } else {
          throw new Error(result.error || 'Failed to send email');
        }
      }, 'image/png');

    } catch (error) {
      console.error('Error sending dashboard:', error);
      setEmailStatus('❌ Failed to send dashboard');
      setTimeout(() => setEmailStatus(''), 3000);
    } finally {
      setIsSending(false);
    }
  };

// This commit is the welcome message and main structure of the dashboard page.
  return (
    <div className="container-fluid p-4">
      {/* Wrap the content you want to capture in the ref */}
      <div ref={dashboardRef} style={{ backgroundColor: '#CC0000', padding: '100px' }}>
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
      </div>

      {/* Email controls outside the captured area */}
      <div className="mt-6 text-center">
        <button
          onClick={sendDashboardEmail}
          disabled={isSending}
          className="btn btn-lg"
          style={{
            backgroundColor: '#CC0000',
            borderColor: '#000000',
            color: 'white',
            minWidth: '200px'
          }}
        >
          {isSending ? 'Sending...' : 'Send Dashboard to Email'}
        </button>
        
        {emailStatus && (
          <div className="mt-2">
            <span className={emailStatus.includes('✅') ? 'text-success' : emailStatus.includes('❌') ? 'text-danger' : 'text-info'}>
              {emailStatus}
            </span>
          </div>
        )}
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
                  {recentShifts.map((shift: any) => (
                    <tr key={shift._id}>
                      <td className="text-center align-middle">
                        {new Date(shift.date).toLocaleDateString()}
                      </td>
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
