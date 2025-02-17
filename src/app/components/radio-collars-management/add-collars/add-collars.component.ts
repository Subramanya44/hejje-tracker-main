import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CollarsService } from 'src/app/services/collars.service';

@Component({
  selector: 'app-add-collars',
  templateUrl: './add-collars.component.html',
  styleUrls: ['./add-collars.component.scss'],
})
export class AddCollarsComponent  implements OnInit {
  addCollarsForm: FormGroup = new FormGroup({});
  id: number = 0;


  constructor(private formBuilder:FormBuilder,private collarsService: CollarsService, private router:Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.handleRoute();
    this.initForm();
  }

initForm() {
    this.addCollarsForm = this.formBuilder.group({
      // created_at: [new Date().toISOString()],
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      imei: [['']],
      status: [],
    });
  }

  onSubmit() {
    if(this.id > 0) {
      this.collarsService.updateCollar(this.addCollarsForm.value, this.id).then(() => {
        this.router.navigate(['/radio-collars']);
      });
    }else {
    this.collarsService.insertCollar(this.addCollarsForm.value).then((collar) => {
      this.addCollarsForm.reset();
      this.router.navigate(['/radio-collars']);
    });
  }

  }

  handleRoute() {
    this.route.url.subscribe(urlSegments => {
      if (urlSegments.length && urlSegments[urlSegments.length - 1].path === 'new') {
        // If route ends with 'new', show an empty form
        this.addCollarsForm.reset();
      } else {
        // If route ends with a number, fetch data based on that number
        const id = +urlSegments[urlSegments.length - 1].path;
        if (!isNaN(id) && id > 0) {
          this.id = id;
          this.collarsService.fetchCollar(id).then((collar) => {
            this.addCollarsForm.patchValue(collar);
          });
        } else {
          // Invalid route
          console.error('Invalid route');
        }
      }
    });
  }

}
