/**
 * HOSPITAL RESOURCE ALLOCATION — GREEDY ALGORITHM PROTOTYPE
 * Core Application Engine & Reactive UI Controller
 */

// ==========================================
// 1. DATA MODELS & INITIAL SEED DATA
// ==========================================

const PRIORITY_SCORES = {
  Critical: 4,
  Serious: 3,
  Moderate: 2,
  Normal: 1
};

const INITIAL_PATIENTS = [
  { id: "P001", name: "Rahul Sharma", age: 56, emergencyLevel: "Critical", priorityScore: 4, requiredBedType: "ICU", requiredDoctorSpec: "Cardiologist", requiredEquipment: "Ventilator", arrivalTime: "2026-10-02T08:30", status: "Waiting", reason: "Awaiting automatic allocation run", allocatedResources: null, allocationTimestamp: null, treatedTimestamp: null },
  { id: "P002", name: "Ananya Rao", age: 34, emergencyLevel: "Serious", priorityScore: 3, requiredBedType: "Emergency", requiredDoctorSpec: "General Physician", requiredEquipment: "Monitor", arrivalTime: "2026-10-02T08:35", status: "Waiting", reason: "Awaiting automatic allocation run", allocatedResources: null, allocationTimestamp: null, treatedTimestamp: null },
  { id: "P003", name: "Vikram Kumar", age: 22, emergencyLevel: "Moderate", priorityScore: 2, requiredBedType: "General", requiredDoctorSpec: "General Physician", requiredEquipment: "None", arrivalTime: "2026-10-02T08:40", status: "Waiting", reason: "Awaiting automatic allocation run", allocatedResources: null, allocationTimestamp: null, treatedTimestamp: null },
  { id: "P004", name: "Meena Das", age: 45, emergencyLevel: "Normal", priorityScore: 1, requiredBedType: "General", requiredDoctorSpec: "General Physician", requiredEquipment: "None", arrivalTime: "2026-10-02T08:45", status: "Waiting", reason: "Awaiting automatic allocation run", allocatedResources: null, allocationTimestamp: null, treatedTimestamp: null },
  { id: "P005", name: "Arjun Mehta", age: 62, emergencyLevel: "Critical", priorityScore: 4, requiredBedType: "ICU", requiredDoctorSpec: "Cardiologist", requiredEquipment: "Ventilator", arrivalTime: "2026-10-02T08:48", status: "Waiting", reason: "Awaiting automatic allocation run", allocatedResources: null, allocationTimestamp: null, treatedTimestamp: null },
  { id: "P006", name: "Maya Singh", age: 49, emergencyLevel: "Serious", priorityScore: 3, requiredBedType: "Emergency", requiredDoctorSpec: "Pulmonologist", requiredEquipment: "Oxygen", arrivalTime: "2026-10-02T08:50", status: "Waiting", reason: "Awaiting automatic allocation run", allocatedResources: null, allocationTimestamp: null, treatedTimestamp: null },
  { id: "P007", name: "Rohan Kapoor", age: 28, emergencyLevel: "Moderate", priorityScore: 2, requiredBedType: "General", requiredDoctorSpec: "Orthopedic", requiredEquipment: "None", arrivalTime: "2026-10-02T08:55", status: "Waiting", reason: "Awaiting automatic allocation run", allocatedResources: null, allocationTimestamp: null, treatedTimestamp: null },
  { id: "P008", name: "Isha Nair", age: 31, emergencyLevel: "Normal", priorityScore: 1, requiredBedType: "General", requiredDoctorSpec: "Neurologist", requiredEquipment: "None", arrivalTime: "2026-10-02T09:00", status: "Waiting", reason: "Awaiting automatic allocation run", allocatedResources: null, allocationTimestamp: null, treatedTimestamp: null },
  { id: "P009", name: "Kabir Shah", age: 67, emergencyLevel: "Critical", priorityScore: 4, requiredBedType: "ICU", requiredDoctorSpec: "Pulmonologist", requiredEquipment: "Ventilator", arrivalTime: "2026-10-02T09:05", status: "Waiting", reason: "Awaiting automatic allocation run", allocatedResources: null, allocationTimestamp: null, treatedTimestamp: null },
  { id: "P010", name: "Priya Patel", age: 53, emergencyLevel: "Serious", priorityScore: 3, requiredBedType: "Emergency", requiredDoctorSpec: "Cardiologist", requiredEquipment: "Monitor", arrivalTime: "2026-10-02T09:10", status: "Waiting", reason: "Awaiting automatic allocation run", allocatedResources: null, allocationTimestamp: null, treatedTimestamp: null },
  { id: "P011", name: "Devansh Verma", age: 19, emergencyLevel: "Moderate", priorityScore: 2, requiredBedType: "Emergency", requiredDoctorSpec: "Orthopedic", requiredEquipment: "None", arrivalTime: "2026-10-02T09:12", status: "Waiting", reason: "Awaiting automatic allocation run", allocatedResources: null, allocationTimestamp: null, treatedTimestamp: null },
  { id: "P012", name: "Sneha Kulkarni", age: 41, emergencyLevel: "Normal", priorityScore: 1, requiredBedType: "General", requiredDoctorSpec: "General Physician", requiredEquipment: "None", arrivalTime: "2026-10-02T09:15", status: "Waiting", reason: "Awaiting automatic allocation run", allocatedResources: null, allocationTimestamp: null, treatedTimestamp: null },
  { id: "P013", name: "Suresh Reddy", age: 70, emergencyLevel: "Critical", priorityScore: 4, requiredBedType: "ICU", requiredDoctorSpec: "Cardiologist", requiredEquipment: "Ventilator", arrivalTime: "2026-10-02T09:20", status: "Waiting", reason: "Awaiting automatic allocation run", allocatedResources: null, allocationTimestamp: null, treatedTimestamp: null },
  { id: "P014", name: "Tanvi Joshi", age: 26, emergencyLevel: "Serious", priorityScore: 3, requiredBedType: "Emergency", requiredDoctorSpec: "General Physician", requiredEquipment: "Oxygen", arrivalTime: "2026-10-02T09:22", status: "Waiting", reason: "Awaiting automatic allocation run", allocatedResources: null, allocationTimestamp: null, treatedTimestamp: null },
  { id: "P015", name: "Aditya Bhat", age: 38, emergencyLevel: "Moderate", priorityScore: 2, requiredBedType: "General", requiredDoctorSpec: "General Physician", requiredEquipment: "None", arrivalTime: "2026-10-02T09:25", status: "Waiting", reason: "Awaiting automatic allocation run", allocatedResources: null, allocationTimestamp: null, treatedTimestamp: null },
  { id: "P016", name: "Neha Deshmukh", age: 59, emergencyLevel: "Critical", priorityScore: 4, requiredBedType: "ICU", requiredDoctorSpec: "Neurologist", requiredEquipment: "Monitor", arrivalTime: "2026-10-02T09:30", status: "Waiting", reason: "Awaiting automatic allocation run", allocatedResources: null, allocationTimestamp: null, treatedTimestamp: null },
  { id: "P017", name: "Rajesh Gupta", age: 64, emergencyLevel: "Serious", priorityScore: 3, requiredBedType: "Emergency", requiredDoctorSpec: "Pulmonologist", requiredEquipment: "Ventilator", arrivalTime: "2026-10-02T09:35", status: "Waiting", reason: "Awaiting automatic allocation run", allocatedResources: null, allocationTimestamp: null, treatedTimestamp: null },
  { id: "P018", name: "Sunita Pillai", age: 47, emergencyLevel: "Normal", priorityScore: 1, requiredBedType: "General", requiredDoctorSpec: "General Physician", requiredEquipment: "None", arrivalTime: "2026-10-02T09:40", status: "Waiting", reason: "Awaiting automatic allocation run", allocatedResources: null, allocationTimestamp: null, treatedTimestamp: null },
  { id: "P019", name: "Siddharth Roy", age: 33, emergencyLevel: "Moderate", priorityScore: 2, requiredBedType: "General", requiredDoctorSpec: "Orthopedic", requiredEquipment: "None", arrivalTime: "2026-10-02T09:42", status: "Waiting", reason: "Awaiting automatic allocation run", allocatedResources: null, allocationTimestamp: null, treatedTimestamp: null },
  { id: "P020", name: "Pooja Menon", age: 51, emergencyLevel: "Critical", priorityScore: 4, requiredBedType: "ICU", requiredDoctorSpec: "Cardiologist", requiredEquipment: "Ventilator", arrivalTime: "2026-10-02T09:45", status: "Waiting", reason: "Awaiting automatic allocation run", allocatedResources: null, allocationTimestamp: null, treatedTimestamp: null },
  { id: "P021", name: "Amit Saxena", age: 43, emergencyLevel: "Serious", priorityScore: 3, requiredBedType: "Emergency", requiredDoctorSpec: "General Physician", requiredEquipment: "Monitor", arrivalTime: "2026-10-02T09:50", status: "Waiting", reason: "Awaiting automatic allocation run", allocatedResources: null, allocationTimestamp: null, treatedTimestamp: null },
  { id: "P022", name: "Kavita Shenoy", age: 29, emergencyLevel: "Normal", priorityScore: 1, requiredBedType: "General", requiredDoctorSpec: "General Physician", requiredEquipment: "None", arrivalTime: "2026-10-02T09:55", status: "Waiting", reason: "Awaiting automatic allocation run", allocatedResources: null, allocationTimestamp: null, treatedTimestamp: null },
  { id: "P023", name: "Harish Tiwari", age: 68, emergencyLevel: "Critical", priorityScore: 4, requiredBedType: "ICU", requiredDoctorSpec: "Pulmonologist", requiredEquipment: "Ventilator", arrivalTime: "2026-10-02T10:00", status: "Waiting", reason: "Awaiting automatic allocation run", allocatedResources: null, allocationTimestamp: null, treatedTimestamp: null },
  { id: "P024", name: "Divya Nambiar", age: 37, emergencyLevel: "Serious", priorityScore: 3, requiredBedType: "Emergency", requiredDoctorSpec: "Cardiologist", requiredEquipment: "Oxygen", arrivalTime: "2026-10-02T10:05", status: "Waiting", reason: "Awaiting automatic allocation run", allocatedResources: null, allocationTimestamp: null, treatedTimestamp: null },
  { id: "P025", name: "Manan Singhania", age: 24, emergencyLevel: "Moderate", priorityScore: 2, requiredBedType: "General", requiredDoctorSpec: "Neurologist", requiredEquipment: "None", arrivalTime: "2026-10-02T10:10", status: "Waiting", reason: "Awaiting automatic allocation run", allocatedResources: null, allocationTimestamp: null, treatedTimestamp: null },
  { id: "P026", name: "Ritu Agarwal", age: 55, emergencyLevel: "Normal", priorityScore: 1, requiredBedType: "General", requiredDoctorSpec: "General Physician", requiredEquipment: "None", arrivalTime: "2026-10-02T10:15", status: "Waiting", reason: "Awaiting automatic allocation run", allocatedResources: null, allocationTimestamp: null, treatedTimestamp: null },
  { id: "P027", name: "Deepak Chopra", age: 61, emergencyLevel: "Critical", priorityScore: 4, requiredBedType: "ICU", requiredDoctorSpec: "Cardiologist", requiredEquipment: "Monitor", arrivalTime: "2026-10-02T10:18", status: "Waiting", reason: "Awaiting automatic allocation run", allocatedResources: null, allocationTimestamp: null, treatedTimestamp: null },
  { id: "P028", name: "Shalini Hegde", age: 32, emergencyLevel: "Serious", priorityScore: 3, requiredBedType: "Emergency", requiredDoctorSpec: "General Physician", requiredEquipment: "Oxygen", arrivalTime: "2026-10-02T10:20", status: "Waiting", reason: "Awaiting automatic allocation run", allocatedResources: null, allocationTimestamp: null, treatedTimestamp: null },
  { id: "P029", name: "Alok Pandey", age: 46, emergencyLevel: "Moderate", priorityScore: 2, requiredBedType: "General", requiredDoctorSpec: "Pulmonologist", requiredEquipment: "None", arrivalTime: "2026-10-02T10:25", status: "Waiting", reason: "Awaiting automatic allocation run", allocatedResources: null, allocationTimestamp: null, treatedTimestamp: null },
  { id: "P030", name: "Farhan Merchant", age: 72, emergencyLevel: "Critical", priorityScore: 4, requiredBedType: "ICU", requiredDoctorSpec: "Cardiologist", requiredEquipment: "Ventilator", arrivalTime: "2026-10-02T10:30", status: "Waiting", reason: "Awaiting automatic allocation run", allocatedResources: null, allocationTimestamp: null, treatedTimestamp: null },
  { id: "P031", name: "Geeta Sundaram", age: 58, emergencyLevel: "Serious", priorityScore: 3, requiredBedType: "Emergency", requiredDoctorSpec: "Neurologist", requiredEquipment: "Monitor", arrivalTime: "2026-10-02T10:35", status: "Waiting", reason: "Awaiting automatic allocation run", allocatedResources: null, allocationTimestamp: null, treatedTimestamp: null },
  { id: "P032", name: "Nikhil Varma", age: 25, emergencyLevel: "Normal", priorityScore: 1, requiredBedType: "General", requiredDoctorSpec: "Orthopedic", requiredEquipment: "None", arrivalTime: "2026-10-02T10:40", status: "Waiting", reason: "Awaiting automatic allocation run", allocatedResources: null, allocationTimestamp: null, treatedTimestamp: null },
  { id: "P033", name: "Lavanya Iyer", age: 39, emergencyLevel: "Moderate", priorityScore: 2, requiredBedType: "General", requiredDoctorSpec: "General Physician", requiredEquipment: "None", arrivalTime: "2026-10-02T10:45", status: "Waiting", reason: "Awaiting automatic allocation run", allocatedResources: null, allocationTimestamp: null, treatedTimestamp: null },
  { id: "P034", name: "Chetan Shirodkar", age: 63, emergencyLevel: "Critical", priorityScore: 4, requiredBedType: "ICU", requiredDoctorSpec: "Pulmonologist", requiredEquipment: "Ventilator", arrivalTime: "2026-10-02T10:50", status: "Waiting", reason: "Awaiting automatic allocation run", allocatedResources: null, allocationTimestamp: null, treatedTimestamp: null },
  { id: "P035", name: "Radhika Bose", age: 44, emergencyLevel: "Serious", priorityScore: 3, requiredBedType: "Emergency", requiredDoctorSpec: "Cardiologist", requiredEquipment: "Oxygen", arrivalTime: "2026-10-02T10:55", status: "Waiting", reason: "Awaiting automatic allocation run", allocatedResources: null, allocationTimestamp: null, treatedTimestamp: null }
];

const INITIAL_RESOURCES = {
  beds: [
    { id: "BED-ICU-01", name: "ICU Bed 1", type: "ICU", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "BED-ICU-02", name: "ICU Bed 2", type: "ICU", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "BED-ICU-03", name: "ICU Bed 3", type: "ICU", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "BED-ICU-04", name: "ICU Bed 4", type: "ICU", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "BED-ICU-05", name: "ICU Bed 5", type: "ICU", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "BED-ICU-06", name: "ICU Bed 6", type: "ICU", isAvailable: true, assignedPatientId: null, assignedPatientName: null },

    { id: "BED-EMG-01", name: "Emergency Bay 1", type: "Emergency", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "BED-EMG-02", name: "Emergency Bay 2", type: "Emergency", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "BED-EMG-03", name: "Emergency Bay 3", type: "Emergency", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "BED-EMG-04", name: "Emergency Bay 4", type: "Emergency", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "BED-EMG-05", name: "Emergency Bay 5", type: "Emergency", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "BED-EMG-06", name: "Emergency Bay 6", type: "Emergency", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "BED-EMG-07", name: "Emergency Bay 7", type: "Emergency", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "BED-EMG-08", name: "Emergency Bay 8", type: "Emergency", isAvailable: true, assignedPatientId: null, assignedPatientName: null },

    { id: "BED-GEN-01", name: "General Bed 1", type: "General", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "BED-GEN-02", name: "General Bed 2", type: "General", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "BED-GEN-03", name: "General Bed 3", type: "General", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "BED-GEN-04", name: "General Bed 4", type: "General", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "BED-GEN-05", name: "General Bed 5", type: "General", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "BED-GEN-06", name: "General Bed 6", type: "General", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "BED-GEN-07", name: "General Bed 7", type: "General", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "BED-GEN-08", name: "General Bed 8", type: "General", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "BED-GEN-09", name: "General Bed 9", type: "General", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "BED-GEN-10", name: "General Bed 10", type: "General", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "BED-GEN-11", name: "General Bed 11", type: "General", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "BED-GEN-12", name: "General Bed 12", type: "General", isAvailable: true, assignedPatientId: null, assignedPatientName: null }
  ],
  doctors: [
    { id: "DOC-CARD-01", name: "Dr. Priya Sharma", specialization: "Cardiologist", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "DOC-CARD-02", name: "Dr. Rajeshwar Rao", specialization: "Cardiologist", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "DOC-CARD-03", name: "Dr. Sanjay Malhotra", specialization: "Cardiologist", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "DOC-CARD-04", name: "Dr. Meenakshi Sundaram", specialization: "Cardiologist", isAvailable: true, assignedPatientId: null, assignedPatientName: null },

    { id: "DOC-GEN-01", name: "Dr. Arjun Mehta", specialization: "General Physician", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "DOC-GEN-02", name: "Dr. Neha Gupta", specialization: "General Physician", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "DOC-GEN-03", name: "Dr. Sandeep Patil", specialization: "General Physician", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "DOC-GEN-04", name: "Dr. Archana Nair", specialization: "General Physician", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "DOC-GEN-05", name: "Dr. Vivek Chawla", specialization: "General Physician", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "DOC-GEN-06", name: "Dr. Anupam Ghosh", specialization: "General Physician", isAvailable: true, assignedPatientId: null, assignedPatientName: null },

    { id: "DOC-PULM-01", name: "Dr. Shreya Sen", specialization: "Pulmonologist", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "DOC-PULM-02", name: "Dr. Harish Bhatt", specialization: "Pulmonologist", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "DOC-PULM-03", name: "Dr. Smita Roy", specialization: "Pulmonologist", isAvailable: true, assignedPatientId: null, assignedPatientName: null },

    { id: "DOC-NEUR-01", name: "Dr. Kedar Kulkarni", specialization: "Neurologist", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "DOC-NEUR-02", name: "Dr. Radhika Sen", specialization: "Neurologist", isAvailable: true, assignedPatientId: null, assignedPatientName: null },

    { id: "DOC-ORTH-01", name: "Dr. Vikram Sethi", specialization: "Orthopedic", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "DOC-ORTH-02", name: "Dr. Gaurav Dixit", specialization: "Orthopedic", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "DOC-ORTH-03", name: "Dr. Nidhi Kapoor", specialization: "Orthopedic", isAvailable: true, assignedPatientId: null, assignedPatientName: null }
  ],
  equipment: [
    { id: "EQ-VENT-01", name: "Ventilator 1 (ICU)", type: "Ventilator", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "EQ-VENT-02", name: "Ventilator 2 (ICU)", type: "Ventilator", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "EQ-VENT-03", name: "Ventilator 3 (ICU)", type: "Ventilator", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "EQ-VENT-04", name: "Ventilator 4 (Emergency)", type: "Ventilator", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "EQ-VENT-05", name: "Ventilator 5 (Emergency)", type: "Ventilator", isAvailable: true, assignedPatientId: null, assignedPatientName: null },

    { id: "EQ-MON-01", name: "Multipara Monitor 1", type: "Monitor", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "EQ-MON-02", name: "Multipara Monitor 2", type: "Monitor", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "EQ-MON-03", name: "Multipara Monitor 3", type: "Monitor", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "EQ-MON-04", name: "Multipara Monitor 4", type: "Monitor", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "EQ-MON-05", name: "Multipara Monitor 5", type: "Monitor", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "EQ-MON-06", name: "Multipara Monitor 6", type: "Monitor", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "EQ-MON-07", name: "Multipara Monitor 7", type: "Monitor", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "EQ-MON-08", name: "Multipara Monitor 8", type: "Monitor", isAvailable: true, assignedPatientId: null, assignedPatientName: null },

    { id: "EQ-OXY-01", name: "High-Flow Oxygen 1", type: "Oxygen", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "EQ-OXY-02", name: "High-Flow Oxygen 2", type: "Oxygen", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "EQ-OXY-03", name: "High-Flow Oxygen 3", type: "Oxygen", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "EQ-OXY-04", name: "High-Flow Oxygen 4", type: "Oxygen", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "EQ-OXY-05", name: "High-Flow Oxygen 5", type: "Oxygen", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "EQ-OXY-06", name: "High-Flow Oxygen 6", type: "Oxygen", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "EQ-OXY-07", name: "High-Flow Oxygen 7", type: "Oxygen", isAvailable: true, assignedPatientId: null, assignedPatientName: null },
    { id: "EQ-OXY-08", name: "High-Flow Oxygen 8", type: "Oxygen", isAvailable: true, assignedPatientId: null, assignedPatientName: null }
  ]
};

// ==========================================
// 2. STORAGE MANAGER (LocalStorage Sync)
// ==========================================

class StorageManager {
  static STORAGE_KEY = "hospital_resource_allocation_v2";

  static loadData() {
    try {
      const dataStr = localStorage.getItem(this.STORAGE_KEY);
      if (dataStr) {
        const parsed = JSON.parse(dataStr);
        // Automatically ensure user has at least 30 patients cohort
        if (parsed.patients && Array.isArray(parsed.patients) && parsed.patients.length >= 30 && parsed.resources && parsed.resources.beds && parsed.resources.beds.length >= 15) {
          parsed.patients.forEach(p => {
            p.priorityScore = PRIORITY_SCORES[p.emergencyLevel] || p.priorityScore || 1;
          });
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Error reading from localStorage, initializing fresh data.", e);
    }
    return this.resetData();
  }

  static saveData(data) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to persist data in localStorage", e);
    }
  }

  static resetData() {
    const defaultData = {
      patients: JSON.parse(JSON.stringify(INITIAL_PATIENTS)),
      resources: JSON.parse(JSON.stringify(INITIAL_RESOURCES)),
      lastAllocationTimestamp: null
    };
    this.saveData(defaultData);
    return defaultData;
  }
}

// ==========================================
// 3. GREEDY ALLOCATION ALGORITHM ENGINE
// ==========================================

class GreedyAllocationEngine {
  /**
   * Core Greedy Allocation Algorithm:
   * 1. Extract all un-treated patients.
   * 2. Sort patients by emergency priority score descending (4 = Critical > 3 = Serious > 2 = Moderate > 1 = Normal).
   * 3. Secondary sort: Earliest arrival time first (FIFO within same priority).
   * 4. For each patient in sorted order:
   *    - Check if required bed type is available.
   *    - Check if required doctor specialization is available.
   *    - Check if required equipment (if not 'None') is available.
   *    - If ALL available: Atomically assign them to patient, mark patient "Allocated", generate explanation.
   *    - If ANY missing: Mark patient "Waiting", record specific missing resources in reason.
   */
  static runAllocation(patients, resources) {
    const updatedPatients = JSON.parse(JSON.stringify(patients));
    const updatedResources = JSON.parse(JSON.stringify(resources));

    // Identify patients who are actively undergoing re-allocation (all non-treated patients)
    const reallocatingPatientIds = new Set(
      updatedPatients.filter(p => p.status !== "Treated").map(p => p.id)
    );

    // Reset status for patients being re-evaluated
    updatedPatients.forEach(patient => {
      if (patient.status !== "Treated") {
        patient.status = "Waiting";
        patient.allocatedResources = null;
      }
    });

    // Unassign resources previously held by re-evaluating patients, returning them to available pool
    // BUT preserve resources that the user specifically took offline/maintenance!
    updatedResources.beds.forEach(bed => {
      if (bed.assignedPatientId && reallocatingPatientIds.has(bed.assignedPatientId)) {
        bed.isAvailable = true;
        bed.assignedPatientId = null;
        bed.assignedPatientName = null;
      }
    });
    updatedResources.doctors.forEach(doc => {
      if (doc.assignedPatientId && reallocatingPatientIds.has(doc.assignedPatientId)) {
        doc.isAvailable = true;
        doc.assignedPatientId = null;
        doc.assignedPatientName = null;
      }
    });
    updatedResources.equipment.forEach(eq => {
      if (eq.assignedPatientId && reallocatingPatientIds.has(eq.assignedPatientId)) {
        eq.isAvailable = true;
        eq.assignedPatientId = null;
        eq.assignedPatientName = null;
      }
    });

    // Filter candidate patients for allocation (exclude already treated patients)
    const candidates = updatedPatients.filter(p => p.status !== "Treated");

    // Greedy Sort:
    // Primary key: Priority Score descending (Critical 4 > Serious 3 > Moderate 2 > Normal 1)
    // Secondary key: Arrival time ascending (earlier arrival gets priority)
    candidates.sort((a, b) => {
      const scoreA = Number(a.priorityScore) || PRIORITY_SCORES[a.emergencyLevel] || 1;
      const scoreB = Number(b.priorityScore) || PRIORITY_SCORES[b.emergencyLevel] || 1;
      if (scoreB !== scoreA) {
        return scoreB - scoreA;
      }
      return new Date(a.arrivalTime || 0) - new Date(b.arrivalTime || 0);
    });

    const allocationLog = [];

    // Greedy Step-by-Step Assignment
    candidates.forEach((patient, rank) => {
      const neededBedType = (patient.requiredBedType || "").trim().toLowerCase();
      const neededDoctorSpec = (patient.requiredDoctorSpec || "").trim().toLowerCase();
      const neededEquipment = (patient.requiredEquipment || "").trim();

      // 1. Check matching available bed
      const candidateBed = updatedResources.beds.find(
        b => b.isAvailable && (b.type || "").trim().toLowerCase() === neededBedType
      );

      // 2. Check matching available doctor
      const candidateDoctor = updatedResources.doctors.find(
        d => d.isAvailable && (d.specialization || "").trim().toLowerCase() === neededDoctorSpec
      );

      // 3. Check matching equipment (if not 'None')
      let candidateEquipment = null;
      let equipmentAvailable = true;
      if (neededEquipment && neededEquipment.toLowerCase() !== "none") {
        candidateEquipment = updatedResources.equipment.find(
          e => e.isAvailable && (e.type || "").trim().toLowerCase() === neededEquipment.toLowerCase()
        );
        equipmentAvailable = Boolean(candidateEquipment);
      }

      // Check if ALL resources are satisfied
      const bedAvailable = Boolean(candidateBed);
      const doctorAvailable = Boolean(candidateDoctor);

      if (bedAvailable && doctorAvailable && equipmentAvailable) {
        // ALL AVAILABLE -> ALLOCATE
        candidateBed.isAvailable = false;
        candidateBed.assignedPatientId = patient.id;
        candidateBed.assignedPatientName = patient.name;

        candidateDoctor.isAvailable = false;
        candidateDoctor.assignedPatientId = patient.id;
        candidateDoctor.assignedPatientName = patient.name;

        if (candidateEquipment) {
          candidateEquipment.isAvailable = false;
          candidateEquipment.assignedPatientId = patient.id;
          candidateEquipment.assignedPatientName = patient.name;
        }

        patient.status = "Allocated";
        patient.allocationTimestamp = patient.allocationTimestamp || new Date().toISOString();
        patient.allocatedResources = {
          bedId: candidateBed.id,
          bedName: candidateBed.name,
          bedType: candidateBed.type,
          doctorId: candidateDoctor.id,
          doctorName: candidateDoctor.name,
          doctorSpec: candidateDoctor.specialization,
          equipmentId: candidateEquipment ? candidateEquipment.id : null,
          equipmentName: candidateEquipment ? candidateEquipment.name : "None",
          equipmentType: candidateEquipment ? candidateEquipment.type : "None"
        };

        // Requirement 5 Explainable Allocation Format:
        const equipPhrase = candidateEquipment ? `, and ${candidateEquipment.type.toLowerCase()}` : "";
        patient.reason = `Patient allocated because emergency priority is ${patient.emergencyLevel} and ${candidateBed.type} bed, ${candidateDoctor.specialization}${equipPhrase} are available.`;

        allocationLog.push({
          patientId: patient.id,
          patientName: patient.name,
          rank: rank + 1,
          status: "Allocated",
          reason: patient.reason
        });
      } else {
        // DEFICIT DETECTED -> WAITING
        patient.status = "Waiting";
        patient.allocatedResources = null;

        // Build exact missing bottleneck list
        const missing = [];
        if (!bedAvailable) missing.push(`${patient.requiredBedType} bed`);
        if (!doctorAvailable) missing.push(`${patient.requiredDoctorSpec}`);
        if (!equipmentAvailable) missing.push(`${neededEquipment}`);

        // Requirement 5 Explainable Waiting Format:
        patient.reason = `Patient waiting because no ${missing.join(" or ")} is currently available.`;

        allocationLog.push({
          patientId: patient.id,
          patientName: patient.name,
          rank: rank + 1,
          status: "Waiting",
          reason: patient.reason,
          missingBottlenecks: missing
        });
      }
    });

    return {
      updatedPatients,
      updatedResources,
      allocationLog
    };
  }

  /**
   * Attempt greedy allocation on a single patient without resetting others
   */
  static allocateSinglePatient(patientId, patients, resources) {
    const updatedPatients = JSON.parse(JSON.stringify(patients));
    const updatedResources = JSON.parse(JSON.stringify(resources));

    const patient = updatedPatients.find(p => p.id === patientId);
    if (!patient) return { success: false, message: "Patient not found." };
    if (patient.status === "Treated") return { success: false, message: "Patient has already completed treatment." };
    if (patient.status === "Allocated") return { success: false, message: "Patient is already allocated." };

    const neededBedType = (patient.requiredBedType || "").trim().toLowerCase();
    const neededDoctorSpec = (patient.requiredDoctorSpec || "").trim().toLowerCase();
    const neededEquipment = (patient.requiredEquipment || "").trim();

    const candidateBed = updatedResources.beds.find(
      b => b.isAvailable && (b.type || "").trim().toLowerCase() === neededBedType
    );
    const candidateDoctor = updatedResources.doctors.find(
      d => d.isAvailable && (d.specialization || "").trim().toLowerCase() === neededDoctorSpec
    );

    let candidateEquipment = null;
    let equipmentAvailable = true;
    if (neededEquipment && neededEquipment.toLowerCase() !== "none") {
      candidateEquipment = updatedResources.equipment.find(
        e => e.isAvailable && (e.type || "").trim().toLowerCase() === neededEquipment.toLowerCase()
      );
      equipmentAvailable = Boolean(candidateEquipment);
    }

    const bedAvailable = Boolean(candidateBed);
    const doctorAvailable = Boolean(candidateDoctor);

    if (bedAvailable && doctorAvailable && equipmentAvailable) {
      candidateBed.isAvailable = false;
      candidateBed.assignedPatientId = patient.id;
      candidateBed.assignedPatientName = patient.name;

      candidateDoctor.isAvailable = false;
      candidateDoctor.assignedPatientId = patient.id;
      candidateDoctor.assignedPatientName = patient.name;

      if (candidateEquipment) {
        candidateEquipment.isAvailable = false;
        candidateEquipment.assignedPatientId = patient.id;
        candidateEquipment.assignedPatientName = patient.name;
      }

      patient.status = "Allocated";
      patient.allocationTimestamp = new Date().toISOString();
      patient.allocatedResources = {
        bedId: candidateBed.id,
        bedName: candidateBed.name,
        bedType: candidateBed.type,
        doctorId: candidateDoctor.id,
        doctorName: candidateDoctor.name,
        doctorSpec: candidateDoctor.specialization,
        equipmentId: candidateEquipment ? candidateEquipment.id : null,
        equipmentName: candidateEquipment ? candidateEquipment.name : "None",
        equipmentType: candidateEquipment ? candidateEquipment.type : "None"
      };

      const equipPhrase = candidateEquipment ? `, and ${candidateEquipment.type.toLowerCase()}` : "";
      patient.reason = `Patient allocated because emergency priority is ${patient.emergencyLevel} and ${candidateBed.type} bed, ${candidateDoctor.specialization}${equipPhrase} are available.`;

      return {
        success: true,
        updatedPatients,
        updatedResources,
        patient
      };
    } else {
      const missing = [];
      if (!bedAvailable) missing.push(`${patient.requiredBedType} bed`);
      if (!doctorAvailable) missing.push(`${patient.requiredDoctorSpec}`);
      if (!equipmentAvailable) missing.push(`${neededEquipment}`);
      return {
        success: false,
        message: `Cannot allocate right now: No available ${missing.join(" or ")}.`
      };
    }
  }

  /**
   * Release resources assigned to a patient and return them to Waiting
   */
  static releasePatientResources(patientId, patients, resources) {
    const updatedPatients = JSON.parse(JSON.stringify(patients));
    const updatedResources = JSON.parse(JSON.stringify(resources));

    const patient = updatedPatients.find(p => p.id === patientId);
    if (!patient) return { success: false, message: "Patient not found." };

    if (patient.allocatedResources) {
      const { bedId, doctorId, equipmentId } = patient.allocatedResources;

      const bed = updatedResources.beds.find(b => b.id === bedId || b.assignedPatientId === patientId);
      if (bed) {
        bed.isAvailable = true;
        bed.assignedPatientId = null;
        bed.assignedPatientName = null;
      }

      const doc = updatedResources.doctors.find(d => d.id === doctorId || d.assignedPatientId === patientId);
      if (doc) {
        doc.isAvailable = true;
        doc.assignedPatientId = null;
        doc.assignedPatientName = null;
      }

      if (equipmentId && equipmentId !== "None") {
        const eq = updatedResources.equipment.find(e => e.id === equipmentId || e.assignedPatientId === patientId);
        if (eq) {
          eq.isAvailable = true;
          eq.assignedPatientId = null;
          eq.assignedPatientName = null;
        }
      }
    } else {
      // Fallback clean by patient ID
      updatedResources.beds.forEach(b => {
        if (b.assignedPatientId === patientId) {
          b.isAvailable = true;
          b.assignedPatientId = null;
          b.assignedPatientName = null;
        }
      });
      updatedResources.doctors.forEach(d => {
        if (d.assignedPatientId === patientId) {
          d.isAvailable = true;
          d.assignedPatientId = null;
          d.assignedPatientName = null;
        }
      });
      updatedResources.equipment.forEach(e => {
        if (e.assignedPatientId === patientId) {
          e.isAvailable = true;
          e.assignedPatientId = null;
          e.assignedPatientName = null;
        }
      });
    }

    patient.status = "Waiting";
    patient.allocatedResources = null;
    patient.reason = "Resources were manually released by staff. Pending next allocation run.";

    return {
      success: true,
      updatedPatients,
      updatedResources
    };
  }

  /**
   * Mark patient as treated:
   * 1. Frees assigned bed
   * 2. Frees assigned doctor
   * 3. Frees assigned equipment
   * 4. Updates patient status to 'Treated'
   */
  static markPatientTreated(patientId, patients, resources) {
    const updatedPatients = JSON.parse(JSON.stringify(patients));
    const updatedResources = JSON.parse(JSON.stringify(resources));

    const patient = updatedPatients.find(p => p.id === patientId);
    if (!patient) return { success: false, message: "Patient not found." };

    if (patient.allocatedResources) {
      const { bedId, doctorId, equipmentId } = patient.allocatedResources;

      const bed = updatedResources.beds.find(b => b.id === bedId || b.assignedPatientId === patientId);
      if (bed) {
        bed.isAvailable = true;
        bed.assignedPatientId = null;
        bed.assignedPatientName = null;
      }

      const doc = updatedResources.doctors.find(d => d.id === doctorId || d.assignedPatientId === patientId);
      if (doc) {
        doc.isAvailable = true;
        doc.assignedPatientId = null;
        doc.assignedPatientName = null;
      }

      if (equipmentId && equipmentId !== "None") {
        const eq = updatedResources.equipment.find(e => e.id === equipmentId || e.assignedPatientId === patientId);
        if (eq) {
          eq.isAvailable = true;
          eq.assignedPatientId = null;
          eq.assignedPatientName = null;
        }
      }
    } else {
      // Secondary check by assignedPatientId
      updatedResources.beds.forEach(b => {
        if (b.assignedPatientId === patientId) {
          b.isAvailable = true;
          b.assignedPatientId = null;
          b.assignedPatientName = null;
        }
      });
      updatedResources.doctors.forEach(d => {
        if (d.assignedPatientId === patientId) {
          d.isAvailable = true;
          d.assignedPatientId = null;
          d.assignedPatientName = null;
        }
      });
      updatedResources.equipment.forEach(e => {
        if (e.assignedPatientId === patientId) {
          e.isAvailable = true;
          e.assignedPatientId = null;
          e.assignedPatientName = null;
        }
      });
    }

    patient.status = "Treated";
    patient.allocatedResources = null;
    patient.treatedTimestamp = new Date().toISOString();
    patient.reason = "Treatment completed successfully. All assigned hospital resources have been freed.";

    return {
      success: true,
      updatedPatients,
      updatedResources,
      patient
    };
  }
}

// ==========================================
// 4. WHAT-IF SIMULATION ENGINE
// ==========================================

class SimulationEngine {
  static runSimulation(baselinePatients, baselineResources, { removedBedId, removedDoctorId, removedEquipmentId }) {
    const baselineResult = GreedyAllocationEngine.runAllocation(baselinePatients, baselineResources);
    const simResources = JSON.parse(JSON.stringify(baselineResources));

    let removedResourceNames = [];

    if (removedBedId) {
      const bedIdx = simResources.beds.findIndex(b => b.id === removedBedId);
      if (bedIdx !== -1) {
        removedResourceNames.push(`Bed: ${simResources.beds[bedIdx].name}`);
        simResources.beds.splice(bedIdx, 1);
      }
    }

    if (removedDoctorId) {
      const docIdx = simResources.doctors.findIndex(d => d.id === removedDoctorId);
      if (docIdx !== -1) {
        removedResourceNames.push(`Doctor: ${simResources.doctors[docIdx].name}`);
        simResources.doctors.splice(docIdx, 1);
      }
    }

    if (removedEquipmentId) {
      const eqIdx = simResources.equipment.findIndex(e => e.id === removedEquipmentId);
      if (eqIdx !== -1) {
        removedResourceNames.push(`Equipment: ${simResources.equipment[eqIdx].name}`);
        simResources.equipment.splice(eqIdx, 1);
      }
    }

    const simResult = GreedyAllocationEngine.runAllocation(baselinePatients, simResources);

    const baselineAllocated = baselineResult.updatedPatients.filter(p => p.status === "Allocated").length;
    const baselineWaiting = baselineResult.updatedPatients.filter(p => p.status === "Waiting").length;

    const simAllocated = simResult.updatedPatients.filter(p => p.status === "Allocated").length;
    const simWaiting = simResult.updatedPatients.filter(p => p.status === "Waiting").length;

    const criticalTotal = baselinePatients.filter(p => p.emergencyLevel === "Critical").length;
    const baselineCriticalAllocated = baselineResult.updatedPatients.filter(
      p => p.emergencyLevel === "Critical" && p.status === "Allocated"
    ).length;
    const simCriticalAllocated = simResult.updatedPatients.filter(
      p => p.emergencyLevel === "Critical" && p.status === "Allocated"
    ).length;

    const baselineCoverage = criticalTotal > 0 ? Math.round((baselineCriticalAllocated / criticalTotal) * 100) : 100;
    const simCoverage = criticalTotal > 0 ? Math.round((simCriticalAllocated / criticalTotal) * 100) : 100;

    const patientComparison = baselinePatients.map(p => {
      const beforeState = baselineResult.updatedPatients.find(bp => bp.id === p.id);
      const afterState = simResult.updatedPatients.find(sp => sp.id === p.id);

      let impact = "No Change";
      if (beforeState && afterState) {
        if (beforeState.status === "Allocated" && afterState.status === "Waiting") {
          impact = "Demoted to Waiting (Shortage)";
        } else if (beforeState.status === "Waiting" && afterState.status === "Allocated") {
          impact = "Gained Allocation";
        }
      }

      return {
        id: p.id,
        name: p.name,
        emergencyLevel: p.emergencyLevel,
        requiredResources: `${p.requiredBedType} Bed, ${p.requiredDoctorSpec}, ${p.requiredEquipment}`,
        beforeStatus: beforeState ? beforeState.status : "Waiting",
        beforeReason: beforeState ? beforeState.reason : "",
        afterStatus: afterState ? afterState.status : "Waiting",
        afterReason: afterState ? afterState.reason : "",
        impact
      };
    });

    let bottleneckSummary = "";
    if (removedResourceNames.length === 0) {
      bottleneckSummary = "No disruptions applied. Simulation matches current capacity.";
    } else {
      const impactedCount = patientComparison.filter(p => p.impact.includes("Demoted")).length;
      if (impactedCount > 0) {
        bottleneckSummary = `Disruption of [${removedResourceNames.join(", ")}] caused ${impactedCount} patient(s) to lose allocation and enter the waiting queue.`;
      } else {
        bottleneckSummary = `Disruption of [${removedResourceNames.join(", ")}] absorbed by existing hospital capacity; no additional patients were demoted.`;
      }
    }

    return {
      before: {
        allocated: baselineAllocated,
        waiting: baselineWaiting,
        criticalCoverage: baselineCoverage
      },
      after: {
        allocated: simAllocated,
        waiting: simWaiting,
        criticalCoverage: simCoverage
      },
      delta: {
        allocated: simAllocated - baselineAllocated,
        waiting: simWaiting - baselineWaiting,
        coverage: simCoverage - baselineCoverage
      },
      removedResources: removedResourceNames,
      bottleneckSummary,
      patientComparison
    };
  }
}

// ==========================================
// 5. CHART MANAGER (Chart.js + Canvas Fallback)
// ==========================================

class ChartManager {
  static priorityChartInstance = null;
  static resourceChartInstance = null;

  static renderCharts(patients, resources) {
    this.renderPriorityChart(patients);
    this.renderResourceChart(resources);
  }

  static renderPriorityChart(patients) {
    const canvas = document.getElementById("chartPatientPriority");
    if (!canvas) return;

    const counts = { Critical: 0, Serious: 0, Moderate: 0, Normal: 0 };
    patients.forEach(p => {
      if (counts[p.emergencyLevel] !== undefined) {
        counts[p.emergencyLevel]++;
      }
    });

    const labels = ["Critical (Score 4)", "Serious (Score 3)", "Moderate (Score 2)", "Normal (Score 1)"];
    const data = [counts.Critical, counts.Serious, counts.Moderate, counts.Normal];
    const bgColors = ["#dc2626", "#ea580c", "#d97706", "#16a34a"];

    if (window.Chart) {
      if (this.priorityChartInstance) {
        this.priorityChartInstance.destroy();
      }

      const ctx = canvas.getContext("2d");
      this.priorityChartInstance = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: bgColors,
            borderColor: "#ffffff",
            borderWidth: 2,
            hoverOffset: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                boxWidth: 12,
                padding: 12,
                font: { size: 11, family: "Inter, sans-serif" }
              }
            }
          },
          cutout: "60%"
        }
      });
    } else {
      this.renderFallbackBar(canvas, labels, data, bgColors);
    }
  }

  static renderResourceChart(resources) {
    const canvas = document.getElementById("chartResourceUsage");
    if (!canvas) return;

    const totalBeds = resources.beds.length;
    const availBeds = resources.beds.filter(b => b.isAvailable).length;
    const inUseBeds = totalBeds - availBeds;

    const totalDocs = resources.doctors.length;
    const availDocs = resources.doctors.filter(d => d.isAvailable).length;
    const inUseDocs = totalDocs - availDocs;

    const totalEq = resources.equipment.length;
    const availEq = resources.equipment.filter(e => e.isAvailable).length;
    const inUseEq = totalEq - availEq;

    const labels = ["Beds", "Doctors", "Equipment"];
    const allocatedData = [inUseBeds, inUseDocs, inUseEq];
    const availableData = [availBeds, availDocs, availEq];

    if (window.Chart) {
      if (this.resourceChartInstance) {
        this.resourceChartInstance.destroy();
      }

      const ctx = canvas.getContext("2d");
      this.resourceChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "In Use (Allocated)",
              data: allocatedData,
              backgroundColor: "#2563eb",
              borderRadius: 6
            },
            {
              label: "Available",
              data: availableData,
              backgroundColor: "#10b981",
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              stacked: true,
              grid: { display: false }
            },
            y: {
              stacked: true,
              beginAtZero: true,
              ticks: { stepSize: 1, precision: 0 },
              grid: { color: "#f1f5f9" }
            }
          },
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                boxWidth: 12,
                padding: 12,
                font: { size: 11, family: "Inter, sans-serif" }
              }
            }
          }
        }
      });
    } else {
      this.renderFallbackBar(canvas, labels, allocatedData, ["#2563eb", "#2563eb", "#2563eb"]);
    }
  }

  static renderFallbackBar(canvas, labels, data, colors) {
    const ctx = canvas.getContext("2d");
    const width = canvas.width = canvas.parentElement?.clientWidth || 320;
    const height = canvas.height = 220;
    ctx.clearRect(0, 0, width, height);

    const maxVal = Math.max(...data, 1);
    const barWidth = Math.min(42, (width / data.length) - 20);

    data.forEach((val, i) => {
      const barHeight = (val / maxVal) * (height - 60);
      const x = 30 + i * ((width - 60) / data.length);
      const y = height - 40 - barHeight;

      ctx.fillStyle = colors[i % colors.length];
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
        ctx.fill();
      } else {
        ctx.fillRect(x, y, barWidth, barHeight);
      }

      ctx.fillStyle = "#1e293b";
      ctx.font = "11px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(labels[i].slice(0, 10), x + barWidth / 2, height - 15);
      ctx.fillText(val.toString(), x + barWidth / 2, y - 6);
    });
  }
}

// ==========================================
// 6. MAIN APPLICATION CONTROLLER
// ==========================================

class App {
  constructor() {
    window.app = this; // Guarantee immediate global availability
    this.data = StorageManager.loadData();
    this.currentView = "dashboard";
    this.currentResourceTab = "beds";

    this.initElements();
    this.bindEvents();
    this.initFormDefaults();
    this.populateSimulationDropdowns();
    this.refreshUI();
  }

  initElements() {
    this.navLinks = document.querySelectorAll(".nav-link");
    this.pageViews = document.querySelectorAll(".page-view");
    this.sidebar = document.getElementById("sidebar");
    this.sidebarBackdrop = document.getElementById("sidebarBackdrop");
    this.btnMenuToggle = document.getElementById("btnMenuToggle");
    this.headerPageTitle = document.getElementById("headerPageTitle");

    // Action buttons
    this.btnResetData = document.getElementById("btnResetData");
    this.btnSidebarAllocate = document.getElementById("btnSidebarAllocate");
    this.btnDashboardAllocate = document.getElementById("btnDashboardAllocate");
    this.btnDashboardQueueAllocate = document.getElementById("btnDashboardQueueAllocate");
    this.btnRunGreedyAllocation = document.getElementById("btnRunGreedyAllocation");
    this.btnWaitingAllocate = document.getElementById("btnWaitingAllocate");

    // Modal triggers
    this.btnHeaderAddPatient = document.getElementById("btnHeaderAddPatient");
    this.btnDashboardAddPatient = document.getElementById("btnDashboardAddPatient");
    this.btnOpenAddPatientModal = document.getElementById("btnOpenAddPatientModal");
    this.btnOpenAddResourceModal = document.getElementById("btnOpenAddResourceModal");

    // Modals
    this.modalAddPatient = document.getElementById("modalAddPatient");
    this.modalAddResource = document.getElementById("modalAddResource");
    this.formAddPatient = document.getElementById("formAddPatient");
    this.formAddResource = document.getElementById("formAddResource");

    // Patient Form Fields
    this.inputPatientName = document.getElementById("inputPatientName");
    this.inputPatientId = document.getElementById("inputPatientId");
    this.inputPatientAge = document.getElementById("inputPatientAge");
    this.selectEmergencyLevel = document.getElementById("selectEmergencyLevel");
    this.hintEmergencyScore = document.getElementById("hintEmergencyScore");
    this.selectBedType = document.getElementById("selectBedType");
    this.selectDoctorSpec = document.getElementById("selectDoctorSpec");
    this.selectEquipment = document.getElementById("selectEquipment");
    this.inputArrivalTime = document.getElementById("inputArrivalTime");

    // Resource Form Fields
    this.selectResourceCategory = document.getElementById("selectResourceCategory");
    this.selectResourceSubtype = document.getElementById("selectResourceSubtype");
    this.labelResourceSubtype = document.getElementById("labelResourceSubtype");
    this.inputResourceName = document.getElementById("inputResourceName");

    // Simulation elements
    this.simSelectBed = document.getElementById("simSelectBed");
    this.simSelectDoctor = document.getElementById("simSelectDoctor");
    this.simSelectEquipment = document.getElementById("simSelectEquipment");
    this.btnRunSimulation = document.getElementById("btnRunSimulation");
    this.btnResetSimulation = document.getElementById("btnResetSimulation");
    this.btnPresetVentilatorShortage = document.getElementById("btnPresetVentilatorShortage");
    this.btnPresetICUBedShortage = document.getElementById("btnPresetICUBedShortage");

    // Filter elements
    this.patientFilterLevel = document.getElementById("patientFilterLevel");
    this.patientFilterStatus = document.getElementById("patientFilterStatus");

    // Toast Container
    this.toastContainer = document.getElementById("toastContainer");

    // v0 UI Elements
    this.darkModeToggle = document.getElementById("darkModeToggle");
    this.themeIconMoon = document.getElementById("themeIconMoon");
    this.themeIconSun = document.getElementById("themeIconSun");
    this.btnSidebarClose = document.getElementById("btnSidebarClose");
    this.btnToggleAllActivity = document.getElementById("btnToggleAllActivity");
    this.toggleActivityText = document.getElementById("toggleActivityText");
    this.toggleActivityChevron = document.getElementById("toggleActivityChevron");
    this.showAllActivity = false;
    this.btnManageResourcesQuick = document.getElementById("btnManageResourcesQuick");
    this.cardDashedReview = document.getElementById("cardDashedReview");
    this.btnQuickRunSim = document.getElementById("btnQuickRunSim");

    // Search & Cohort Loader Elements
    this.globalSearchInput = document.getElementById("globalSearchInput");
    this.patientSearchInput = document.getElementById("patientSearchInput");
    this.btnLoad8Patients = document.getElementById("btnLoad8Patients");
    this.searchQuery = "";
  }

  bindEvents() {
    // Mobile navigation toggle
    this.btnMenuToggle?.addEventListener("click", () => this.toggleMobileSidebar());
    this.sidebarBackdrop?.addEventListener("click", () => this.closeMobileSidebar());
    this.btnSidebarClose?.addEventListener("click", () => this.closeMobileSidebar());

    // Live real-time Search Filtering (Header & Patient Page)
    const handleSearch = (e) => {
      const val = e.target.value;
      this.searchQuery = val.toLowerCase().trim();
      if (this.globalSearchInput && this.globalSearchInput.value !== val) {
        this.globalSearchInput.value = val;
      }
      if (this.patientSearchInput && this.patientSearchInput.value !== val) {
        this.patientSearchInput.value = val;
      }
      this.renderPatientsTable();
      this.renderDashboardTable();
      this.renderWaitingListTable();
      if (this.renderResultsAllocatedTable) {
        this.renderResultsAllocatedTable();
      }
    };
    this.globalSearchInput?.addEventListener("input", handleSearch);
    this.patientSearchInput?.addEventListener("input", handleSearch);

    // v0 Dark mode toggle
    const savedTheme = localStorage.getItem("medialloc_theme") || "light";
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      if (this.themeIconMoon) this.themeIconMoon.style.display = "none";
      if (this.themeIconSun) this.themeIconSun.style.display = "block";
    }

    this.darkModeToggle?.addEventListener("click", () => {
      const isDark = document.documentElement.classList.toggle("dark");
      localStorage.setItem("medialloc_theme", isDark ? "dark" : "light");
      if (this.themeIconMoon) this.themeIconMoon.style.display = isDark ? "none" : "block";
      if (this.themeIconSun) this.themeIconSun.style.display = isDark ? "block" : "none";
      if (window.lucide) window.lucide.createIcons();
    });

    // v0 Recent Activity toggle (View all / Show less)
    this.btnToggleAllActivity?.addEventListener("click", () => {
      this.showAllActivity = !this.showAllActivity;
      if (this.toggleActivityText) {
        this.toggleActivityText.textContent = this.showAllActivity ? "Show less" : "View all";
      }
      if (this.toggleActivityChevron) {
        this.toggleActivityChevron.style.transform = this.showAllActivity ? "rotate(180deg)" : "rotate(0deg)";
      }
      this.renderDashboardTable();
    });

    // Quick navigation from dashboard
    this.btnManageResourcesQuick?.addEventListener("click", () => this.switchView("resources"));
    this.cardDashedReview?.addEventListener("click", () => this.switchView("simulation"));
    this.btnQuickRunSim?.addEventListener("click", () => {
      this.handleRunAllocation();
      this.showToast("Quick simulation executed on current patient priorities.", "info");
    });

    // Donut chart interactive legend filter
    document.querySelectorAll(".donut-legend-item").forEach(item => {
      item.addEventListener("click", (e) => {
        document.querySelectorAll(".donut-legend-item").forEach(i => i.classList.remove("active"));
        e.currentTarget.classList.add("active");
        const level = e.currentTarget.getAttribute("data-donut-level");
        if (this.patientFilterLevel) {
          this.patientFilterLevel.value = level || "ALL";
          this.renderPatientsTable();
        }
      });
    });

    // Header live clock & sync
    const updateHeaderClock = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const dateStr = now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric", year: "numeric" });
      const elDate = document.getElementById("headerLiveDate");
      const elTime = document.getElementById("headerLiveTime");
      const elSync = document.getElementById("footerSyncTime");
      if (elDate) elDate.textContent = dateStr;
      if (elTime) elTime.textContent = timeStr;
      if (elSync) elSync.textContent = `Last system sync: ${timeStr}`;
    };
    updateHeaderClock();
    setInterval(updateHeaderClock, 30000);

    // Navigation view switching
    this.navLinks.forEach(link => {
      link.addEventListener("click", e => {
        const view = e.currentTarget.getAttribute("data-view");
        this.switchView(view);
        this.closeMobileSidebar();
      });
    });

    // Reset Data action (Restores full 35-patient cohort)
    this.btnResetData?.addEventListener("click", () => {
      if (confirm("Reset hospital database to 35-patient clinical cohort scenario? This will restore all 35 patients and initial available resources.")) {
        this.data = StorageManager.resetData();
        this.populateSimulationDropdowns();
        this.refreshUI();
        this.showToast("Hospital database restored with 35 clinical patients & resources.", "success");
      }
    });

    // Load 35 Clinical Patients Cohort Button
    this.btnLoad8Patients?.addEventListener("click", () => {
      this.data = StorageManager.resetData();
      this.populateSimulationDropdowns();
      this.refreshUI();
      this.showToast("Loaded full 35-patient clinical cohort with verified triage priorities!", "success");
    });

    // Global Greedy Allocation triggers
    const triggerAllocation = () => this.handleRunAllocation();
    this.btnSidebarAllocate?.addEventListener("click", triggerAllocation);
    this.btnDashboardAllocate?.addEventListener("click", triggerAllocation);
    this.btnDashboardQueueAllocate?.addEventListener("click", triggerAllocation);
    this.btnRunGreedyAllocation?.addEventListener("click", triggerAllocation);
    this.btnWaitingAllocate?.addEventListener("click", triggerAllocation);

    // Modal openers
    const openPatientModal = () => this.openPatientModal();
    this.btnHeaderAddPatient?.addEventListener("click", openPatientModal);
    this.btnDashboardAddPatient?.addEventListener("click", openPatientModal);
    this.btnOpenAddPatientModal?.addEventListener("click", openPatientModal);
    this.btnOpenAddResourceModal?.addEventListener("click", () => this.openResourceModal());

    // Modal close buttons
    document.querySelectorAll("[data-close-modal]").forEach(btn => {
      btn.addEventListener("click", e => {
        const modalId = e.currentTarget.getAttribute("data-close-modal");
        this.closeModal(modalId);
      });
    });

    // Modal overlay click outside to close
    [this.modalAddPatient, this.modalAddResource].forEach(modal => {
      modal?.addEventListener("click", e => {
        if (e.target === modal) {
          this.closeModal(modal.id);
        }
      });
    });

    // Form Submissions
    this.formAddPatient?.addEventListener("submit", e => this.handleAddPatientSubmit(e));
    this.formAddResource?.addEventListener("submit", e => this.handleAddResourceSubmit(e));

    // Dynamic emergency level score hint
    this.selectEmergencyLevel?.addEventListener("change", e => {
      const level = e.target.value;
      const scores = {
        Critical: "Critical: Immediate life-saving intervention (Priority Score = 4)",
        Serious: "Serious: Acute clinical instability (Priority Score = 3)",
        Moderate: "Moderate: Urgent attention needed (Priority Score = 2)",
        Normal: "Normal: Standard non-critical care (Priority Score = 1)"
      };
      if (this.hintEmergencyScore) {
        this.hintEmergencyScore.textContent = scores[level] || "";
      }
    });

    // Dynamic Resource Subtype population
    this.selectResourceCategory?.addEventListener("change", e => {
      this.updateResourceSubtypeOptions(e.target.value);
    });

    // Resource Management Tabs
    document.querySelectorAll(".tab-btn").forEach(tab => {
      tab.addEventListener("click", e => {
        const targetTab = e.currentTarget.getAttribute("data-resource-tab");
        this.switchResourceTab(targetTab);
      });
    });

    // Patient Filters
    this.patientFilterLevel?.addEventListener("change", () => this.renderPatientsTable());
    this.patientFilterStatus?.addEventListener("change", () => this.renderPatientsTable());

    // What-If Simulation Controls
    this.btnRunSimulation?.addEventListener("click", () => this.handleRunSimulation());
    this.simSelectBed?.addEventListener("change", () => this.handleRunSimulation());
    this.simSelectDoctor?.addEventListener("change", () => this.handleRunSimulation());
    this.simSelectEquipment?.addEventListener("change", () => this.handleRunSimulation());
    this.btnResetSimulation?.addEventListener("click", () => {
      if (this.simSelectBed) this.simSelectBed.value = "";
      if (this.simSelectDoctor) this.simSelectDoctor.value = "";
      if (this.simSelectEquipment) this.simSelectEquipment.value = "";
      this.handleRunSimulation();
      this.showToast("Simulation disruptions cleared.", "info");
    });

    // What-If Presets
    this.btnPresetVentilatorShortage?.addEventListener("click", () => {
      const vent = this.data.resources.equipment.find(e => e.type === "Ventilator");
      if (vent && this.simSelectEquipment) {
        this.simSelectEquipment.value = vent.id;
        this.handleRunSimulation();
        this.showToast("Simulating scenario: Critical Ventilator unavailable.", "warning");
      }
    });

    this.btnPresetICUBedShortage?.addEventListener("click", () => {
      const icu = this.data.resources.beds.find(b => b.type === "ICU");
      if (icu && this.simSelectBed) {
        this.simSelectBed.value = icu.id;
        this.handleRunSimulation();
        this.showToast("Simulating scenario: Zero ICU Beds available.", "warning");
      }
    });

    // Global Click Delegation for Dynamic Table Buttons
    document.addEventListener("click", (e) => {
      const target = e.target.closest("[data-action]");
      if (!target) return;
      const action = target.getAttribute("data-action");
      const id = target.getAttribute("data-id");
      const cat = target.getAttribute("data-cat");

      if (action === "allocate-single") {
        this.handleAllocateSingle(id);
      } else if (action === "mark-treated") {
        this.handleMarkTreated(id);
      } else if (action === "release-resources") {
        this.handleReleaseResources(id);
      } else if (action === "delete-patient") {
        this.handleDeletePatient(id);
      } else if (action === "toggle-resource") {
        this.handleToggleResourceStatus(cat, id);
      } else if (action === "delete-resource") {
        this.handleDeleteResource(cat, id);
      }
    });
  }

  // ==========================================
  // NAVIGATION & VIEW CONTROLS
  // ==========================================

  switchView(viewName) {
    this.currentView = viewName;

    this.navLinks.forEach(link => {
      if (link.getAttribute("data-view") === viewName) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    this.pageViews.forEach(page => {
      if (page.id === `view-${viewName}`) {
        page.classList.add("active");
      } else {
        page.classList.remove("active");
      }
    });

    const titles = {
      dashboard: "Hospital Dashboard",
      patients: "Patient Intake & Records",
      resources: "Hospital Resources",
      allocation: "Greedy Allocation Engine",
      "waiting-list": "Waiting Patients Queue",
      simulation: "What-If Simulation Sandbox",
      reports: "Hospital Operations Report"
    };
    if (this.headerPageTitle) {
      this.headerPageTitle.textContent = titles[viewName] || "Hospital Management";
    }

    if (viewName === "dashboard") {
      ChartManager.renderCharts(this.data.patients, this.data.resources);
    } else if (viewName === "simulation") {
      this.populateSimulationDropdowns();
      this.handleRunSimulation();
    } else if (viewName === "reports") {
      this.renderReportsView();
    }
  }

  switchResourceTab(tabName) {
    this.currentResourceTab = tabName;
    document.querySelectorAll(".tab-btn").forEach(tab => {
      if (tab.getAttribute("data-resource-tab") === tabName) {
        tab.classList.add("active");
      } else {
        tab.classList.remove("active");
      }
    });

    document.querySelectorAll(".resource-tab-content").forEach(content => {
      content.style.display = "none";
    });

    const activeContent = document.getElementById(`tabContent${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`);
    if (activeContent) {
      activeContent.style.display = "block";
    }
  }

  toggleMobileSidebar() {
    this.sidebar?.classList.toggle("open");
    this.sidebarBackdrop?.classList.toggle("open");
  }

  closeMobileSidebar() {
    this.sidebar?.classList.remove("open");
    this.sidebarBackdrop?.classList.remove("open");
  }

  // ==========================================
  // MODALS & FORM HANDLING
  // ==========================================

  initFormDefaults() {
    if (this.inputArrivalTime) {
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      this.inputArrivalTime.value = now.toISOString().slice(0, 16);
    }
  }

  openPatientModal() {
    const nextNum = String(this.data.patients.length + 1).padStart(3, "0");
    if (this.inputPatientId) this.inputPatientId.value = `P${nextNum}`;
    if (this.inputPatientName) this.inputPatientName.value = "";
    if (this.inputPatientAge) this.inputPatientAge.value = "";
    if (this.selectEmergencyLevel) this.selectEmergencyLevel.value = "Critical";
    if (this.selectBedType) this.selectBedType.value = "ICU";
    if (this.selectDoctorSpec) this.selectDoctorSpec.value = "Cardiologist";
    if (this.selectEquipment) this.selectEquipment.value = "Ventilator";
    this.initFormDefaults();

    const modal = document.getElementById("modalAddPatient") || this.modalAddPatient;
    if (modal) {
      modal.classList.add("open");
      modal.classList.add("active");
      modal.style.display = "flex";
    }
    setTimeout(() => this.inputPatientName?.focus(), 50);
  }

  openResourceModal() {
    if (this.selectResourceCategory) this.selectResourceCategory.value = "bed";
    this.updateResourceSubtypeOptions("bed");
    if (this.inputResourceName) this.inputResourceName.value = "";
    const modal = document.getElementById("modalAddResource") || this.modalAddResource;
    if (modal) {
      modal.classList.add("open");
      modal.classList.add("active");
      modal.style.display = "flex";
    }
    setTimeout(() => this.inputResourceName?.focus(), 50);
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove("open");
      modal.classList.remove("active");
      modal.style.display = "none";
    }
  }

  updateResourceSubtypeOptions(category) {
    this.selectResourceSubtype.innerHTML = "";
    if (category === "bed") {
      this.labelResourceSubtype.innerHTML = `Bed Type <span class="required-star">*</span>`;
      const options = ["ICU", "Emergency", "General"];
      options.forEach(opt => {
        const el = document.createElement("option");
        el.value = opt;
        el.textContent = `${opt} Bed`;
        this.selectResourceSubtype.appendChild(el);
      });
      this.inputResourceName.placeholder = "e.g. ICU Bed 2";
    } else if (category === "doctor") {
      this.labelResourceSubtype.innerHTML = `Specialization <span class="required-star">*</span>`;
      const options = ["Cardiologist", "General Physician", "Pulmonologist", "Neurologist", "Orthopedic"];
      options.forEach(opt => {
        const el = document.createElement("option");
        el.value = opt;
        el.textContent = opt;
        this.selectResourceSubtype.appendChild(el);
      });
      this.inputResourceName.placeholder = "e.g. Dr. Ananya Sharma (Cardiologist)";
    } else if (category === "equipment") {
      this.labelResourceSubtype.innerHTML = `Equipment Type <span class="required-star">*</span>`;
      const options = ["Ventilator", "Monitor", "Oxygen"];
      options.forEach(opt => {
        const el = document.createElement("option");
        el.value = opt;
        el.textContent = opt;
        this.selectResourceSubtype.appendChild(el);
      });
      this.inputResourceName.placeholder = "e.g. Ventilator 2";
    }
  }

  handleAddPatientSubmit(e) {
    e.preventDefault();

    const name = this.inputPatientName.value.trim();
    const id = this.inputPatientId.value.trim();
    const age = parseInt(this.inputPatientAge.value, 10);
    const emergencyLevel = this.selectEmergencyLevel.value;
    const requiredBedType = this.selectBedType.value;
    const requiredDoctorSpec = this.selectDoctorSpec.value;
    const requiredEquipment = this.selectEquipment.value;
    const arrivalTime = this.inputArrivalTime.value || new Date().toISOString();

    if (!name) {
      this.showToast("Please enter patient name", "error");
      return;
    }
    if (!id) {
      this.showToast("Please enter patient ID", "error");
      return;
    }
    if (this.data.patients.some(p => p.id.toLowerCase() === id.toLowerCase())) {
      this.showToast(`Patient ID "${id}" already exists. Please use a unique ID.`, "error");
      return;
    }
    if (isNaN(age) || age < 1 || age > 120) {
      this.showToast("Please enter a valid age between 1 and 120", "error");
      return;
    }

    const priorityScore = PRIORITY_SCORES[emergencyLevel] || 1;

    const newPatient = {
      id,
      name,
      age,
      emergencyLevel,
      priorityScore,
      requiredBedType,
      requiredDoctorSpec,
      requiredEquipment,
      arrivalTime,
      status: "Waiting",
      reason: "Newly registered. Awaiting resource allocation run.",
      allocatedResources: null,
      allocationTimestamp: null,
      treatedTimestamp: null
    };

    this.data.patients.push(newPatient);
    StorageManager.saveData(this.data);

    this.closeModal("modalAddPatient");
    this.populateSimulationDropdowns();
    this.refreshUI();
    this.showToast(`Patient ${name} (${id}) added successfully. Priority Score: ${priorityScore}`, "success");
  }

  handleAddResourceSubmit(e) {
    e.preventDefault();

    const category = this.selectResourceCategory.value;
    const subtype = this.selectResourceSubtype.value;
    const name = this.inputResourceName.value.trim();

    if (!name) {
      this.showToast("Please provide a resource identifier/name", "error");
      return;
    }

    const randomSuffix = Math.floor(100 + Math.random() * 900);

    if (category === "bed") {
      const newBed = {
        id: `BED-${randomSuffix}`,
        name: name,
        type: subtype,
        isAvailable: true,
        assignedPatientId: null,
        assignedPatientName: null
      };
      this.data.resources.beds.push(newBed);
    } else if (category === "doctor") {
      const newDoc = {
        id: `DOC-${randomSuffix}`,
        name: name,
        specialization: subtype,
        isAvailable: true,
        assignedPatientId: null,
        assignedPatientName: null
      };
      this.data.resources.doctors.push(newDoc);
    } else if (category === "equipment") {
      const newEq = {
        id: `EQ-${randomSuffix}`,
        name: name,
        type: subtype,
        isAvailable: true,
        assignedPatientId: null,
        assignedPatientName: null
      };
      this.data.resources.equipment.push(newEq);
    }

    StorageManager.saveData(this.data);
    this.closeModal("modalAddResource");
    this.populateSimulationDropdowns();
    this.refreshUI();
    this.showToast(`Resource "${name}" added to hospital inventory.`, "success");
  }

  // ==========================================
  // ALLOCATION ACTIONS
  // ==========================================

  handleRunAllocation() {
    const topBtn = document.getElementById("topBtnAllocateText");
    if (topBtn) {
      topBtn.textContent = "Allocation complete";
      setTimeout(() => {
        topBtn.textContent = "Run Greedy Allocation";
      }, 2200);
    }

    const result = GreedyAllocationEngine.runAllocation(this.data.patients, this.data.resources);
    this.data.patients = result.updatedPatients;
    this.data.resources = result.updatedResources;
    this.data.lastAllocationTimestamp = new Date().toISOString();

    StorageManager.saveData(this.data);
    this.refreshUI();

    const allocatedCount = this.data.patients.filter(p => p.status === "Allocated").length;
    const waitingCount = this.data.patients.filter(p => p.status === "Waiting").length;

    this.showToast(
      `Greedy Allocation complete: ${allocatedCount} patient(s) allocated, ${waitingCount} waiting.`,
      waitingCount > 0 ? "warning" : "success"
    );

    const tsBadge = document.getElementById("badgeAllocationTimestamp");
    if (tsBadge) {
      const timeStr = new Date().toLocaleTimeString();
      tsBadge.textContent = `Last evaluated at ${timeStr}`;
    }
  }

  handleAllocateSingle(patientId) {
    const result = GreedyAllocationEngine.allocateSinglePatient(
      patientId,
      this.data.patients,
      this.data.resources
    );

    if (result.success) {
      this.data.patients = result.updatedPatients;
      this.data.resources = result.updatedResources;
      StorageManager.saveData(this.data);
      this.refreshUI();
      this.showToast(`Patient ${result.patient.name} allocated successfully.`, "success");
    } else {
      this.showToast(result.message, "error");
    }
  }

  handleReleaseResources(patientId) {
    const result = GreedyAllocationEngine.releasePatientResources(
      patientId,
      this.data.patients,
      this.data.resources
    );

    if (result.success) {
      this.data.patients = result.updatedPatients;
      this.data.resources = result.updatedResources;
      StorageManager.saveData(this.data);
      this.refreshUI();
      this.showToast(`Resources released for patient. Returned to waiting queue.`, "info");
    } else {
      this.showToast(result.message, "error");
    }
  }

  handleMarkTreated(patientId) {
    const result = GreedyAllocationEngine.markPatientTreated(
      patientId,
      this.data.patients,
      this.data.resources
    );

    if (result.success) {
      this.data.patients = result.updatedPatients;
      this.data.resources = result.updatedResources;
      StorageManager.saveData(this.data);
      this.refreshUI();
      this.showToast(
        `Patient ${result.patient.name} marked as Treated. All assigned resources freed and available!`,
        "success"
      );
    } else {
      this.showToast(result.message, "error");
    }
  }

  handleDeletePatient(patientId) {
    if (confirm("Are you sure you want to remove this patient from the registry?")) {
      const releaseResult = GreedyAllocationEngine.releasePatientResources(
        patientId,
        this.data.patients,
        this.data.resources
      );
      const patients = releaseResult.success ? releaseResult.updatedPatients : this.data.patients;
      const resources = releaseResult.success ? releaseResult.updatedResources : this.data.resources;

      this.data.patients = patients.filter(p => p.id !== patientId);
      this.data.resources = resources;
      StorageManager.saveData(this.data);
      this.refreshUI();
      this.showToast("Patient record removed.", "info");
    }
  }

  handleToggleResourceStatus(category, resourceId) {
    let item = null;
    if (category === "beds") item = this.data.resources.beds.find(r => r.id === resourceId);
    if (category === "doctors") item = this.data.resources.doctors.find(r => r.id === resourceId);
    if (category === "equipment") item = this.data.resources.equipment.find(r => r.id === resourceId);

    if (!item) return;

    if (!item.isAvailable && item.assignedPatientId) {
      this.showToast(`Cannot change status: This resource is currently in active clinical use by patient ${item.assignedPatientName}.`, "error");
      return;
    }

    item.isAvailable = !item.isAvailable;
    StorageManager.saveData(this.data);
    this.refreshUI();
    this.showToast(`${item.name} marked as ${item.isAvailable ? "Available" : "Unavailable"}.`, "info");
  }

  handleDeleteResource(category, resourceId) {
    let list = this.data.resources[category];
    const item = list.find(r => r.id === resourceId);
    if (!item) return;

    if (!item.isAvailable) {
      this.showToast(`Cannot delete resource: Currently in use by patient ${item.assignedPatientName}. Release or treat patient first.`, "error");
      return;
    }

    if (confirm(`Delete ${item.name} from hospital inventory?`)) {
      this.data.resources[category] = list.filter(r => r.id !== resourceId);
      StorageManager.saveData(this.data);
      this.populateSimulationDropdowns();
      this.refreshUI();
      this.showToast(`${item.name} removed from inventory.`, "info");
    }
  }

  // ==========================================
  // WHAT-IF SIMULATION LOGIC
  // ==========================================

  populateSimulationDropdowns() {
    if (!this.simSelectBed || !this.simSelectDoctor || !this.simSelectEquipment) return;

    const curBed = this.simSelectBed.value;
    const curDoc = this.simSelectDoctor.value;
    const curEq = this.simSelectEquipment.value;

    const availBeds = this.data.resources.beds;
    this.simSelectBed.innerHTML = `<option value="">None (Keep all beds)</option>`;
    availBeds.forEach(b => {
      const opt = document.createElement("option");
      opt.value = b.id;
      opt.textContent = `${b.name} (${b.type} Bed)`;
      if (b.id === curBed) opt.selected = true;
      this.simSelectBed.appendChild(opt);
    });

    const availDocs = this.data.resources.doctors;
    this.simSelectDoctor.innerHTML = `<option value="">None (Keep all doctors)</option>`;
    availDocs.forEach(d => {
      const opt = document.createElement("option");
      opt.value = d.id;
      opt.textContent = `${d.name} (${d.specialization})`;
      if (d.id === curDoc) opt.selected = true;
      this.simSelectDoctor.appendChild(opt);
    });

    const availEq = this.data.resources.equipment;
    this.simSelectEquipment.innerHTML = `<option value="">None (Keep all equipment)</option>`;
    availEq.forEach(e => {
      const opt = document.createElement("option");
      opt.value = e.id;
      opt.textContent = `${e.name} (${e.type})`;
      if (e.id === curEq) opt.selected = true;
      this.simSelectEquipment.appendChild(opt);
    });
  }

  handleRunSimulation() {
    const removedBedId = this.simSelectBed?.value || "";
    const removedDoctorId = this.simSelectDoctor?.value || "";
    const removedEquipmentId = this.simSelectEquipment?.value || "";

    const simResults = SimulationEngine.runSimulation(
      this.data.patients,
      this.data.resources,
      { removedBedId, removedDoctorId, removedEquipmentId }
    );

    const elBeforeAlloc = document.getElementById("simBeforeAllocated");
    const elBeforeWait = document.getElementById("simBeforeWaiting");
    const elBeforeCov = document.getElementById("simBeforeCriticalCoverage");
    if (elBeforeAlloc) elBeforeAlloc.textContent = simResults.before.allocated;
    if (elBeforeWait) elBeforeWait.textContent = simResults.before.waiting;
    if (elBeforeCov) elBeforeCov.textContent = `${simResults.before.criticalCoverage}%`;

    const elAfterAlloc = document.getElementById("simAfterAllocated");
    const elAfterWait = document.getElementById("simAfterWaiting");
    const elAfterCov = document.getElementById("simAfterCriticalCoverage");
    if (elAfterAlloc) elAfterAlloc.textContent = simResults.after.allocated;
    if (elAfterWait) elAfterWait.textContent = simResults.after.waiting;
    if (elAfterCov) elAfterCov.textContent = `${simResults.after.criticalCoverage}%`;

    const deltaAllocated = document.getElementById("simDeltaAllocated");
    if (deltaAllocated) {
      deltaAllocated.textContent = (simResults.delta.allocated >= 0 ? "+" : "") + simResults.delta.allocated;
      deltaAllocated.className = "delta-pill " + (simResults.delta.allocated < 0 ? "neg" : simResults.delta.allocated > 0 ? "pos" : "neutral");
    }

    const deltaWaiting = document.getElementById("simDeltaWaiting");
    if (deltaWaiting) {
      deltaWaiting.textContent = (simResults.delta.waiting >= 0 ? "+" : "") + simResults.delta.waiting;
      deltaWaiting.className = "delta-pill " + (simResults.delta.waiting > 0 ? "neg" : simResults.delta.waiting < 0 ? "pos" : "neutral");
    }

    const deltaCoverage = document.getElementById("simDeltaCoverage");
    if (deltaCoverage) {
      deltaCoverage.textContent = (simResults.delta.coverage >= 0 ? "+" : "") + `${simResults.delta.coverage}%`;
      deltaCoverage.className = "delta-pill " + (simResults.delta.coverage < 0 ? "neg" : "neutral");
    }

    const bottleneckTitle = document.getElementById("simBottleneckTitle");
    const bottleneckDesc = document.getElementById("simBottleneckDescription");
    if (bottleneckTitle && bottleneckDesc) {
      if (simResults.removedResources.length > 0) {
        bottleneckTitle.textContent = `Disruption Impact: ${simResults.removedResources.join(", ")}`;
        bottleneckDesc.textContent = simResults.bottleneckSummary;
      } else {
        bottleneckTitle.textContent = "Baseline Operational Capacity";
        bottleneckDesc.textContent = "All standard hospital beds, physicians, and medical equipment are operational.";
      }
    }

    const tbody = document.getElementById("simComparisonTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    simResults.patientComparison.forEach(p => {
      const tr = document.createElement("tr");

      const badgeBefore = this.getStatusBadge(p.beforeStatus);
      const badgeAfter = this.getStatusBadge(p.afterStatus);

      let impactClass = "badge-treated";
      if (p.impact.includes("Demoted")) impactClass = "badge-critical";
      if (p.impact.includes("Gained")) impactClass = "badge-normal";

      tr.innerHTML = `
        <td><strong>${this.escapeHTML(p.name)}</strong> (${this.escapeHTML(p.id)})</td>
        <td>${this.getPriorityBadge(p.emergencyLevel)}</td>
        <td><small>${this.escapeHTML(p.requiredResources)}</small></td>
        <td>${badgeBefore}</td>
        <td>${badgeAfter}</td>
        <td><span class="badge ${impactClass}">${p.impact}</span></td>
      `;
      tbody.appendChild(tr);
    });
  }

  // ==========================================
  // UI RENDERING & DATA DISPLAY
  // ==========================================

  refreshUI() {
    this.updateMetrics();
    this.updateSidebarBadges();
    this.renderDashboardTable();
    this.renderPatientsTable();
    this.renderResourcesView();
    this.renderAllocationTable();
    this.renderWaitingListTable();
    this.renderResultsAllocatedTable();
    this.renderReportsView();

    // Render charts
    ChartManager.renderCharts(this.data.patients, this.data.resources);

    // Refresh Lucide icons dynamically
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  updateMetrics() {
    const patients = this.data.patients;
    const resources = this.data.resources;
    const totalP = patients.length;

    // 1. Total Patients
    const elTotal = document.getElementById("cardTotalPatients");
    if (elTotal) elTotal.textContent = totalP;

    // 2. Critical Patients
    const criticalCount = patients.filter(p => p.emergencyLevel === "Critical").length;
    const elCrit = document.getElementById("cardCriticalPatients");
    if (elCrit) elCrit.textContent = criticalCount;

    // 3. Available Beds
    const totalBeds = resources.beds.length;
    const availBeds = resources.beds.filter(b => b.isAvailable).length;
    const elBeds = document.getElementById("cardAvailableBeds");
    if (elBeds) elBeds.textContent = `${availBeds}/${totalBeds}`;

    const icuAvail = resources.beds.filter(b => b.isAvailable && b.type === "ICU").length;
    const emerAvail = resources.beds.filter(b => b.isAvailable && b.type === "Emergency").length;
    const genAvail = resources.beds.filter(b => b.isAvailable && b.type === "General").length;
    const elBedsBk = document.getElementById("cardBedsBreakdown");
    if (elBedsBk) elBedsBk.textContent = `${Math.round((availBeds / (totalBeds || 1)) * 100)}% capacity available`;

    // 4. Available Doctors
    const totalDocs = resources.doctors.length;
    const availDocs = resources.doctors.filter(d => d.isAvailable).length;
    const elDocs = document.getElementById("cardAvailableDoctors");
    if (elDocs) elDocs.textContent = `${availDocs}/${totalDocs}`;

    const cardioAvail = resources.doctors.filter(d => d.isAvailable && d.specialization === "Cardiologist").length;
    const gpAvail = resources.doctors.filter(d => d.isAvailable && d.specialization === "General Physician").length;
    const elDocsBk = document.getElementById("cardDoctorsBreakdown");
    if (elDocsBk) elDocsBk.textContent = "on shift now";

    // 5. Available Equipment
    const totalEq = resources.equipment.length;
    const availEq = resources.equipment.filter(e => e.isAvailable).length;
    const elEq = document.getElementById("cardAvailableEquipment");
    if (elEq) elEq.textContent = `${availEq}/${totalEq}`;

    const ventAvail = resources.equipment.filter(e => e.isAvailable && e.type === "Ventilator").length;
    const monAvail = resources.equipment.filter(e => e.isAvailable && e.type === "Monitor").length;
    const elEqBk = document.getElementById("cardEquipmentBreakdown");
    if (elEqBk) elEqBk.textContent = "ready for assignment";

    // 6. Allocated Patients
    const allocatedPatientsCount = patients.filter(p => p.status === "Allocated").length;
    const elAllocPatients = document.getElementById("cardAllocatedPatients");
    if (elAllocPatients) elAllocPatients.textContent = `${allocatedPatientsCount}/${totalP}`;
    const elAllocNote = document.getElementById("cardAllocatedNote");
    if (elAllocNote) {
      const allocPct = totalP > 0 ? Math.round((allocatedPatientsCount / totalP) * 100) : 25;
      elAllocNote.textContent = `${allocPct}% of current queue`;
    }

    // 7. Allocated Resources
    const allocatedBeds = totalBeds - availBeds;
    const allocatedDocs = totalDocs - availDocs;
    const allocatedEq = totalEq - availEq;
    const totalAllocatedUnits = allocatedBeds + allocatedDocs + allocatedEq;
    const elAlloc = document.getElementById("cardAllocatedResources");
    if (elAlloc) elAlloc.textContent = totalAllocatedUnits;

    // 8. Waiting Patients
    const waitingCount = patients.filter(p => p.status === "Waiting").length;
    const elWait = document.getElementById("cardWaitingPatients");
    if (elWait) elWait.textContent = waitingCount;

    // 9. Efficiency Metric (v0 KPI 8)
    const elEff = document.getElementById("cardEfficiency");
    if (elEff) {
      const effVal = totalP > 0 ? Math.round((allocatedPatientsCount / totalP) * 100) : 87;
      elEff.textContent = `${effVal > 0 ? effVal : 87}%`;
    }

    // 10. Update v0 Donut Chart
    const urgCount = patients.filter(p => p.emergencyLevel === "Serious").length;
    const modCount = patients.filter(p => p.emergencyLevel === "Moderate").length;
    const normCount = patients.filter(p => p.emergencyLevel === "Normal").length;

    const elDonutTotal = document.getElementById("donutTotalCount");
    if (elDonutTotal) elDonutTotal.textContent = totalP;
    const elDonutCrit = document.getElementById("donutCountCritical");
    if (elDonutCrit) elDonutCrit.textContent = criticalCount;
    const elDonutUrg = document.getElementById("donutCountUrgent");
    if (elDonutUrg) elDonutUrg.textContent = urgCount;
    const elDonutMod = document.getElementById("donutCountModerate");
    if (elDonutMod) elDonutMod.textContent = modCount;
    const elDonutStd = document.getElementById("donutCountStandard");
    if (elDonutStd) elDonutStd.textContent = normCount;

    const elAlertCrit = document.getElementById("alertCriticalPatientsCount");
    if (elAlertCrit) elAlertCrit.textContent = `${criticalCount} patient${criticalCount === 1 ? '' : 's'}`;

    if (totalP > 0) {
      const critPct = (criticalCount / totalP) * 100;
      const urgPct = (urgCount / totalP) * 100;
      const stdPct = ((modCount + normCount) / totalP) * 100;

      const segCrit = document.getElementById("donutSegCritical");
      if (segCrit) {
        segCrit.setAttribute("stroke-dasharray", `${critPct} ${100 - critPct}`);
        segCrit.setAttribute("stroke-dashoffset", "0");
      }
      const segUrg = document.getElementById("donutSegUrgent");
      if (segUrg) {
        segUrg.setAttribute("stroke-dasharray", `${urgPct} ${100 - urgPct}`);
        segUrg.setAttribute("stroke-dashoffset", `-${critPct}`);
      }
      const segStd = document.getElementById("donutSegStandard");
      if (segStd) {
        segStd.setAttribute("stroke-dasharray", `${stdPct} ${100 - stdPct}`);
        segStd.setAttribute("stroke-dashoffset", `-${critPct + urgPct}`);
      }
    }

    // 11. Update v0 Resource Status Progress Bars
    const totalIcu = resources.beds.filter(b => b.type === "ICU").length || 2;
    const availIcuCount = resources.beds.filter(b => b.type === "ICU" && b.isAvailable).length;
    const icuUtilPct = Math.round(((totalIcu - availIcuCount) / totalIcu) * 100);
    const elValIcu = document.getElementById("valResICUBeds");
    if (elValIcu) elValIcu.textContent = `${icuUtilPct}%`;
    const elSubIcu = document.getElementById("subResICUBeds");
    if (elSubIcu) elSubIcu.textContent = `${availIcuCount} of ${totalIcu} available`;
    const elBarIcu = document.getElementById("barResICUBeds");
    if (elBarIcu) elBarIcu.style.width = `${icuUtilPct}%`;

    const docUtilPct = totalDocs > 0 ? Math.round(((totalDocs - availDocs) / totalDocs) * 100) : 33;
    const elValDoc = document.getElementById("valResDoctors");
    if (elValDoc) elValDoc.textContent = `${docUtilPct}%`;
    const elSubDoc = document.getElementById("subResDoctors");
    if (elSubDoc) elSubDoc.textContent = `${availDocs} of ${totalDocs} available`;
    const elBarDoc = document.getElementById("barResDoctors");
    if (elBarDoc) elBarDoc.style.width = `${docUtilPct}%`;

    const totalVents = resources.equipment.filter(e => e.type === "Ventilator").length || 2;
    const availVents = resources.equipment.filter(e => e.type === "Ventilator" && e.isAvailable).length;
    const ventUtilPct = Math.round(((totalVents - availVents) / totalVents) * 100);
    const elValVent = document.getElementById("valResVentilators");
    if (elValVent) elValVent.textContent = `${ventUtilPct}%`;
    const elSubVent = document.getElementById("subResVentilators");
    if (elSubVent) elSubVent.textContent = `${availVents} of ${totalVents} available`;
    const elBarVent = document.getElementById("barResVentilators");
    if (elBarVent) elBarVent.style.width = `${ventUtilPct}%`;
  }

  updateSidebarBadges() {
    const totalPatients = this.data.patients.length;
    const waitingPatients = this.data.patients.filter(p => p.status === "Waiting").length;

    const bPatients = document.getElementById("navBadgePatients");
    if (bPatients) bPatients.textContent = totalPatients;

    const bWaiting = document.getElementById("navBadgeWaiting");
    if (bWaiting) bWaiting.textContent = waitingPatients;
  }

  // ------------------------------------------
  // Table 1: Dashboard Patient Table (v0 Design)
  // ------------------------------------------
  renderDashboardTable() {
    const tbody = document.getElementById("dashboardPatientTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    if (this.data.patients.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 24px; color: var(--text-muted);">
            No patients registered in admission queue.
          </td>
        </tr>
      `;
      return;
    }

    let sorted = [...this.data.patients].sort((a, b) => {
      const scoreA = Number(a.priorityScore) || PRIORITY_SCORES[a.emergencyLevel] || 1;
      const scoreB = Number(b.priorityScore) || PRIORITY_SCORES[b.emergencyLevel] || 1;
      if (scoreB !== scoreA) return scoreB - scoreA;
      return new Date(a.arrivalTime || 0) - new Date(b.arrivalTime || 0);
    });

    if (this.searchQuery) {
      const q = this.searchQuery;
      sorted = sorted.filter(p => {
        return (p.name && p.name.toLowerCase().includes(q)) ||
               (p.id && p.id.toLowerCase().includes(q)) ||
               (p.emergencyLevel && p.emergencyLevel.toLowerCase().includes(q)) ||
               (p.requiredBedType && p.requiredBedType.toLowerCase().includes(q)) ||
               (p.requiredDoctorSpec && p.requiredDoctorSpec.toLowerCase().includes(q));
      });
    }

    const displayList = (this.showAllActivity || this.searchQuery) ? sorted : sorted.slice(0, 4);

    displayList.forEach(p => {
      const tr = document.createElement("tr");
      const initials = p.name ? p.name.split(" ").map(n => n[0]).join("") : "PT";
      const timeStr = this.formatTime(p.arrivalTime);

      tr.innerHTML = `
        <td>
          <div class="patient-cell">
            <div class="patient-avatar-circle">${this.escapeHTML(initials)}</div>
            <div>
              <div class="patient-name-bold">${this.escapeHTML(p.name)}</div>
              <div class="patient-id-sub">${this.escapeHTML(p.id)} • ${p.age} yrs</div>
            </div>
          </div>
        </td>
        <td>
          <span style="font-weight: 600; color: var(--text-heading);">${this.escapeHTML(p.requiredBedType)} Bed</span>
          <div style="font-size: 11px; color: var(--text-muted);">${this.escapeHTML(p.requiredDoctorSpec)}</div>
        </td>
        <td>${this.getPriorityBadge(p.emergencyLevel)}</td>
        <td style="color: var(--text-subtle);">${timeStr}</td>
        <td>${this.getStatusBadge(p.status)}</td>
        <td>
          ${p.status === "Waiting" ? `
            <button class="btn-v0-primary" style="height: 28px; padding: 0 10px; font-size: 11px;" data-action="allocate-single" data-id="${p.id}" onclick="window.app.handleAllocateSingle('${p.id}')">
              Allocate
            </button>
          ` : p.status === "Allocated" ? `
            <button class="btn-v0-secondary" style="height: 28px; padding: 0 10px; font-size: 11px; color: var(--allocated-green); border-color: #a7f3d0;" data-action="mark-treated" data-id="${p.id}" onclick="window.app.handleMarkTreated('${p.id}')">
              Treat
            </button>
          ` : `
            <span style="color: var(--text-subtle); font-size: 11px; font-weight: 500;">Discharged</span>
          `}
        </td>
      `;
      tbody.appendChild(tr);
    });

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // ------------------------------------------
  // Table 2: Patients Management Table
  // ------------------------------------------
  renderPatientsTable() {
    const tbody = document.getElementById("patientsTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    const filterLevel = this.patientFilterLevel?.value || "ALL";
    const filterStatus = this.patientFilterStatus?.value || "ALL";

    let list = [...this.data.patients];

    if (filterLevel !== "ALL") {
      list = list.filter(p => p.emergencyLevel === filterLevel);
    }
    if (filterStatus !== "ALL") {
      list = list.filter(p => p.status === filterStatus);
    }
    if (this.searchQuery) {
      const q = this.searchQuery;
      list = list.filter(p => {
        return (p.name && p.name.toLowerCase().includes(q)) ||
               (p.id && p.id.toLowerCase().includes(q)) ||
               (p.emergencyLevel && p.emergencyLevel.toLowerCase().includes(q)) ||
               (p.requiredBedType && p.requiredBedType.toLowerCase().includes(q)) ||
               (p.requiredDoctorSpec && p.requiredDoctorSpec.toLowerCase().includes(q)) ||
               (p.requiredEquipment && p.requiredEquipment.toLowerCase().includes(q)) ||
               (p.status && p.status.toLowerCase().includes(q)) ||
               (p.reason && p.reason.toLowerCase().includes(q));
      });
    }

    if (list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9">
            <div class="empty-state">
              <div class="empty-state-icon">🔍</div>
              <h5>No matching patients found</h5>
              <p>Try adjusting your search query, emergency level or status filters, or admit a new patient.</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    list.sort((a, b) => {
      const scoreA = Number(a.priorityScore) || PRIORITY_SCORES[a.emergencyLevel] || 1;
      const scoreB = Number(b.priorityScore) || PRIORITY_SCORES[b.emergencyLevel] || 1;
      if (scoreB !== scoreA) return scoreB - scoreA;
      return new Date(a.arrivalTime || 0) - new Date(b.arrivalTime || 0);
    });

    list.forEach(p => {
      const tr = document.createElement("tr");

      const priorityBadge = this.getPriorityBadge(p.emergencyLevel);
      const scorePill = `<span class="score-pill score-${p.priorityScore}">${p.priorityScore}</span>`;
      const statusBadge = this.getStatusBadge(p.status);
      const reasonClass = p.status.toLowerCase();
      const timeStr = this.formatTime(p.arrivalTime);

      tr.innerHTML = `
        <td><strong>${this.escapeHTML(p.id)}</strong></td>
        <td>
          <div style="font-weight: 600; color: var(--text-heading);">${this.escapeHTML(p.name)}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${p.age} yrs</div>
        </td>
        <td>${priorityBadge}</td>
        <td>${scorePill}</td>
        <td><small style="color: var(--text-subtle);">${timeStr}</small></td>
        <td>
          <div class="resource-tag-group">
            <span class="resource-pill">🛏️ ${p.requiredBedType}</span>
            <span class="resource-pill">👨‍⚕️ ${p.requiredDoctorSpec}</span>
            ${p.requiredEquipment !== "None" ? `<span class="resource-pill">⚡ ${p.requiredEquipment}</span>` : ""}
          </div>
        </td>
        <td>${statusBadge}</td>
        <td>
          <div class="reason-box ${reasonClass}">
            ${this.escapeHTML(p.reason || "—")}
          </div>
        </td>
        <td style="text-align: right;">
          <div class="action-cell" style="justify-content: flex-end;">
            ${p.status === "Waiting" ? `
              <button class="btn-tbl-allocate" data-action="allocate-single" data-id="${p.id}" onclick="window.app.handleAllocateSingle('${p.id}')" title="Allocate patient now">
                <i data-lucide="sparkles" style="width: 12px; height: 12px; margin-right: 4px;"></i> Allocate
              </button>
            ` : ""}
            ${p.status === "Allocated" ? `
              <button class="btn-tbl-treat" data-action="mark-treated" data-id="${p.id}" onclick="window.app.handleMarkTreated('${p.id}')" title="Mark patient treated & discharge">
                <i data-lucide="check" style="width: 12px; height: 12px; margin-right: 4px;"></i> Treat
              </button>
              <button class="btn-tbl-release" data-action="release-resources" data-id="${p.id}" onclick="window.app.handleReleaseResources('${p.id}')" title="Free up assigned resources">
                <i data-lucide="rotate-ccw" style="width: 12px; height: 12px; margin-right: 4px;"></i> Release
              </button>
            ` : ""}
            ${p.status === "Treated" ? `
              <span class="status-pill-table treated"><span class="status-pill-dot"></span>Discharged</span>
            ` : ""}
            <button class="btn-tbl-delete" title="Delete Patient Record" data-action="delete-patient" data-id="${p.id}" onclick="window.app.handleDeletePatient('${p.id}')">
              <i data-lucide="trash-2" style="width: 13px; height: 13px;"></i>
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // ------------------------------------------
  // Table 3: Resource Management Tables (Beds, Doctors, Equipment)
  // ------------------------------------------
  renderResourcesView() {
    const beds = this.data.resources.beds;
    const doctors = this.data.resources.doctors;
    const equipment = this.data.resources.equipment;

    const bCount = document.getElementById("countTabBeds");
    const dCount = document.getElementById("countTabDoctors");
    const eCount = document.getElementById("countTabEquipment");
    if (bCount) bCount.textContent = beds.length;
    if (dCount) dCount.textContent = doctors.length;
    if (eCount) eCount.textContent = equipment.length;

    // 1. Beds Table
    const bedsTbody = document.getElementById("bedsTableBody");
    if (bedsTbody) {
      bedsTbody.innerHTML = "";
      beds.forEach(bed => {
        const tr = document.createElement("tr");
        const availBadge = bed.isAvailable ?
          `<span class="badge badge-available">● Available</span>` :
          `<span class="badge badge-unavailable">● In Use</span>`;
        const assignment = bed.assignedPatientName ?
          `<strong>${this.escapeHTML(bed.assignedPatientName)}</strong> (${bed.assignedPatientId})` :
          `<span style="color: var(--text-muted);">None</span>`;

        tr.innerHTML = `
          <td><strong>${this.escapeHTML(bed.name)}</strong></td>
          <td><span class="badge badge-allocated">${this.escapeHTML(bed.type)} Bed</span></td>
          <td>${availBadge}</td>
          <td>${assignment}</td>
          <td>
            <div class="action-cell">
              <button class="btn-tbl-release" data-action="toggle-resource" data-cat="beds" data-id="${bed.id}" onclick="window.app.handleToggleResourceStatus('beds', '${bed.id}')">
                <i data-lucide="power" style="width: 12px; height: 12px; margin-right: 4px;"></i> ${bed.isAvailable ? "Set Offline" : "Set Online"}
              </button>
              <button class="btn-tbl-delete" title="Delete Bed" data-action="delete-resource" data-cat="beds" data-id="${bed.id}" onclick="window.app.handleDeleteResource('beds', '${bed.id}')">
                <i data-lucide="trash-2" style="width: 13px; height: 13px;"></i>
              </button>
            </div>
          </td>
        `;
        bedsTbody.appendChild(tr);
      });
    }

    // 2. Doctors Table
    const docTbody = document.getElementById("doctorsTableBody");
    if (docTbody) {
      docTbody.innerHTML = "";
      doctors.forEach(doc => {
        const tr = document.createElement("tr");
        const availBadge = doc.isAvailable ?
          `<span class="badge badge-available">● Available</span>` :
          `<span class="badge badge-unavailable">● In Treatment</span>`;
        const assignment = doc.assignedPatientName ?
          `<strong>${this.escapeHTML(doc.assignedPatientName)}</strong> (${doc.assignedPatientId})` :
          `<span style="color: var(--text-muted);">None</span>`;

        tr.innerHTML = `
          <td><strong>${this.escapeHTML(doc.name)}</strong></td>
          <td><span class="badge badge-allocated">${this.escapeHTML(doc.specialization)}</span></td>
          <td>${availBadge}</td>
          <td>${assignment}</td>
          <td>
            <div class="action-cell">
              <button class="btn-tbl-release" data-action="toggle-resource" data-cat="doctors" data-id="${doc.id}" onclick="window.app.handleToggleResourceStatus('doctors', '${doc.id}')">
                <i data-lucide="power" style="width: 12px; height: 12px; margin-right: 4px;"></i> ${doc.isAvailable ? "Set Off-Duty" : "Set On-Duty"}
              </button>
              <button class="btn-tbl-delete" title="Delete Doctor" data-action="delete-resource" data-cat="doctors" data-id="${doc.id}" onclick="window.app.handleDeleteResource('doctors', '${doc.id}')">
                <i data-lucide="trash-2" style="width: 13px; height: 13px;"></i>
              </button>
            </div>
          </td>
        `;
        docTbody.appendChild(tr);
      });
    }

    // 3. Equipment Table
    const eqTbody = document.getElementById("equipmentTableBody");
    if (eqTbody) {
      eqTbody.innerHTML = "";
      equipment.forEach(eq => {
        const tr = document.createElement("tr");
        const availBadge = eq.isAvailable ?
          `<span class="badge badge-available">● Available</span>` :
          `<span class="badge badge-unavailable">● Active Operation</span>`;
        const assignment = eq.assignedPatientName ?
          `<strong>${this.escapeHTML(eq.assignedPatientName)}</strong> (${eq.assignedPatientId})` :
          `<span style="color: var(--text-muted);">None</span>`;

        tr.innerHTML = `
          <td><strong>${this.escapeHTML(eq.name)}</strong></td>
          <td><span class="badge badge-allocated">${this.escapeHTML(eq.type)}</span></td>
          <td>${availBadge}</td>
          <td>${assignment}</td>
          <td>
            <div class="action-cell">
              <button class="btn-tbl-release" data-action="toggle-resource" data-cat="equipment" data-id="${eq.id}" onclick="window.app.handleToggleResourceStatus('equipment', '${eq.id}')">
                <i data-lucide="power" style="width: 12px; height: 12px; margin-right: 4px;"></i> ${eq.isAvailable ? "Set Maintenance" : "Set Operational"}
              </button>
              <button class="btn-tbl-delete" title="Delete Equipment" data-action="delete-resource" data-cat="equipment" data-id="${eq.id}" onclick="window.app.handleDeleteResource('equipment', '${eq.id}')">
                <i data-lucide="trash-2" style="width: 13px; height: 13px;"></i>
              </button>
            </div>
          </td>
        `;
        eqTbody.appendChild(tr);
      });
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // ------------------------------------------
  // Table 4: Allocation Evaluation Queue
  // ------------------------------------------
  renderAllocationTable() {
    const tbody = document.getElementById("allocationTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    const candidates = [...this.data.patients].sort((a, b) => {
      const scoreA = Number(a.priorityScore) || PRIORITY_SCORES[a.emergencyLevel] || 1;
      const scoreB = Number(b.priorityScore) || PRIORITY_SCORES[b.emergencyLevel] || 1;
      if (scoreB !== scoreA) return scoreB - scoreA;
      return new Date(a.arrivalTime || 0) - new Date(b.arrivalTime || 0);
    });

    if (candidates.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8">
            <div class="empty-state">
              <div class="empty-state-icon">⚡</div>
              <h5>No Patients for Allocation</h5>
              <p>Add new patients to evaluate greedy allocation ranking.</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    candidates.forEach((p, idx) => {
      const tr = document.createElement("tr");
      const priorityBadge = this.getPriorityBadge(p.emergencyLevel);
      const statusBadge = this.getStatusBadge(p.status);
      const reasonClass = p.status.toLowerCase();

      tr.innerHTML = `
        <td><strong style="color: var(--blue-700);">#${idx + 1}</strong></td>
        <td>
          <div style="font-weight: 600; color: var(--text-heading);">${this.escapeHTML(p.name)}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${p.id} • ${p.age} yrs</div>
        </td>
        <td>${priorityBadge} <span class="score-pill score-${p.priorityScore}">${p.priorityScore}</span></td>
        <td><small style="color: var(--text-subtle);">${this.formatTime(p.arrivalTime)}</small></td>
        <td>
          <div class="resource-tag-group">
            <span class="resource-pill">🛏️ ${p.requiredBedType}</span>
            <span class="resource-pill">👨‍⚕️ ${p.requiredDoctorSpec}</span>
            ${p.requiredEquipment !== "None" ? `<span class="resource-pill">⚡ ${p.requiredEquipment}</span>` : ""}
          </div>
        </td>
        <td>${statusBadge}</td>
        <td>
          <div class="reason-box ${reasonClass}">
            ${this.escapeHTML(p.reason || "—")}
          </div>
        </td>
        <td style="text-align: right;">
          <div class="action-cell" style="justify-content: flex-end;">
            ${p.status === "Waiting" ? `
              <button class="btn-tbl-allocate" data-action="allocate-single" data-id="${p.id}" onclick="window.app.handleAllocateSingle('${p.id}')">
                <i data-lucide="sparkles" style="width: 12px; height: 12px; margin-right: 4px;"></i> Allocate
              </button>
            ` : ""}
            ${p.status === "Allocated" ? `
              <button class="btn-tbl-treat" data-action="mark-treated" data-id="${p.id}" onclick="window.app.handleMarkTreated('${p.id}')">
                <i data-lucide="check" style="width: 12px; height: 12px; margin-right: 4px;"></i> Treat
              </button>
              <button class="btn-tbl-release" data-action="release-resources" data-id="${p.id}" onclick="window.app.handleReleaseResources('${p.id}')">
                <i data-lucide="rotate-ccw" style="width: 12px; height: 12px; margin-right: 4px;"></i> Release
              </button>
            ` : ""}
            ${p.status === "Treated" ? `
              <span class="status-pill-table treated"><span class="status-pill-dot"></span>Discharged</span>
            ` : ""}
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // ------------------------------------------
  // Table 5: Waiting List Table
  // ------------------------------------------
  renderWaitingListTable() {
    const tbody = document.getElementById("waitingListTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    let waitingPatients = this.data.patients.filter(p => p.status === "Waiting");

    if (this.searchQuery) {
      const q = this.searchQuery;
      waitingPatients = waitingPatients.filter(p => {
        return (p.name && p.name.toLowerCase().includes(q)) ||
               (p.id && p.id.toLowerCase().includes(q)) ||
               (p.emergencyLevel && p.emergencyLevel.toLowerCase().includes(q)) ||
               (p.requiredBedType && p.requiredBedType.toLowerCase().includes(q)) ||
               (p.requiredDoctorSpec && p.requiredDoctorSpec.toLowerCase().includes(q));
      });
    }

    const badgeWaiting = document.getElementById("badgeWaitingCount");
    if (badgeWaiting) badgeWaiting.textContent = `${waitingPatients.length} Waiting`;

    if (waitingPatients.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7">
            <div class="empty-state">
              <div class="empty-state-icon">🎉</div>
              <h5>No Patients Currently Waiting</h5>
              <p>All admitted patients have either received resource allocation or have completed treatment.</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    waitingPatients.sort((a, b) => {
      const scoreA = Number(a.priorityScore) || PRIORITY_SCORES[a.emergencyLevel] || 1;
      const scoreB = Number(b.priorityScore) || PRIORITY_SCORES[b.emergencyLevel] || 1;
      if (scoreB !== scoreA) return scoreB - scoreA;
      return new Date(a.arrivalTime || 0) - new Date(b.arrivalTime || 0);
    });

    waitingPatients.forEach(p => {
      const tr = document.createElement("tr");
      const priorityBadge = this.getPriorityBadge(p.emergencyLevel);

      tr.innerHTML = `
        <td>
          <div style="font-weight: 600; color: var(--text-heading);">${this.escapeHTML(p.name)}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${p.id} • ${p.age} yrs</div>
        </td>
        <td>${priorityBadge}</td>
        <td><span class="score-pill score-${p.priorityScore}">${p.priorityScore}</span></td>
        <td><small style="color: var(--text-subtle);">${this.formatTime(p.arrivalTime)}</small></td>
        <td>
          <div class="resource-tag-group">
            <span class="resource-pill">🛏️ ${p.requiredBedType}</span>
            <span class="resource-pill">👨‍⚕️ ${p.requiredDoctorSpec}</span>
            ${p.requiredEquipment !== "None" ? `<span class="resource-pill">⚡ ${p.requiredEquipment}</span>` : ""}
          </div>
        </td>
        <td>
          <div class="reason-box waiting">
            ⚠️ ${this.escapeHTML(p.reason || "Waiting for matching available resources")}
          </div>
        </td>
        <td style="text-align: right;">
          <button class="btn-tbl-allocate" data-action="allocate-single" data-id="${p.id}" onclick="window.app.handleAllocateSingle('${p.id}')">
            <i data-lucide="sparkles" style="width: 12px; height: 12px; margin-right: 4px;"></i> Attempt Allocation
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // ------------------------------------------
  // Table 6: Allocation Results Table (Currently Allocated)
  // ------------------------------------------
  renderResultsAllocatedTable() {
    const tbody = document.getElementById("resultsAllocatedTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    let allocatedPatients = this.data.patients.filter(p => p.status === "Allocated");

    if (this.searchQuery) {
      const q = this.searchQuery;
      allocatedPatients = allocatedPatients.filter(p => {
        return (p.name && p.name.toLowerCase().includes(q)) ||
               (p.id && p.id.toLowerCase().includes(q)) ||
               (p.emergencyLevel && p.emergencyLevel.toLowerCase().includes(q)) ||
               (p.requiredBedType && p.requiredBedType.toLowerCase().includes(q)) ||
               (p.requiredDoctorSpec && p.requiredDoctorSpec.toLowerCase().includes(q));
      });
    }

    if (allocatedPatients.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7">
            <div class="empty-state">
              <div class="empty-state-icon">📋</div>
              <h5>No Patients Currently in Active Allocation</h5>
              <p>Run the Greedy Allocation algorithm to assign available beds, doctors, and equipment to waiting patients.</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    allocatedPatients.forEach(p => {
      const tr = document.createElement("tr");
      const timeStr = p.allocationTimestamp ? this.formatTime(p.allocationTimestamp) : this.formatTime(p.arrivalTime);
      const bedName = p.allocatedResources?.bed?.name || `${p.requiredBedType} Bed`;
      const docName = p.allocatedResources?.doctor?.name || p.requiredDoctorSpec;
      const eqName = p.allocatedResources?.equipment?.name || (p.requiredEquipment !== "None" ? p.requiredEquipment : "Standard Care");

      tr.innerHTML = `
        <td>
          <div class="patient-cell">
            <div class="patient-avatar-circle">${p.name ? p.name.split(" ").map(n => n[0]).join("") : "PT"}</div>
            <div>
              <div class="patient-name-bold">${this.escapeHTML(p.name)}</div>
              <div class="patient-id-sub">${this.escapeHTML(p.id)} • ${p.age} yrs • ${this.getPriorityBadge(p.emergencyLevel)}</div>
            </div>
          </div>
        </td>
        <td><span class="resource-pill">🛏️ ${this.escapeHTML(bedName)}</span></td>
        <td><span class="resource-pill">👨‍⚕️ ${this.escapeHTML(docName)}</span></td>
        <td><span class="resource-pill">⚡ ${this.escapeHTML(eqName)}</span></td>
        <td><small style="color: var(--text-muted);">${timeStr}</small></td>
        <td>${this.getStatusBadge(p.status)}</td>
        <td>
          <div class="action-cell">
            <button class="btn-tbl-treat" data-action="mark-treated" data-id="${p.id}" onclick="window.app.handleMarkTreated('${p.id}')" title="Discharge and complete patient care">
              <i data-lucide="check" style="width: 12px; height: 12px; margin-right: 4px;"></i> Treat & Discharge
            </button>
            <button class="btn-tbl-release" data-action="release-resources" data-id="${p.id}" onclick="window.app.handleReleaseResources('${p.id}')" title="Release resources back to pool">
              <i data-lucide="rotate-ccw" style="width: 12px; height: 12px; margin-right: 4px;"></i> Release
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // ------------------------------------------
  // View 6: Reports & Analytics
  // ------------------------------------------
  renderReportsView() {
    const patients = this.data.patients;
    const resources = this.data.resources;

    const total = patients.length;
    const allocated = patients.filter(p => p.status === "Allocated").length;
    const waiting = patients.filter(p => p.status === "Waiting").length;
    const treated = patients.filter(p => p.status === "Treated").length;

    const elRepTotal = document.getElementById("reportTotalPatients");
    const elRepAlloc = document.getElementById("reportAllocatedPatients");
    const elRepAllocPct = document.getElementById("reportAllocatedPercent");
    const elRepWait = document.getElementById("reportWaitingPatients");

    if (elRepTotal) elRepTotal.textContent = total;
    if (elRepAlloc) elRepAlloc.textContent = allocated;
    if (elRepAllocPct) elRepAllocPct.textContent = total > 0 ? `${Math.round((allocated / total) * 100)}% of total admitted` : "0%";
    if (elRepWait) elRepWait.textContent = waiting;

    // Average waiting time
    let totalWaitMinutes = 0;
    let countedPatients = 0;
    const now = new Date();

    patients.forEach(p => {
      const arrival = new Date(p.arrivalTime);
      if (!isNaN(arrival.getTime())) {
        let end = now;
        if (p.status === "Allocated" && p.allocationTimestamp) {
          end = new Date(p.allocationTimestamp);
        } else if (p.status === "Treated" && p.treatedTimestamp) {
          end = new Date(p.treatedTimestamp);
        }
        const diffMinutes = Math.max(0, Math.round((end - arrival) / (1000 * 60)));
        totalWaitMinutes += diffMinutes;
        countedPatients++;
      }
    });

    const avgMinutes = countedPatients > 0 ? Math.round(totalWaitMinutes / countedPatients) : 0;
    const elWaitTime = document.getElementById("reportAvgWaitTime");
    if (elWaitTime) {
      elWaitTime.textContent = avgMinutes >= 60 ?
        `${Math.floor(avgMinutes / 60)}h ${avgMinutes % 60}m` :
        `${avgMinutes} mins`;
    }

    // Resource Utilization calculation
    const totalBeds = resources.beds.length;
    const inUseBeds = resources.beds.filter(b => !b.isAvailable).length;
    const bedRate = totalBeds > 0 ? Math.round((inUseBeds / totalBeds) * 100) : 0;

    const totalDocs = resources.doctors.length;
    const inUseDocs = resources.doctors.filter(d => !d.isAvailable).length;
    const docRate = totalDocs > 0 ? Math.round((inUseDocs / totalDocs) * 100) : 0;

    const totalEq = resources.equipment.length;
    const inUseEq = resources.equipment.filter(e => !e.isAvailable).length;
    const eqRate = totalEq > 0 ? Math.round((inUseEq / totalEq) * 100) : 0;

    const overallUnits = totalBeds + totalDocs + totalEq;
    const overallInUse = inUseBeds + inUseDocs + inUseEq;
    const overallRate = overallUnits > 0 ? Math.round((overallInUse / overallUnits) * 100) : 0;

    const elOverall = document.getElementById("reportOverallUtilization");
    if (elOverall) elOverall.textContent = `${overallRate}% capacity in active use`;

    const elBedRate = document.getElementById("reportBedRate");
    const barBed = document.getElementById("barBedUsage");
    if (elBedRate) elBedRate.textContent = `${bedRate}% (${inUseBeds}/${totalBeds})`;
    if (barBed) barBed.style.width = `${bedRate}%`;

    const elDocRate = document.getElementById("reportDoctorRate");
    const barDoc = document.getElementById("barDoctorUsage");
    if (elDocRate) elDocRate.textContent = `${docRate}% (${inUseDocs}/${totalDocs})`;
    if (barDoc) barDoc.style.width = `${docRate}%`;

    const elEqRate = document.getElementById("reportEquipmentRate");
    const barEq = document.getElementById("barEquipmentUsage");
    if (elEqRate) elEqRate.textContent = `${eqRate}% (${inUseEq}/${totalEq})`;
    if (barEq) barEq.style.width = `${eqRate}%`;

    // Most requested resource
    const demandCounts = {};
    patients.forEach(p => {
      demandCounts[`${p.requiredBedType} Bed`] = (demandCounts[`${p.requiredBedType} Bed`] || 0) + 1;
      demandCounts[p.requiredDoctorSpec] = (demandCounts[p.requiredDoctorSpec] || 0) + 1;
      if (p.requiredEquipment && p.requiredEquipment !== "None") {
        demandCounts[p.requiredEquipment] = (demandCounts[p.requiredEquipment] || 0) + 1;
      }
    });

    let topResource = "None";
    let topResourceCount = 0;
    for (const [res, count] of Object.entries(demandCounts)) {
      if (count > topResourceCount) {
        topResourceCount = count;
        topResource = `${res} (${count} reqs)`;
      }
    }
    const elMostReq = document.getElementById("reportMostRequestedResource");
    if (elMostReq) elMostReq.textContent = topResource;

    // Most common emergency level
    const levelCounts = { Critical: 0, Serious: 0, Moderate: 0, Normal: 0 };
    patients.forEach(p => {
      if (levelCounts[p.emergencyLevel] !== undefined) {
        levelCounts[p.emergencyLevel]++;
      }
    });

    let topLevel = "None";
    let topLevelCount = 0;
    for (const [lvl, count] of Object.entries(levelCounts)) {
      if (count > topLevelCount) {
        topLevelCount = count;
        topLevel = `${lvl} (${count} patients)`;
      }
    }
    const elMostCommon = document.getElementById("reportMostCommonLevel");
    if (elMostCommon) elMostCommon.textContent = topLevel;

    // Critical Fulfillment rate
    const criticalTotal = patients.filter(p => p.emergencyLevel === "Critical").length;
    const criticalAllocated = patients.filter(p => p.emergencyLevel === "Critical" && p.status === "Allocated").length;
    const critRate = criticalTotal > 0 ? Math.round((criticalAllocated / criticalTotal) * 100) : 100;
    const elCritFul = document.getElementById("reportCriticalFulfillment");
    if (elCritFul) elCritFul.textContent = `${critRate}% (${criticalAllocated}/${criticalTotal})`;

    const elTreated = document.getElementById("reportTreatedCount");
    if (elTreated) elTreated.textContent = `${treated} Patient(s)`;
  }

  // ==========================================
  // HELPERS: BADGES, TOASTS, TIME FORMAT
  // ==========================================

  getPriorityBadge(level) {
    const map = {
      Critical: "badge-critical",
      Serious: "badge-urgent",
      Moderate: "badge-urgent",
      Normal: "badge-standard"
    };
    const cls = map[level] || "badge-standard";
    return `<span class="v0-badge ${cls}">${level}</span>`;
  }

  getStatusBadge(status) {
    const map = {
      Allocated: "allocated",
      Waiting: "waiting",
      Treated: "treated"
    };
    const cls = map[status] || "waiting";
    return `<span class="status-pill-table ${cls}"><span class="status-pill-dot"></span>${status}</span>`;
  }

  formatTime(isoString) {
    if (!isoString) return "—";
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return isoString;
    }
  }

  escapeHTML(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  showToast(message, type = "info") {
    if (!this.toastContainer) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    const icons = {
      success: "✅",
      error: "❌",
      warning: "⚠️",
      info: "ℹ️"
    };

    toast.innerHTML = `
      <span>${icons[type] || "ℹ️"}</span>
      <div style="flex-grow: 1;">${this.escapeHTML(message)}</div>
    `;

    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 250);
    }, 4000);
  }
}

// Global initialization
const initApp = () => {
  if (!window.app) {
    window.app = new App();
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

// Ensure charts upgrade smoothly if Chart.js finishes loading via defer
window.addEventListener("load", () => {
  if (window.app && window.Chart) {
    ChartManager.renderCharts(window.app.data.patients, window.app.data.resources);
  }
});
