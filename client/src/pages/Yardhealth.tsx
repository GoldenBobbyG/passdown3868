import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { QUERY_YARD_HEALTH } from "../utils/queries";
import { ADD_YARD_HEALTH } from "../utils/mutations";
import { Form, Row, Col, Button, Card, Alert, Spinner } from "react-bootstrap";

export interface YardData {
  storeLDO: number;
  ibFreight: number;
  emptyTargetDelivery: number;
  emptyOTR: number;
  emptyFulfillment: number;
  ldoFulfillment: number;
  udcTrailers: number;
  osvPM: number;
  emptyIBT: number;
  rejectedFreight: number;
  // Add your other properties here
}

export type YardDataKey = keyof YardData;

const initialHealthState = {
  storeLDO: 0, ibFreight: 0, emptyTargetDelivery: 0, emptyOTR: 0,
  emptyFulfillment: 0, ldoFulfillment: 0, udcTrailers: 0, osvPM: 0,
  emptyIBT: 0, loadedIBT: 0, goodPallet: 0, badWoodPallet: 0,
  csvPOD: 0, sweep: 0, udcSweeps: 0, rejectedFreight: 0
};

const YardHealth = () => {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [shift, setShift] = useState("Day");
  const [auditDefects, setAuditDefects] = useState(0);
  const [yardData, setYardData] = useState(initialHealthState);
  const [totalSpaces, setTotalSpaces] = useState(200);
  const [success, setSuccess] = useState(false);

  const { loading: queryLoading, error: queryError, } = useQuery(QUERY_YARD_HEALTH, {
    variables: { date },
  });

  const [submitYardHealth, { loading: mutationLoading }] = useMutation(ADD_YARD_HEALTH);

  const handleChange = (key:string, value:number) => {
    setYardData({ ...yardData, [key]: value });
  };

  const totalTrailers = Object.values(yardData).reduce((sum, val) => sum + Number(val || 0), 0);
  const yardUtilization = totalSpaces ? ((totalTrailers / totalSpaces) * 100).toFixed(1) : "0";
  const yardAccuracy = totalTrailers ? (((totalTrailers - auditDefects) / totalTrailers) * 100).toFixed(1) : "N/A";

  const handleSubmit = async () => {
    try {
      await submitYardHealth({
        variables: {
          input: {
            date,
            shift,
            auditDefects,
            trailerHealth: yardData,
            yardUtilization: parseFloat(yardUtilization),
            yardAccuracy: yardAccuracy === "N/A" ? null : parseFloat(yardAccuracy)
          }
        }
      });
      setSuccess(true);
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  if (queryLoading) return <Spinner animation="border" />;
  if (queryError) return <Alert variant="danger">Error loading yard data.</Alert>;

  return (
    <div className="container py-4">
      <h2>Yard Health Report</h2>

      {success && <Alert variant="success">Yard Health submitted successfully!</Alert>}

      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Date</Form.Label>
            <Form.Control type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Shift</Form.Label>
            <Form.Select value={shift} onChange={(e) => setShift(e.target.value)}>
              <option value="Day">Day</option>
              <option value="Night">Night</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Total Yard Spaces</Form.Label>
            <Form.Control
              type="number"
              value={totalSpaces}
              onChange={(e) => setTotalSpaces(Number(e.target.value))}
              min="1"
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="g-3">
        {Object.keys(yardData).map((key) => (
          <Col md={4} key={key}>
            <Form.Group>
              <Form.Label>{key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}</Form.Label>
              <Form.Control
                type="number"
                value={yardData[key as YardDataKey] || ""}
                onChange={(e) => handleChange(key, Number(e.target.value))}
                min="0"
              />
            </Form.Group>
          </Col>
        ))}
      </Row>

      <Card className="mt-4">
        <Card.Body>
          <Card.Title>Summary</Card.Title>
          <p><strong>Total Trailers:</strong> {totalTrailers}</p>
          <p><strong>Yard Utilization:</strong> {yardUtilization}%</p>
          <Form.Group className="mb-3">
            <Form.Label>Audit Defects</Form.Label>
            <Form.Control
              type="number"
              value={auditDefects}
              onChange={(e) => setAuditDefects(Number(e.target.value))}
              min="0"
            />
          </Form.Group>
          <p><strong>Yard Accuracy:</strong> {yardAccuracy}%</p>
        </Card.Body>
      </Card>

      <Button className="mt-3" onClick={handleSubmit} disabled={mutationLoading}>
        {mutationLoading ? "Submitting..." : "Submit Report"}
      </Button>
    </div>
  );
};

export default YardHealth;
