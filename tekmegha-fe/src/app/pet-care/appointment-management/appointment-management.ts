import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SupabaseService } from '../../shared/services/supabase.service';
import { StoreSessionService } from '../../shared/services/store-session.service';
import { Subscription } from 'rxjs';

interface PetAppointment {
  id: string;
  megha_store_id: string;
  appointment_number: string;
  user_id?: string;
  doctor_id?: string;
  service_id?: string;
  pet_name: string;
  pet_type: string;
  pet_breed?: string;
  pet_age_months?: number;
  pet_weight_kg?: number;
  appointment_date: string;
  appointment_time: string;
  appointment_type: string;
  address?: string;
  phone: string;
  email?: string;
  symptoms?: string;
  previous_medical_history?: string;
  status: string;
  total_amount: number;
  payment_status: string;
  payment_method?: string;
  notes?: string;
  created_at: string;
}

interface FreelanceDoctor {
  id: string;
  full_name: string;
  specialization: string;
  phone: string;
  email?: string;
}

interface PetCareService {
  id: string;
  service_name: string;
  service_type: string;
  price: number;
  duration_minutes: number;
}

@Component({
  selector: 'app-appointment-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './appointment-management.html',
  styleUrl: './appointment-management.scss'
})
export class AppointmentManagementComponent implements OnInit, OnDestroy {
  appointments: PetAppointment[] = [];
  doctors: FreelanceDoctor[] = [];
  services: PetCareService[] = [];
  selectedAppointment: PetAppointment | null = null;
  isAddingAppointment = false;
  isEditingAppointment = false;
  appointmentForm: FormGroup;
  private subscription = new Subscription();

  // Status options
  statusOptions = [
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'no_show', label: 'No Show' }
  ];

  // Appointment types
  appointmentTypes = [
    { value: 'clinic', label: 'Clinic Visit' },
    { value: 'home_visit', label: 'Home Visit' },
    { value: 'emergency', label: 'Emergency' }
  ];

  // Pet types
  petTypes = [
    { value: 'dog', label: 'Dog' },
    { value: 'cat', label: 'Cat' },
    { value: 'bird', label: 'Bird' },
    { value: 'fish', label: 'Fish' },
    { value: 'rabbit', label: 'Rabbit' },
    { value: 'hamster', label: 'Hamster' },
    { value: 'other', label: 'Other' }
  ];

  // Payment status options
  paymentStatusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
    { value: 'refunded', label: 'Refunded' }
  ];

  // Filter options
  filterStatus = 'all';
  filterDate = '';
  searchTerm = '';

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private storeSessionService: StoreSessionService
  ) {
    this.appointmentForm = this.fb.group({
      pet_name: ['', [Validators.required, Validators.minLength(2)]],
      pet_type: ['', Validators.required],
      pet_breed: [''],
      pet_age_months: [0, [Validators.min(0)]],
      pet_weight_kg: [0, [Validators.min(0)]],
      appointment_date: ['', Validators.required],
      appointment_time: ['', Validators.required],
      appointment_type: ['', Validators.required],
      doctor_id: [''],
      service_id: [''],
      address: [''],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
      email: ['', [Validators.email]],
      symptoms: [''],
      previous_medical_history: [''],
      total_amount: [0, [Validators.required, Validators.min(0)]],
      payment_status: ['pending', Validators.required],
      payment_method: [''],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.loadAppointments();
    this.loadDoctors();
    this.loadServices();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadAppointments(): void {
    this.subscription.add(
      this.storeSessionService.getCurrentStore().subscribe((store: any) => {
        if (store?.id) {
          this.supabaseService.getData('pet_appointments', { megha_store_id: store.id }).subscribe({
            next: (appointments: any) => {
              this.appointments = appointments;
            },
            error: (error: any) => {
              console.error('Error loading appointments:', error);
            }
          });
        }
      })
    );
  }

  loadDoctors(): void {
    this.subscription.add(
      this.storeSessionService.getCurrentStore().subscribe((store: any) => {
        if (store?.id) {
          this.supabaseService.getData('freelance_doctors', { megha_store_id: store.id }).subscribe({
            next: (doctors: any) => {
              this.doctors = doctors;
            },
            error: (error: any) => {
              console.error('Error loading doctors:', error);
            }
          });
        }
      })
    );
  }

  loadServices(): void {
    this.subscription.add(
      this.storeSessionService.getCurrentStore().subscribe((store: any) => {
        if (store?.id) {
          this.supabaseService.getData('pet_care_services', { megha_store_id: store.id }).subscribe({
            next: (services: any) => {
              this.services = services;
            },
            error: (error: any) => {
              console.error('Error loading services:', error);
            }
          });
        }
      })
    );
  }

  addAppointment(): void {
    this.isAddingAppointment = true;
    this.isEditingAppointment = false;
    this.selectedAppointment = null;
    this.appointmentForm.reset();
    this.appointmentForm.patchValue({
      payment_status: 'pending'
    });
  }

  editAppointment(appointment: PetAppointment): void {
    this.selectedAppointment = appointment;
    this.isEditingAppointment = true;
    this.isAddingAppointment = false;
    this.appointmentForm.patchValue({
      pet_name: appointment.pet_name,
      pet_type: appointment.pet_type,
      pet_breed: appointment.pet_breed,
      pet_age_months: appointment.pet_age_months,
      pet_weight_kg: appointment.pet_weight_kg,
      appointment_date: appointment.appointment_date,
      appointment_time: appointment.appointment_time,
      appointment_type: appointment.appointment_type,
      doctor_id: appointment.doctor_id,
      service_id: appointment.service_id,
      address: appointment.address,
      phone: appointment.phone,
      email: appointment.email,
      symptoms: appointment.symptoms,
      previous_medical_history: appointment.previous_medical_history,
      total_amount: appointment.total_amount,
      payment_status: appointment.payment_status,
      payment_method: appointment.payment_method,
      notes: appointment.notes
    });
  }

  saveAppointment(): void {
    if (this.appointmentForm.valid) {
      const formData = this.appointmentForm.value;
      
      this.subscription.add(
        this.storeSessionService.getCurrentStore().subscribe((store: any) => {
          if (store?.id) {
            const appointmentData = {
              ...formData,
              megha_store_id: store.id,
              appointment_number: this.generateAppointmentNumber(),
              status: 'scheduled'
            };

            if (this.isAddingAppointment) {
              this.supabaseService.createData('pet_appointments', appointmentData).subscribe({
                next: () => {
                  this.loadAppointments();
                  this.isAddingAppointment = false;
                  this.appointmentForm.reset();
                },
                error: (error: any) => {
                  console.error('Error creating appointment:', error);
                }
              });
            } else if (this.selectedAppointment) {
              this.supabaseService.updateData('pet_appointments', this.selectedAppointment.id, appointmentData).subscribe({
                next: () => {
                  this.loadAppointments();
                  this.isEditingAppointment = false;
                  this.selectedAppointment = null;
                  this.appointmentForm.reset();
                },
                error: (error: any) => {
                  console.error('Error updating appointment:', error);
                }
              });
            }
          }
        })
      );
    }
  }

  updateAppointmentStatus(appointment: PetAppointment, status: string): void {
    this.supabaseService.updateData('pet_appointments', appointment.id, { status }).subscribe({
      next: () => {
        this.loadAppointments();
      },
      error: (error: any) => {
        console.error('Error updating appointment status:', error);
      }
    });
  }

  updatePaymentStatus(appointment: PetAppointment, payment_status: string): void {
    this.supabaseService.updateData('pet_appointments', appointment.id, { payment_status }).subscribe({
      next: () => {
        this.loadAppointments();
      },
      error: (error: any) => {
        console.error('Error updating payment status:', error);
      }
    });
  }

  deleteAppointment(appointment: PetAppointment): void {
    if (confirm(`Are you sure you want to delete appointment ${appointment.appointment_number}?`)) {
      this.supabaseService.deleteData('pet_appointments', appointment.id).subscribe({
        next: () => {
          this.loadAppointments();
        },
        error: (error: any) => {
          console.error('Error deleting appointment:', error);
        }
      });
    }
  }

  getFilteredAppointments(): PetAppointment[] {
    let filtered = this.appointments;

    if (this.filterStatus !== 'all') {
      filtered = filtered.filter(appointment => appointment.status === this.filterStatus);
    }

    if (this.filterDate) {
      filtered = filtered.filter(appointment => appointment.appointment_date === this.filterDate);
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(appointment => 
        appointment.pet_name.toLowerCase().includes(term) ||
        appointment.appointment_number.toLowerCase().includes(term) ||
        appointment.phone.includes(term)
      );
    }

    return filtered.sort((a, b) => {
      const dateA = new Date(a.appointment_date + ' ' + a.appointment_time);
      const dateB = new Date(b.appointment_date + ' ' + b.appointment_time);
      return dateA.getTime() - dateB.getTime();
    });
  }

  getStatusLabel(status: string): string {
    const statusObj = this.statusOptions.find(s => s.value === status);
    return statusObj ? statusObj.label : status;
  }

  getStatusClass(status: string): string {
    return `status-${status.replace('_', '-')}`;
  }

  getPaymentStatusLabel(status: string): string {
    const statusObj = this.paymentStatusOptions.find(s => s.value === status);
    return statusObj ? statusObj.label : status;
  }

  getPaymentStatusClass(status: string): string {
    return `payment-${status}`;
  }

  getPetTypeLabel(type: string): string {
    const typeObj = this.petTypes.find(t => t.value === type);
    return typeObj ? typeObj.label : type;
  }

  getDoctorName(doctorId: string): string {
    const doctor = this.doctors.find(d => d.id === doctorId);
    return doctor ? doctor.full_name : 'Unknown Doctor';
  }

  getServiceName(serviceId: string): string {
    const service = this.services.find(s => s.id === serviceId);
    return service ? service.service_name : 'Unknown Service';
  }

  generateAppointmentNumber(): string {
    const now = new Date();
    const timestamp = now.getTime().toString().slice(-6);
    return `APT${timestamp}`;
  }

  cancelEdit(): void {
    this.isAddingAppointment = false;
    this.isEditingAppointment = false;
    this.selectedAppointment = null;
    this.appointmentForm.reset();
  }
}
