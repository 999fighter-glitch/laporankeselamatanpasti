export type ReportType = 'keselamatan' | 'kesihatan';
export type ReportStatus = 'pending' | 'resolved';

export interface ReportRecord {
  id: string;
  type: ReportType;
  date: string;
  time: string;
  reporter: string;
  phone: string;
  location: string; // Nama Pasti / Cawangan / Lokasi
  status?: ReportStatus; // 'pending' | 'resolved'
  
  // Keselamatan fields
  problem?: string;
  severity?: 'rendah' | 'sederhana' | 'kritikal';
  
  // Kesihatan fields
  healthCategory?: string; // e.g. 'Penyakit Berjangkit', 'Kecederaan', 'Lain-lain'
  diseaseType?: string; // e.g. 'HFMD', 'Influenza', 'Dengue', 'Chickenpox', 'Demam Selsema', 'LAIN-LAIN'
  diseaseOther?: string;
  studentCount?: string;
  studentNames?: string[];
  quarantinePeriod?: string;
  sanitationDone?: boolean;
}

export type ViewState = 
  | 'code'
  | 'reporter'
  | 'category'
  | 'safety_form'
  | 'health_form'
  | 'history'
  | 'admin_login'
  | 'admin_dashboard';
