export type EmployeeStatus = 'Active' | 'Inactive';

export interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  status: EmployeeStatus;
  joiningDate: string;
}