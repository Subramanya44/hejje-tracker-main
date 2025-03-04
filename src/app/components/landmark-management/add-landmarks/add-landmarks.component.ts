import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LandmarksService } from 'src/app/services/landmarks.service';

@Component({
  selector: 'app-add-landmarks',
  templateUrl: './add-landmarks.component.html',
  styleUrls: ['./add-landmarks.component.scss'],
})
export class AddLandmarksComponent  implements OnInit {
   range_name = [
    { value: 'BELURU', label: 'BELURU' },
    { value: 'YESLURU', label: 'YESLURU' },
    { value: 'ALURU', label: 'ALURU' },
    { value: 'SAKALESHAPURA', label: 'SAKALESHAPURA' }
  ];

  division_name = [
    { value: 'division name 1', label: 'division name 1' },
    { value: 'division name 2', label: 'division name 2' }
  ];

  circle_name = [
    { value: 'circle name 1', label: 'circle name 1' },
    { value: 'circle name 2', label: 'circle name 2' }
  ];

  addLandmarksForm: FormGroup = new FormGroup({});
  id: number = 0;

  constructor(private formBuilder:FormBuilder,private router:Router, private landmarksService: LandmarksService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.handleRoute();
    this.initForm();
  }

  initForm() {
    this.addLandmarksForm = this.formBuilder.group({
      // created_at: [new Date().toISOString()],
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      latitude: [['']],
      longitude: [['']],
      circle_name:[],
      division_name:[],
      range_name:[],
      status: [],
    });
  }

  onSubmit() {
      
     if(this.id > 0) {
      this.landmarksService.updateLandmark(this.addLandmarksForm.value, this.id).then(() => {
        this.router.navigate(['/landmarks-management/']);

      });
    }
      else {
        this.landmarksService.insertLandmark(this.addLandmarksForm.value).then((landmark) => {
          this.addLandmarksForm.reset();
          this.router.navigate(['/landmarks-management/']);
      
          });
        }
  }

  handleRoute() {
    this.route.url.subscribe(urlSegments => {
      if (urlSegments.length && urlSegments[urlSegments.length - 1].path === 'new') {
        // If route ends with 'new', show an empty form
        this.addLandmarksForm.reset();
      } else {
        // If route ends with a number, fetch data based on that number
        const id = +urlSegments[urlSegments.length - 1].path;
        if (!isNaN(id) && id > 0) {
          this.id = id;
          this.loadLandmarkData(id);
        } else {
          // Invalid route
          console.error('Invalid route');
        }
      }
    });
  }

  loadLandmarkData(landmarkId: number) {

    this.landmarksService.fetchLandmark(landmarkId).then((landmark) => {
      this.addLandmarksForm.patchValue(landmark);
    });
  }




}
