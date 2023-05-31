import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExternalDialogComponent } from './add-external-dialog.component';

describe('AddExternalDialogComponent', () => {
  let component: AddExternalDialogComponent;
  let fixture: ComponentFixture<AddExternalDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddExternalDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddExternalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
