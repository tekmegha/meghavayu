import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SupabaseService } from '../../shared/services/supabase.service';
import { StoreSessionService } from '../../shared/services/store-session.service';
import { Subscription } from 'rxjs';

interface StaffMember {
  id: string;
  megha_store_id: string;
  staff_code: string;
  full_name: string;
  role: string;
  specialization?: string;
  qualifications?: string;
  phone: string;
  email?: string;
  address?: string;
  hire_date: string;
  salary?: number;
  is_active: boolean;
  created_at: string;
}

interface StaffSchedule {
  id: string;
  staff_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

@Component({
  selector: 'app-staff-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './staff-management.html',
  styleUrl: './staff-management.scss'
})
export class StaffManagementComponent implements OnInit, OnDestroy {
  staffMembers: StaffMember[] = [];
  staffSchedules: StaffSchedule[] = [];
  selectedStaff: StaffMember | null = null;
  isAddingStaff = false;
  isEditingStaff = false;
  staffForm: FormGroup;
  scheduleForm: FormGroup;
  private subscription = new Subscription();

  // Role options
  roles = [
    { value: 'doctor', label: 'Doctor' },
    { value: 'groomer', label: 'Groomer' },
    { value: 'trainer', label: 'Trainer' },
    { value: 'receptionist', label: 'Receptionist' },
    { value: 'nurse', label: 'Nurse' },
    { value: 'technician', label: 'Technician' }
  ];

  // Days of week
  daysOfWeek = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' }
  ];

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private storeSessionService: StoreSessionService
  ) {
    this.staffForm = this.fb.group({
      staff_code: ['', [Validators.required, Validators.minLength(3)]],
      full_name: ['', [Validators.required, Validators.minLength(2)]],
      role: ['', Validators.required],
      specialization: [''],
      qualifications: [''],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
      email: ['', [Validators.email]],
      address: [''],
      hire_date: ['', Validators.required],
      salary: [0, [Validators.min(0)]]
    });

    this.scheduleForm = this.fb.group({
      day_of_week: ['', Validators.required],
      start_time: ['', Validators.required],
      end_time: ['', Validators.required],
      is_available: [true]
    });
  }

  ngOnInit(): void {
    this.loadStaffMembers();
    this.loadStaffSchedules();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadStaffMembers(): void {
    this.subscription.add(
      this.storeSessionService.getCurrentStore().subscribe((store: any) => {
        if (store?.id) {
          this.supabaseService.getData('staff_members', { megha_store_id: store.id }).subscribe({
            next: (staff: any) => {
              this.staffMembers = staff;
            },
            error: (error: any) => {
              console.error('Error loading staff members:', error);
            }
          });
        }
      })
    );
  }

  loadStaffSchedules(): void {
    this.subscription.add(
      this.storeSessionService.getCurrentStore().subscribe((store: any) => {
        if (store?.id) {
          this.supabaseService.getData('staff_schedules', { megha_store_id: store.id }).subscribe({
            next: (schedules: any) => {
              this.staffSchedules = schedules;
            },
            error: (error: any) => {
              console.error('Error loading staff schedules:', error);
            }
          });
        }
      })
    );
  }

  addStaff(): void {
    this.isAddingStaff = true;
    this.isEditingStaff = false;
    this.selectedStaff = null;
    this.staffForm.reset();
  }

  editStaff(staff: StaffMember): void {
    this.selectedStaff = staff;
    this.isEditingStaff = true;
    this.isAddingStaff = false;
    this.staffForm.patchValue({
      staff_code: staff.staff_code,
      full_name: staff.full_name,
      role: staff.role,
      specialization: staff.specialization,
      qualifications: staff.qualifications,
      phone: staff.phone,
      email: staff.email,
      address: staff.address,
      hire_date: staff.hire_date,
      salary: staff.salary
    });
  }

  saveStaff(): void {
    if (this.staffForm.valid) {
      const formData = this.staffForm.value;
      
      this.subscription.add(
        this.storeSessionService.getCurrentStore().subscribe((store: any) => {
          if (store?.id) {
            const staffData = {
              ...formData,
              megha_store_id: store.id,
              is_active: true
            };

            if (this.isAddingStaff) {
              this.supabaseService.createData('staff_members', staffData).subscribe({
                next: () => {
                  this.loadStaffMembers();
                  this.isAddingStaff = false;
                  this.staffForm.reset();
                },
                error: (error: any) => {
                  console.error('Error creating staff member:', error);
                }
              });
            } else if (this.selectedStaff) {
              this.supabaseService.updateData('staff_members', this.selectedStaff.id, staffData).subscribe({
                next: () => {
                  this.loadStaffMembers();
                  this.isEditingStaff = false;
                  this.selectedStaff = null;
                  this.staffForm.reset();
                },
                error: (error: any) => {
                  console.error('Error updating staff member:', error);
                }
              });
            }
          }
        })
      );
    }
  }

  deleteStaff(staff: StaffMember): void {
    if (confirm(`Are you sure you want to delete ${staff.full_name}?`)) {
      this.supabaseService.deleteData('staff_members', staff.id).subscribe({
        next: () => {
          this.loadStaffMembers();
        },
        error: (error: any) => {
          console.error('Error deleting staff member:', error);
        }
      });
    }
  }

  toggleStaffStatus(staff: StaffMember): void {
    this.supabaseService.updateData('staff_members', staff.id, { is_active: !staff.is_active }).subscribe({
      next: () => {
        this.loadStaffMembers();
      },
      error: (error: any) => {
        console.error('Error updating staff status:', error);
      }
    });
  }

  addSchedule(): void {
    if (this.scheduleForm.valid && this.selectedStaff) {
      const formData = this.scheduleForm.value;
      
      this.supabaseService.createData('staff_schedules', {
        ...formData,
        staff_id: this.selectedStaff.id
      }).subscribe({
        next: () => {
          this.loadStaffSchedules();
          this.scheduleForm.reset();
        },
        error: (error: any) => {
          console.error('Error creating staff schedule:', error);
        }
      });
    }
  }

  getStaffSchedules(staffId: string): StaffSchedule[] {
    return this.staffSchedules.filter(schedule => schedule.staff_id === staffId);
  }

  getRoleLabel(role: string): string {
    const roleObj = this.roles.find(r => r.value === role);
    return roleObj ? roleObj.label : role;
  }

  getDayLabel(day: number): string {
    const dayObj = this.daysOfWeek.find(d => d.value === day);
    return dayObj ? dayObj.label : '';
  }

  cancelEdit(): void {
    this.isAddingStaff = false;
    this.isEditingStaff = false;
    this.selectedStaff = null;
    this.staffForm.reset();
    this.scheduleForm.reset();
  }
}
