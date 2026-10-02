🏥 Hospital Resource Allocation — Greedy Algorithm Prototype

A responsive, client-side web application designed to allocate scarce hospital resources (ICU/Emergency/General beds, specialized doctors, and critical medical equipment) to incoming patients strictly prioritized by emergency severity and arrival time using a Greedy Algorithm.

🌟 Key Features

📊 Executive Clinical Dashboard

Live metrics: Total Patients, Critical Patients, Available Beds, Available Doctors, Available Equipment, Allocated Resources, and Waiting Patients.
Interactive visual charts (Emergency Priority Breakdown and Resource Capacity Utilization).
Live patient queue table with instant status indicators and quick-action buttons.

👥 Patient Intake & Registry (Add Patient)

Form with input validation: Patient Name, Unique ID, Age (1–120), Emergency Level, Required Bed Type, Doctor Specialization, Equipment, and Arrival Timestamp.
Dynamic Emergency Priority Scoring:
Critical = 4 (Immediate life threat)
Serious = 3 (Acute instability)
Moderate = 2 (Urgent care)
Normal = 1 (Standard non-critical care)
Real-time tie-breaker timestamps (FIFO within same emergency priority score).

🏥 Hospital Resource Management

Categorized tabs: Hospital Beds (ICU, Emergency, General), Specialized Doctors (Cardiologist, General Physician, Pulmonologist, Neurologist, Orthopedic), and Medical Equipment (Ventilators, Monitors, Oxygen).
Track availability, active clinical assignments, manual offline/maintenance toggles, and resource addition.

⚡ Automatic Resource Allocation (Greedy Algorithm)

Click “Allocate Resources” to run the greedy allocation engine across all admitted patients.
Sorting Strategy:
Primary Key: Priority Score in descending order (4 > 3 > 2 > 1).
Secondary Key: Earliest arrival timestamp (FIFO tie-breaker).
Atomic Resource Validation: Validates that matching Bed Type, Doctor Specialization, and Medical Equipment are all available simultaneously before dispatching.
If any resource is missing, the patient is marked as Waiting and the bottleneck resource is identified.

🔍 Explainable Allocation & Bottleneck Tracking

Allocated Explanation:
“Patient allocated because emergency priority is Critical and ICU bed, Cardiologist, and Ventilator are available.”
Waiting Explanation:
“Patient waiting because no General Physician is currently available.”

🧪 What-If Simulation Sandbox

Test hypothetical disruptions without altering live patient records:
Remove 1 available Bed.
Remove 1 Doctor.
Mark 1 Equipment item as unavailable (e.g., Ventilator maintenance).
One-click presets: Ventilator Shortage, Zero ICU Beds.
Generates side-by-side comparison tables with delta counts (Allocated Before vs After, Waiting Before vs After, Critical Coverage %) and automated bottleneck diagnosis.

📈 Operations & Analytics Reporting

KPI metrics: Total Patients, Allocated Patients, Waiting Patients, and Average Waiting Time (in minutes/hours).
Resource utilization percentage bars for Beds, Doctors, and Equipment.
Clinical insights: Most Requested Resource, Most Common Emergency Level, and Critical Care Fulfillment rate.
Printable report view (window.print()).
🎨 Visual Design & Color Palette
Critical: #dc2626 (Medical Red)
Serious: #ea580c (Emergency Orange)
Moderate: #d97706 (Amber Yellow)
Normal: #16a34a (Clinical Green)
Allocated: #0284c7 (Operational Blue)
Waiting: #c2410c / #fef2f2 (Warning Rose/Orange)
Treated / Discharged: #475569 (Slate Grey)
📋 Default Pre-loaded Sample Data
Patients
ID	Patient Name	Age	Emergency Level	Priority Score	Bed Required	Doctor Required	Equipment Required
P001	Rahul Sharma	56	Critical	4	ICU	Cardiologist	Ventilator
P002	Ananya Rao	34	Serious	3	Emergency	General Physician	Monitor
P003	Vikram Kumar	22	Moderate	2	General	General Physician	None
P004	Meena Das	45	Normal	1	General	General Physician	None
Resources
ICU Bed 1: Available
Emergency Bed 1: Available
General Bed 1: Available
Cardiologist 1: Available
General Physician 1: Available
Ventilator 1: Available
Monitor 1: Available
🚀 Step-by-Step Demo Walkthrough

Follow this 10-step sequence to verify all system behaviors:

Open the Dashboard:
Notice 4 initial patients in queue, 3 available beds, 2 available doctors, 2 available equipment units. All patients start in Waiting state.
View Available Resources:
Click Resources in the sidebar. Confirm all sample resources are marked Available.
Inspect Sample Patients:
Click Patients in the sidebar to view P001–P004 with their corresponding emergency levels (Critical=4 to Normal=1).
Trigger Allocation:
Click the “Allocate Resources” button in the header or sidebar.
Verify Priority Allocation:
Rahul Sharma (P001, Critical, Score 4) is allocated first with ICU Bed 1, Cardiologist 1, Ventilator 1.
Ananya Rao (P002, Serious, Score 3) is allocated second with Emergency Bed 1, General Physician 1, Monitor 1.
Verify Waiting Queue & Explanations:
Vikram Kumar (P003, Moderate, Score 2) remains Waiting with explanation:
“Patient waiting because no General Physician is currently available.” (Doctor is occupied with P002).
Meena Das (P004, Normal, Score 1) remains Waiting for the same reason.
Mark Patient as Treated:
On Ananya Rao (P002), click “Mark as Treated”.
Her assigned resources (Emergency Bed 1, General Physician 1, Monitor 1) are immediately released back into the available pool.
Verify Freed Resources:
The dashboard counters for Available Beds and Available Doctors automatically increment.
Re-run Allocation:
Click “Allocate Resources” again.
Vikram Kumar (P003, Moderate) now receives General Bed 1 and the freed General Physician 1!
Meena Das (P004, Normal) now waits for a General Bed (as General Bed 1 is occupied by Vikram).
Examine Reports & What-If Simulation:
Navigate to What-if Simulation, simulate removing a Ventilator, and observe the immediate shortfall for Critical patients.
Navigate to Reports to review resource utilization percentages, average wait time, and most requested equipment.
💻 How to Run Locally

Because the application is built entirely using vanilla HTML5, CSS3, and JavaScript with localStorage, no web server or backend installation is required.

Option 1: Direct Browser Launch
Navigate to: C:\Users\asneh\.gemini\antigravity\scratch\hospital-resource-allocation
Double-click index.html to open it in Chrome, Edge, Firefox, or Safari.
Option 2: Local HTTP Server (Optional)

If you prefer running via a local server:

bash
# Using Node npx
npx serve C:\Users\asneh\.gemini\antigravity\scratch\hospital-resource-allocation
# Or using Python (if installed)
cd C:\Users\asneh\.gemini\antigravity\scratch\hospital-resource-allocation
python -m http.server 8080
📁 File Structure
hospital-resource-allocation/
├── index.html        # Semantic HTML5 single-page application shell with all views & modals
├── styles.css        # Hospital design system, responsive grid, status badges, & animations
├── app.js            # StorageManager, GreedyAllocationEngine, SimulationEngine, & UI Controller
└── README.md         # Complete system documentation & demo instructions

Hospital Resource Allocation — Greedy Algorithm Prototype
