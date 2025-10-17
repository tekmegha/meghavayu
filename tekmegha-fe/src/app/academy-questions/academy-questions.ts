import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

interface Question {
  id: string;
  questionCode: string;
  questionText: string;
  questionType: 'multiple_choice' | 'true_false' | 'fill_blank' | 'essay';
  difficultyLevel: 'easy' | 'medium' | 'hard' | 'expert';
  timeLimitSeconds: number;
  points: number;
  imageUrl?: string;
  options?: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
  }>;
  correctAnswer?: string;
  explanation?: string;
  tags: string[];
  source?: string;
  year?: number;
  category: {
    id: string;
    name: string;
    colorCode: string;
  };
  jobPills: Array<{
    id: string;
    title: string;
    colorCode: string;
  }>;
  geographyAreas: Array<{
    id: string;
    name: string;
    type: string;
  }>;
  politicsAreas: Array<{
    id: string;
    name: string;
    type: string;
  }>;
}

interface Category {
  id: string;
  categoryCode: string;
  categoryName: string;
  description: string;
  imageUrl?: string;
  colorCode: string;
  questionCount: number;
}

interface JobPill {
  id: string;
  jobCode: string;
  jobTitle: string;
  jobDescription: string;
  jobLevel: string;
  jobType: string;
  colorCode: string;
}

@Component({
  selector: 'app-academy-questions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './academy-questions.html',
  styleUrls: ['./academy-questions.scss']
})
export class AcademyQuestionsComponent implements OnInit, OnDestroy {
  questions: Question[] = [];
  categories: Category[] = [];
  jobPills: JobPill[] = [];
  selectedCategory: string = '';
  selectedJobPill: string = '';
  selectedDifficulty: string = '';
  selectedGeography: string = '';
  selectedPolitics: string = '';
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  
  // Loading states
  isLoading = false;
  
  private subscription = new Subscription();

  constructor() {}

  ngOnInit() {
    this.loadCategories();
    this.loadJobPills();
    this.loadQuestions();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadCategories() {
    // Mock data - replace with actual service call
    this.categories = [
      {
        id: '1',
        categoryCode: 'gk',
        categoryName: 'General Knowledge',
        description: 'Current affairs, history, geography, and general awareness',
        colorCode: '#3b82f6',
        questionCount: 1250
      },
      {
        id: '2',
        categoryCode: 'math',
        categoryName: 'Mathematics',
        description: 'Quantitative aptitude, arithmetic, algebra, and geometry',
        colorCode: '#10b981',
        questionCount: 980
      },
      {
        id: '3',
        categoryCode: 'science',
        categoryName: 'Science',
        description: 'Physics, chemistry, biology, and environmental science',
        colorCode: '#f59e0b',
        questionCount: 750
      },
      {
        id: '4',
        categoryCode: 'english',
        categoryName: 'English Language',
        description: 'Grammar, vocabulary, comprehension, and literature',
        colorCode: '#8b5cf6',
        questionCount: 650
      },
      {
        id: '5',
        categoryCode: 'reasoning',
        categoryName: 'Logical Reasoning',
        description: 'Analytical and logical reasoning questions',
        colorCode: '#ef4444',
        questionCount: 420
      }
    ];
  }

  loadJobPills() {
    // Mock data - replace with actual service call
    this.jobPills = [
      {
        id: '1',
        jobCode: 'upsc',
        jobTitle: 'UPSC Civil Services',
        jobDescription: 'Union Public Service Commission - IAS, IPS, IFS',
        jobLevel: 'Senior',
        jobType: 'Government',
        colorCode: '#1e40af'
      },
      {
        id: '2',
        jobCode: 'ssc',
        jobTitle: 'SSC CGL',
        jobDescription: 'Staff Selection Commission - Combined Graduate Level',
        jobLevel: 'Mid',
        jobType: 'Government',
        colorCode: '#059669'
      },
      {
        id: '3',
        jobCode: 'banking',
        jobTitle: 'Banking Exams',
        jobDescription: 'IBPS, SBI, RBI and other banking recruitment',
        jobLevel: 'Mid',
        jobType: 'Public Sector',
        colorCode: '#dc2626'
      },
      {
        id: '4',
        jobCode: 'railway',
        jobTitle: 'Railway Exams',
        jobDescription: 'RRB NTPC, RRB Group D, Railway recruitment',
        jobLevel: 'Mid',
        jobType: 'Government',
        colorCode: '#7c3aed'
      },
      {
        id: '5',
        jobCode: 'defense',
        jobTitle: 'Defense Services',
        jobDescription: 'NDA, CDS, AFCAT and other defense exams',
        jobLevel: 'Mid',
        jobType: 'Government',
        colorCode: '#ea580c'
      }
    ];
  }

  loadQuestions() {
    this.isLoading = true;
    
    // Mock data - replace with actual service call
    setTimeout(() => {
      this.questions = [
        {
          id: '1',
          questionCode: 'GK001',
          questionText: 'Which of the following is the capital of India?',
          questionType: 'multiple_choice',
          difficultyLevel: 'easy',
          timeLimitSeconds: 60,
          points: 1,
          options: [
            { id: 'A', text: 'Mumbai', isCorrect: false },
            { id: 'B', text: 'New Delhi', isCorrect: true },
            { id: 'C', text: 'Kolkata', isCorrect: false },
            { id: 'D', text: 'Chennai', isCorrect: false }
          ],
          correctAnswer: 'B',
          explanation: 'New Delhi is the capital of India, officially known as the National Capital Territory of Delhi.',
          tags: ['Geography', 'India', 'Capital'],
          source: 'Previous Year Paper',
          year: 2023,
          category: {
            id: '1',
            name: 'General Knowledge',
            colorCode: '#3b82f6'
          },
          jobPills: [
            { id: '1', title: 'UPSC Civil Services', colorCode: '#1e40af' },
            { id: '2', title: 'SSC CGL', colorCode: '#059669' }
          ],
          geographyAreas: [
            { id: '1', name: 'India', type: 'Country' },
            { id: '2', name: 'Delhi', type: 'Union Territory' }
          ],
          politicsAreas: [
            { id: '1', name: 'Lok Sabha', type: 'National' }
          ]
        },
        {
          id: '2',
          questionCode: 'MATH001',
          questionText: 'What is the value of 15% of 240?',
          questionType: 'multiple_choice',
          difficultyLevel: 'medium',
          timeLimitSeconds: 90,
          points: 1,
          options: [
            { id: 'A', text: '32', isCorrect: false },
            { id: 'B', text: '36', isCorrect: true },
            { id: 'C', text: '40', isCorrect: false },
            { id: 'D', text: '44', isCorrect: false }
          ],
          correctAnswer: 'B',
          explanation: '15% of 240 = (15/100) × 240 = 0.15 × 240 = 36',
          tags: ['Percentage', 'Arithmetic', 'Calculation'],
          source: 'Mock Test',
          year: 2024,
          category: {
            id: '2',
            name: 'Mathematics',
            colorCode: '#10b981'
          },
          jobPills: [
            { id: '2', title: 'SSC CGL', colorCode: '#059669' },
            { id: '3', title: 'Banking Exams', colorCode: '#dc2626' }
          ],
          geographyAreas: [],
          politicsAreas: []
        }
      ];
      
      this.totalItems = this.questions.length;
      this.isLoading = false;
    }, 1000);
  }

  onCategorySelect(categoryId: string) {
    this.selectedCategory = categoryId;
    this.currentPage = 1;
    this.loadQuestions();
  }

  onJobPillSelect(jobPillId: string) {
    this.selectedJobPill = jobPillId;
    this.currentPage = 1;
    this.loadQuestions();
  }

  onDifficultySelect(difficulty: string) {
    this.selectedDifficulty = difficulty;
    this.currentPage = 1;
    this.loadQuestions();
  }

  onGeographySelect(geographyId: string) {
    this.selectedGeography = geographyId;
    this.currentPage = 1;
    this.loadQuestions();
  }

  onPoliticsSelect(politicsId: string) {
    this.selectedPolitics = politicsId;
    this.currentPage = 1;
    this.loadQuestions();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadQuestions();
  }

  getDifficultyClass(difficulty: string): string {
    return difficulty.toLowerCase();
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  getTotalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }
}
