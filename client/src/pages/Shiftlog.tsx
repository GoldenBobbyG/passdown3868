import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_SHIFT_LOG } from "../utils/mutations";
import Auth from "../utils/auth";

type SafetyEvent = {
    trend: string;
    incidents: string;
    majorCallouts: string;
};

type LateDeparture = {
    storeNumber: string;
    loadId: string;
    trailerNumber: string;
    criticalDeparture: string;
    actualDeparture: string;
    reason: string;
};

type YCRoutineChecks = {
    bolsProcessed: boolean;
    yardAuditsDone: boolean;
    carrierEmptyEmailSent: boolean;
};

type YardHealth = {
    totalTrailers: number;
    ldo: number;
    ibt: number;
    osv: number;
    utilization: number;
    accuracy: number;
};

const initialChecks: YCRoutineChecks = {
    bolsProcessed: false,
    yardAuditsDone: false,
    carrierEmptyEmailSent: false,
};

export default function ShiftLog() {
    // Check if user is logged in
    if (!Auth.loggedIn()) {
        return <div>Please log in to view shift logs.</div>;
    }

    const userProfile = Auth.getProfile();
    const [safety, setSafety] = useState<SafetyEvent>({
        trend: "",
        incidents: "",
        majorCallouts: "",
    });
    const [lateDepartures, setLateDepartures] = useState<LateDeparture[]>([]);
    const [lateDepInput, setLateDepInput] = useState<LateDeparture>({
        storeNumber: "",
        loadId: "",
        trailerNumber: "",
        criticalDeparture: "",
        actualDeparture: "",
        reason: "",
    });
    const [checks, setChecks] = useState<YCRoutineChecks>(initialChecks);
    const [yardHealth, setYardHealth] = useState<YardHealth>({
        totalTrailers: 0,
        ldo: 0,
        ibt: 0,
        osv: 0,
        utilization: 0,
        accuracy: 0,
    });

    const [addShiftLog, { loading, error }] = useMutation(ADD_SHIFT_LOG, {
        onCompleted: () => {
            alert("Shift log submitted successfully!");
            // Reset form or redirect
        },
        onError: (error) => {
            console.error("Error submitting shift log:", error);
            alert("Error submitting shift log. Please try again.");
        }
    });

    function handleLateDepAdd() {
        setLateDepartures([...lateDepartures, lateDepInput]);
        setLateDepInput({
            storeNumber: "",
            loadId: "",
            trailerNumber: "",
            criticalDeparture: "",
            actualDeparture: "",
            reason: "",
        });
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        
        const shiftLogInput = {
            date: new Date().toISOString().split('T')[0],
            shift: "Day", // or get from state
            username: userProfile?.data?.username,
            safetyTrends: safety.trend,
            majorCallout: safety.majorCallouts,
            // Map your data to match GraphQL schema
            yardData: {
                storeLDO: yardHealth.ldo,
                ibFreight: 0, // Add appropriate mapping
                emptyTarget: 0,
                emptyOTR: 0,
                emptyFulfillment: 0,
                ldoFulfillment: 0,
                udcTrailers: 0,
                osvPM: 0,
                emptyIBT: yardHealth.ibt,
                loadedIBT: 0,
                goodPallet: 0,
                badWoodPallet: 0,
                csvPOD: 0,
                sweep: 0,
                udcSweeps: 0,
                rejectedFreight: 0
            },
            lateDepartures: lateDepartures.map(dep => ({
                loadId: dep.loadId,
                store: dep.storeNumber,
                trailer: dep.trailerNumber,
                critical: dep.criticalDeparture,
                actual: dep.actualDeparture,
                reason: dep.reason
            })),
            ycRoutines: {
                departureEmails: false,
                nearMiss: false,
                audit: checks.yardAuditsDone,
                bols: checks.bolsProcessed,
                emptyEmails: checks.carrierEmptyEmailSent
            },
            yardUtilization: yardHealth.utilization,
            yardAccuracy: yardHealth.accuracy,
            auditDefects: 0,
            completedTasks: 0,
            totalTasks: 0
        };

        addShiftLog({
            variables: { input: shiftLogInput }
        });
    }

    return (
        <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
            <h1>Shift Log</h1>
            {error && <div style={{ color: 'red' }}>Error: {error.message}</div>}
            
            <form onSubmit={handleSubmit}>
                <section>
                    <h2>1. Safety Events</h2>
                    <label>
                        Daily Safety Trends
                        <input
                            type="text"
                            value={safety.trend}
                            onChange={e => setSafety({ ...safety, trend: e.target.value })}
                        />
                    </label>
                    <label>
                        Incidents or Near Misses
                        <input
                            type="text"
                            value={safety.incidents}
                            onChange={e => setSafety({ ...safety, incidents: e.target.value })}
                        />
                    </label>
                    <label>
                        Major Callouts
                        <input
                            type="text"
                            value={safety.majorCallouts}
                            onChange={e => setSafety({ ...safety, majorCallouts: e.target.value })}
                        />
                    </label>
                </section>

                <section>
                    <h2>2. Late Departures</h2>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <input
                            placeholder="Store #"
                            value={lateDepInput.storeNumber}
                            onChange={e => setLateDepInput({ ...lateDepInput, storeNumber: e.target.value })}
                        />
                        <input
                            placeholder="Load ID"
                            value={lateDepInput.loadId}
                            onChange={e => setLateDepInput({ ...lateDepInput, loadId: e.target.value })}
                        />
                        <input
                            placeholder="Trailer #"
                            value={lateDepInput.trailerNumber}
                            onChange={e => setLateDepInput({ ...lateDepInput, trailerNumber: e.target.value })}
                        />
                        <input
                            placeholder="Critical Departure"
                            type="time"
                            value={lateDepInput.criticalDeparture}
                            onChange={e => setLateDepInput({ ...lateDepInput, criticalDeparture: e.target.value })}
                        />
                        <input
                            placeholder="Actual Departure"
                            type="time"
                            value={lateDepInput.actualDeparture}
                            onChange={e => setLateDepInput({ ...lateDepInput, actualDeparture: e.target.value })}
                        />
                        <input
                            placeholder="Reason"
                            value={lateDepInput.reason}
                            onChange={e => setLateDepInput({ ...lateDepInput, reason: e.target.value })}
                        />
                        <button type="button" onClick={handleLateDepAdd}>
                            Add
                        </button>
                    </div>
                    <ul>
                        {lateDepartures.map((dep, i) => (
                            <li key={i}>
                                Store {dep.storeNumber}, Load {dep.loadId}, Trailer {dep.trailerNumber} | Critical: {dep.criticalDeparture} | Actual: {dep.actualDeparture} | Reason: {dep.reason}
                            </li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h2>3. YC Routine Checks</h2>
                    <label>
                        <input
                            type="checkbox"
                            checked={checks.bolsProcessed}
                            onChange={e => setChecks({ ...checks, bolsProcessed: e.target.checked })}
                        />
                        BOLs Processed
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={checks.yardAuditsDone}
                            onChange={e => setChecks({ ...checks, yardAuditsDone: e.target.checked })}
                        />
                        Yard Audits Done
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={checks.carrierEmptyEmailSent}
                            onChange={e => setChecks({ ...checks, carrierEmptyEmailSent: e.target.checked })}
                        />
                        Carrier Empty Email Sent
                    </label>
                </section>

                <section>
                    <h2>4. Yard Health Snapshot</h2>
                    <label>
                        Total Trailers on Yard
                        <input
                            type="number"
                            value={yardHealth.totalTrailers}
                            onChange={e => setYardHealth({ ...yardHealth, totalTrailers: Number(e.target.value) })}
                        />
                    </label>
                    <label>
                        LDO
                        <input
                            type="number"
                            value={yardHealth.ldo}
                            onChange={e => setYardHealth({ ...yardHealth, ldo: Number(e.target.value) })}
                        />
                    </label>
                    <label>
                        IBT
                        <input
                            type="number"
                            value={yardHealth.ibt}
                            onChange={e => setYardHealth({ ...yardHealth, ibt: Number(e.target.value) })}
                        />
                    </label>
                    <label>
                        OSV
                        <input
                            type="number"
                            value={yardHealth.osv}
                            onChange={e => setYardHealth({ ...yardHealth, osv: Number(e.target.value) })}
                        />
                    </label>
                    <label>
                        Utilization %
                        <input
                            type="number"
                            value={yardHealth.utilization}
                            onChange={e => setYardHealth({ ...yardHealth, utilization: Number(e.target.value) })}
                        />
                    </label>
                    <label>
                        Accuracy %
                        <input
                            type="number"
                            value={yardHealth.accuracy}
                            onChange={e => setYardHealth({ ...yardHealth, accuracy: Number(e.target.value) })}
                        />
                    </label>
                </section>

                <button type="submit" disabled={loading}>
                    {loading ? "Submitting..." : "Submit Shift Log"}
                </button>
            </form>
        </div>
    );
}