import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupMssgWindowComponent } from './group-mssg-window.component';

describe('GroupMssgWindowComponent', () => {
  let component: GroupMssgWindowComponent;
  let fixture: ComponentFixture<GroupMssgWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupMssgWindowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupMssgWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
