import { Injectable } from '@angular/core';
import { SupabaseService } from '../../shared/services/supabase.service';
import { Observable } from 'rxjs';

export interface StaffMember {
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

export interface StaffSchedule {
  id: string;
  staff_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
  created_at: string;
}

export interface PetInventory {
  id: string;
  megha_store_id: string;
  item_code: string;
  item_name: string;
  category: string;
  subcategory?: string;
  description?: string;
  unit_price: number;
  quantity_in_stock: number;
  minimum_stock_level: number;
  supplier?: string;
  expiry_date?: string;
  is_active: boolean;
  created_at: string;
}

export interface InventoryTransaction {
  id: string;
  inventory_id: string;
  transaction_type: string;
  quantity: number;
  unit_price?: number;
  total_amount?: number;
  notes?: string;
  created_at: string;
}

export interface PetAppointment {
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

@Injectable({
  providedIn: 'root'
})
export class PetCareSupabaseService {

  constructor(private supabaseService: SupabaseService) {}

  // Staff Management Methods
  getStaffMembers(storeId: string): Observable<StaffMember[]> {
    return this.supabaseService.getData('staff_members', {
      megha_store_id: storeId
    });
  }

  createStaffMember(data: Partial<StaffMember>): Observable<StaffMember> {
    return this.supabaseService.createData('staff_members', data);
  }

  updateStaffMember(id: string, data: Partial<StaffMember>): Observable<StaffMember> {
    return this.supabaseService.updateData('staff_members', id, data);
  }

  deleteStaffMember(id: string): Observable<void> {
    return this.supabaseService.deleteData('staff_members', id);
  }

  getStaffSchedules(storeId: string): Observable<StaffSchedule[]> {
    return this.supabaseService.getData('staff_schedules', {
      megha_store_id: storeId
    });
  }

  createStaffSchedule(data: Partial<StaffSchedule>): Observable<StaffSchedule> {
    return this.supabaseService.createData('staff_schedules', data);
  }

  updateStaffSchedule(id: string, data: Partial<StaffSchedule>): Observable<StaffSchedule> {
    return this.supabaseService.updateData('staff_schedules', id, data);
  }

  deleteStaffSchedule(id: string): Observable<void> {
    return this.supabaseService.deleteData('staff_schedules', id);
  }

  // Inventory Management Methods
  getPetInventory(storeId: string): Observable<PetInventory[]> {
    return this.supabaseService.getData('pet_inventory', {
      megha_store_id: storeId
    });
  }

  createPetInventoryItem(data: Partial<PetInventory>): Observable<PetInventory> {
    return this.supabaseService.createData('pet_inventory', data);
  }

  updatePetInventoryItem(id: string, data: Partial<PetInventory>): Observable<PetInventory> {
    return this.supabaseService.updateData('pet_inventory', id, data);
  }

  deletePetInventoryItem(id: string): Observable<void> {
    return this.supabaseService.deleteData('pet_inventory', id);
  }

  getInventoryTransactions(storeId: string): Observable<InventoryTransaction[]> {
    return this.supabaseService.getData('inventory_transactions', {
      megha_store_id: storeId
    });
  }

  createInventoryTransaction(data: Partial<InventoryTransaction>): Observable<InventoryTransaction> {
    return this.supabaseService.createData('inventory_transactions', data);
  }

  updateInventoryTransaction(id: string, data: Partial<InventoryTransaction>): Observable<InventoryTransaction> {
    return this.supabaseService.updateData('inventory_transactions', id, data);
  }

  deleteInventoryTransaction(id: string): Observable<void> {
    return this.supabaseService.deleteData('inventory_transactions', id);
  }

  // Appointment Management Methods
  getPetAppointments(storeId: string): Observable<PetAppointment[]> {
    return this.supabaseService.getData('pet_appointments', {
      megha_store_id: storeId
    });
  }

  createPetAppointment(data: Partial<PetAppointment>): Observable<PetAppointment> {
    return this.supabaseService.createData('pet_appointments', data);
  }

  updatePetAppointment(id: string, data: Partial<PetAppointment>): Observable<PetAppointment> {
    return this.supabaseService.updateData('pet_appointments', id, data);
  }

  deletePetAppointment(id: string): Observable<void> {
    return this.supabaseService.deleteData('pet_appointments', id);
  }

  // Pet Care Services Methods
  getPetCareServices(storeId: string): Observable<any[]> {
    return this.supabaseService.getData('pet_care_services', {
      megha_store_id: storeId
    });
  }

  getFreelanceDoctors(storeId: string): Observable<any[]> {
    return this.supabaseService.getData('freelance_doctors', {
      megha_store_id: storeId
    });
  }

  getPetStores(storeId: string): Observable<any[]> {
    return this.supabaseService.getData('pet_stores', {
      megha_store_id: storeId
    });
  }

  // Analytics Methods
  getAppointmentAnalytics(storeId: string, startDate: string, endDate: string): Observable<any> {
    return this.supabaseService.getData('pet_appointments', {
      megha_store_id: storeId,
      appointment_date: { gte: startDate, lte: endDate }
    });
  }

  getInventoryAnalytics(storeId: string): Observable<any> {
    return this.supabaseService.getData('pet_inventory', {
      megha_store_id: storeId
    });
  }

  getStaffAnalytics(storeId: string): Observable<any> {
    return this.supabaseService.getData('staff_members', {
      megha_store_id: storeId
    });
  }

  // Dashboard Methods
  getDashboardStats(storeId: string): Observable<any> {
    return this.supabaseService.getData('pet_appointments', {
      megha_store_id: storeId
    });
  }

  getUpcomingAppointments(storeId: string, limit: number = 10): Observable<PetAppointment[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.supabaseService.getData('pet_appointments', {
      megha_store_id: storeId,
      appointment_date: { gte: today },
      status: { in: ['scheduled', 'confirmed'] }
    });
  }

  getLowStockItems(storeId: string): Observable<PetInventory[]> {
    return this.supabaseService.getData('pet_inventory', {
      megha_store_id: storeId,
      is_active: true
    });
  }

  getActiveStaff(storeId: string): Observable<StaffMember[]> {
    return this.supabaseService.getData('staff_members', {
      megha_store_id: storeId,
      is_active: true
    });
  }
}
