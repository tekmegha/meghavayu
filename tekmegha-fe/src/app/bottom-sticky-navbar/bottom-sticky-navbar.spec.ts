import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomStickyNavbar } from './bottom-sticky-navbar';

describe('BottomStickyNavbar', () => {
  let component: BottomStickyNavbar;
  let fixture: ComponentFixture<BottomStickyNavbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BottomStickyNavbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BottomStickyNavbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
