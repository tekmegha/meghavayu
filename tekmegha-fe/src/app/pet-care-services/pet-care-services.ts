import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface PetCareService {
  id: string;
  service_code: string;
  service_name: string;
  service_description: string;
  service_type: string;
  category: string;
  subcategory: string;
  price: number;
  duration_minutes: number;
  is_emergency_service: boolean;
  requires_appointment: boolean;
  is_home_visit_available: boolean;
  home_visit_charge: number;
  is_active: boolean;
  sort_order: number;
}

interface FreelanceDoctor {
  id: string;
  doctor_code: string;
  full_name: string;
  specialization: string;
  qualifications: string;
  experience_years: number;
  phone: string;
  email: string;
  consultation_fee: number;
  home_visit_fee: number;
  emergency_fee: number;
  is_available_for_home_visits: boolean;
  is_available_for_emergency: boolean;
  rating: number;
  review_count: number;
  is_verified: boolean;
}

@Component({
  selector: 'app-pet-care-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pet-care-services.html',
  styleUrls: ['./pet-care-services.scss']
})
export class PetCareServicesComponent implements OnInit {
  services: PetCareService[] = [];
  doctors: FreelanceDoctor[] = [];
  loading = true;
  error: string | null = null;

  // Contact information from the image
  contactInfo = {
    phone: '8550046444',
    socialMedia: '@paws_nexus',
    qrCodeText: 'For More Info Please Scan'
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadServices();
    this.loadDoctors();
  }

  loadServices() {
    // For now, we'll use mock data based on the image
    // In production, this would fetch from the database
    this.services = [
      {
        id: '1',
        service_code: 'house_visits',
        service_name: 'House Visits',
        service_description: 'Professional pet care services at your home',
        service_type: 'medical',
        category: 'dogs',
        subcategory: 'consultation',
        price: 500.00,
        duration_minutes: 60,
        is_emergency_service: false,
        requires_appointment: true,
        is_home_visit_available: true,
        home_visit_charge: 0.00,
        is_active: true,
        sort_order: 1
      },
      {
        id: '2',
        service_code: 'vaccinations',
        service_name: 'Vaccinations',
        service_description: 'Complete vaccination services for pets',
        service_type: 'medical',
        category: 'dogs',
        subcategory: 'vaccination',
        price: 300.00,
        duration_minutes: 30,
        is_emergency_service: false,
        requires_appointment: true,
        is_home_visit_available: true,
        home_visit_charge: 0.00,
        is_active: true,
        sort_order: 2
      },
      {
        id: '3',
        service_code: 'deworming',
        service_name: 'Deworming',
        service_description: 'Deworming treatment for pets',
        service_type: 'medical',
        category: 'dogs',
        subcategory: 'treatment',
        price: 200.00,
        duration_minutes: 20,
        is_emergency_service: false,
        requires_appointment: true,
        is_home_visit_available: true,
        home_visit_charge: 0.00,
        is_active: true,
        sort_order: 3
      },
      {
        id: '4',
        service_code: 'walk_in_consultations',
        service_name: 'Walk In Consultations',
        service_description: 'Immediate consultation without appointment',
        service_type: 'medical',
        category: 'dogs',
        subcategory: 'consultation',
        price: 400.00,
        duration_minutes: 45,
        is_emergency_service: false,
        requires_appointment: false,
        is_home_visit_available: false,
        home_visit_charge: 0.00,
        is_active: true,
        sort_order: 4
      },
      {
        id: '5',
        service_code: 'blood_sampling',
        service_name: 'Blood Sampling',
        service_description: 'Blood tests and sampling for pets',
        service_type: 'medical',
        category: 'dogs',
        subcategory: 'diagnostic',
        price: 350.00,
        duration_minutes: 30,
        is_emergency_service: false,
        requires_appointment: true,
        is_home_visit_available: true,
        home_visit_charge: 0.00,
        is_active: true,
        sort_order: 5
      },
      {
        id: '6',
        service_code: 'critical_care_services',
        service_name: 'Critical Care Services',
        service_description: 'Emergency and critical care for pets',
        service_type: 'medical',
        category: 'dogs',
        subcategory: 'emergency',
        price: 1000.00,
        duration_minutes: 120,
        is_emergency_service: true,
        requires_appointment: false,
        is_home_visit_available: true,
        home_visit_charge: 0.00,
        is_active: true,
        sort_order: 6
      }
    ];
    this.loading = false;
  }

  loadDoctors() {
    // Mock data for doctors
    this.doctors = [
      {
        id: '1',
        doctor_code: 'DR001',
        full_name: 'Dr. Sarah Johnson',
        specialization: 'veterinary',
        qualifications: 'BVSc, MVSc in Veterinary Medicine',
        experience_years: 8,
        phone: '8550046444',
        email: 'sarah.johnson@paws-nexus.com',
        consultation_fee: 500.00,
        home_visit_fee: 200.00,
        emergency_fee: 1000.00,
        is_available_for_home_visits: true,
        is_available_for_emergency: true,
        rating: 4.8,
        review_count: 150,
        is_verified: true
      },
      {
        id: '2',
        doctor_code: 'DR002',
        full_name: 'Dr. Michael Chen',
        specialization: 'veterinary',
        qualifications: 'DVM, PhD in Animal Health',
        experience_years: 12,
        phone: '8550046445',
        email: 'michael.chen@paws-nexus.com',
        consultation_fee: 600.00,
        home_visit_fee: 250.00,
        emergency_fee: 1200.00,
        is_available_for_home_visits: true,
        is_available_for_emergency: true,
        rating: 4.9,
        review_count: 200,
        is_verified: true
      }
    ];
  }

  getServiceIcon(serviceCode: string): string {
    const iconMap: { [key: string]: string } = {
      'house_visits': '🏠',
      'vaccinations': '💉',
      'deworming': '🐛',
      'walk_in_consultations': '🏥',
      'blood_sampling': '🧪',
      'critical_care_services': '🩺'
    };
    return iconMap[serviceCode] || '🐾';
  }

  formatPrice(price: number): string {
    return `₹${price.toFixed(0)}`;
  }

  formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }
  }

  bookService(service: PetCareService) {
    console.log('Booking service:', service);
    // Implement booking logic
  }

  bookDoctor(doctor: FreelanceDoctor) {
    console.log('Booking doctor:', doctor);
    // Implement doctor booking logic
  }

  callPhone() {
    window.open(`tel:${this.contactInfo.phone}`, '_self');
  }

  openWhatsApp() {
    window.open(`https://wa.me/${this.contactInfo.phone.replace(/\D/g, '')}`, '_blank');
  }

  trackByServiceId(index: number, service: PetCareService): string {
    return service.id;
  }
}
