import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RideProviderComponent } from './ride-provider.component';

describe('RideProviderComponent', () => {
  let component: RideProviderComponent;
  let fixture: ComponentFixture<RideProviderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RideProviderComponent]
    });
    fixture = TestBed.createComponent(RideProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
