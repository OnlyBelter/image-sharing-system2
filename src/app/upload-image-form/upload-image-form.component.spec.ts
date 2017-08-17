import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadImageFormComponent } from './upload-image-form.component';

describe('UploadImageFormComponent', () => {
  let component: UploadImageFormComponent;
  let fixture: ComponentFixture<UploadImageFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadImageFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadImageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
