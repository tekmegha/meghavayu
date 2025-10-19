import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-visakha-vendi-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './visakha-vendi-home.html',
  styleUrl: './visakha-vendi-home.scss'
})
export class VisakhaVendiHomeComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('heroSection', { static: false }) heroSection!: ElementRef;
  @ViewChild('servicesSection', { static: false }) servicesSection!: ElementRef;

  // Animation states
  heroAnimationComplete = false;
  servicesVisible = false;
  
  // Service cards animation states
  serviceCardsVisible = [false, false, false, false];
  
  // Price calculator
  silverWeight = 0;
  silverPurity = 92.5; // 92.5% pure silver
  currentSilverRate = 850; // per gram
  estimatedValue = 0;
  
  // Contact form
  contactForm = {
    name: '',
    phone: '',
    email: '',
    message: '',
    preferredStore: '',
    appointmentDate: ''
  };
  
  // Store locations
  storeLocations = [
    {
      id: 1,
      name: 'Visakha Vendi - Main Branch',
      address: '123 Silver Street, Downtown',
      phone: '+91-9876543210',
      timings: '10:00 AM - 8:00 PM',
      services: ['Silver Exchange', 'Cash Payment', 'New Jewelry']
    },
    {
      id: 2,
      name: 'Visakha Vendi - Mall Branch',
      address: '456 Mall Road, Shopping District',
      phone: '+91-9876543211',
      timings: '11:00 AM - 9:00 PM',
      services: ['Silver Exchange', 'Cash Payment', 'New Jewelry', 'Pickup Service']
    }
  ];
  
  // Customer testimonials
  testimonials = [
    {
      id: 1,
      name: 'Priya Sharma',
      rating: 5,
      comment: 'Excellent service! Got fair price for my old silver jewelry and exchanged for beautiful new pieces.',
      location: 'Downtown Branch'
    },
    {
      id: 2,
      name: 'Rajesh Kumar',
      rating: 5,
      comment: 'Quick and transparent process. The staff was very helpful in explaining the exchange rates.',
      location: 'Mall Branch'
    },
    {
      id: 3,
      name: 'Anita Patel',
      rating: 5,
      comment: 'Best silver exchange service in the city. Highly recommended for anyone looking to exchange old jewelry.',
      location: 'Main Branch'
    }
  ];
  
  currentTestimonialIndex = 0;
  private testimonialInterval: any;

  constructor(private router: Router) {}

  ngOnInit() {
    this.startHeroAnimation();
    this.startTestimonialCarousel();
  }

  ngAfterViewInit() {
    this.setupScrollAnimations();
  }

  ngOnDestroy() {
    if (this.testimonialInterval) {
      clearInterval(this.testimonialInterval);
    }
  }

  private startHeroAnimation() {
    setTimeout(() => {
      this.heroAnimationComplete = true;
    }, 1000);
  }

  private setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target === this.servicesSection?.nativeElement) {
            this.animateServices();
          }
        }
      });
    }, { threshold: 0.3 });

    if (this.servicesSection) {
      observer.observe(this.servicesSection.nativeElement);
    }
  }

  private animateServices() {
    if (this.servicesVisible) return;
    
    this.servicesVisible = true;
    
    // Animate service cards with stagger effect
    this.serviceCardsVisible.forEach((_, index) => {
      setTimeout(() => {
        this.serviceCardsVisible[index] = true;
      }, index * 200); // 0.2s delay between each
    });
  }

  private startTestimonialCarousel() {
    this.testimonialInterval = setInterval(() => {
      this.currentTestimonialIndex = (this.currentTestimonialIndex + 1) % this.testimonials.length;
    }, 5000);
  }

  // Price calculator methods
  calculatePrice() {
    this.estimatedValue = (this.silverWeight * this.silverPurity / 100) * this.currentSilverRate;
  }

  onWeightChange() {
    this.calculatePrice();
  }

  onPurityChange() {
    this.calculatePrice();
  }

  // Navigation methods
  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Contact form methods
  onSubmitContactForm() {
    if (this.contactForm.name && this.contactForm.phone) {
      // Here you would typically send the form data to your backend
      console.log('Contact form submitted:', this.contactForm);
      alert('Thank you for your inquiry! We will contact you soon.');
      
      // Reset form
      this.contactForm = {
        name: '',
        phone: '',
        email: '',
        message: '',
        preferredStore: '',
        appointmentDate: ''
      };
    } else {
      alert('Please fill in the required fields (Name and Phone).');
    }
  }

  // WhatsApp integration
  openWhatsApp() {
    const message = 'Hello! I would like to know more about your silver exchange services.';
    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }

  // Store locator
  selectStore(store: any) {
    this.contactForm.preferredStore = store.name;
  }

  // Testimonial navigation
  previousTestimonial() {
    this.currentTestimonialIndex = this.currentTestimonialIndex === 0 
      ? this.testimonials.length - 1 
      : this.currentTestimonialIndex - 1;
  }

  nextTestimonial() {
    this.currentTestimonialIndex = (this.currentTestimonialIndex + 1) % this.testimonials.length;
  }

  // Photo upload for jewelry assessment
  onPhotoUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      console.log('Photo uploaded for jewelry assessment:', file.name);
      // Here you would typically upload the file to your backend for assessment
      alert('Photo uploaded successfully! Our experts will assess your jewelry and contact you soon.');
    }
  }

  // Get current testimonial
  get currentTestimonial() {
    return this.testimonials[this.currentTestimonialIndex];
  }

  // Generate star rating HTML
  generateStars(rating: number): string[] {
    return Array(rating).fill('★');
  }
}
