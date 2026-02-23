import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVideos } from './add-videos';

describe('AddVideos', () => {
  let component: AddVideos;
  let fixture: ComponentFixture<AddVideos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddVideos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddVideos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
