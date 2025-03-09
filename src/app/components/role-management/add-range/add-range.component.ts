import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RangeService } from 'src/app/services/range.service';

@Component({
  selector: 'app-add-range',
  templateUrl: './add-range.component.html',
  styleUrls: ['./add-range.component.scss'],
})
export class AddRangeComponent  implements OnInit {

  pageTitle: string = 'Range'; 
  addRangeForm: FormGroup = new FormGroup({});
  id: number = 0;
  division_name = [
    { value: 'keyfalcon4', label: 'keyfalcon4' },
    { value: 'keyfalcon1', label: 'keyfalcon1' }
  ];

  circle_name = [
    { value: 'keyfalcon5', label: 'keyfalcon5' },
    { value: 'keyfalcon2', label: 'keyfalcon2' }
  ];

  organizations = [
    { value: 'keyfalcon6', label: 'keyfalcon6' },
    { value: 'keyfalcon3', label: 'keyfalcon3' }
  ];

  constructor(private formBuilder:FormBuilder,private router:Router, private rangeService: RangeService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.handleRoute();
    this.initForm();
  }

  initForm() {
    this.addRangeForm = this.formBuilder.group({
      // created_at: [new Date().toISOString()],
      range_name: ['', [Validators.required, Validators.minLength(3)]],
      division_name: [''],
      circle_name: [''],
      organization: [['']]
    });
  }

  onSubmit() {
    if (this.id) {
      this.rangeService.updateRanges(this.id, this.addRangeForm.value);
    } else {
      this.rangeService.addRanges(this.addRangeForm.value);
    }
    
    this.router.navigate(['/role-management/list-range/']);
  }

  handleRoute() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.id = +id; 
        this.pageTitle = 'Edit Range';
        this.loadRangeData(this.id);
      } else {
        this.pageTitle = 'Add Range';
        this.addRangeForm.reset();
      }
    });
  }

  loadRangeData(rangeId: number) {
    const ranges = this.rangeService.getRanges();
    const selectedRange = ranges.find(range => range.id === rangeId);
    if (selectedRange) {
      setTimeout(() => {
        this.addRangeForm.patchValue({
          range_name: selectedRange.range_name,
          division_name: selectedRange.division_name,
          circle_name: selectedRange.circle_name,
          organization: selectedRange.organization
        });
      });
    }
  }

  cancel() {
    this.router.navigate(['/role-management/list-range/']);
  }

  goBack() {
    this.router.navigate(['/role-management/list-range/']);
  }

}
