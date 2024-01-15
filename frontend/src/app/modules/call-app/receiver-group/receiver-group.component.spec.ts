import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiverGroupComponent } from './receiver-group.component';

describe('ReceiverGroupComponent', () => {
  let component: ReceiverGroupComponent;
  let fixture: ComponentFixture<ReceiverGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiverGroupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceiverGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
