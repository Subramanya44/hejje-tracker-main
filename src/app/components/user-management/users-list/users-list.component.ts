import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { UserRoleLabels, UserRoleValue } from 'src/app/models/profile';
import {AuthService} from 'src/app/services/auth.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
})
export class UsersListComponent implements OnInit {

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

  date = new Date();
  public users: any = [];
  currentPage: number = 1; // Current page
  itemsPerPage: number = 10; // Number of items per page
  inviteForm: FormGroup = new FormGroup({});
  userRoleList: (keyof UserRoleLabels)[] = Object.keys(UserRoleValue) as (keyof UserRoleLabels)[];

  constructor(private formBuilder: FormBuilder, private authService: AuthService) {
  }

  getUserRoleLabel(roleKey: keyof UserRoleLabels): string {
    return UserRoleValue[roleKey];
  }

  ngOnInit() {
    this.initForm();
    this.loadUsers();
  }

  initForm() {
    this.inviteForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      mobile: ['', [Validators.required, Validators.minLength(10)]],
      full_name: ['', [Validators.required, Validators.minLength(3)]],
      role: ['', [Validators.required]],
      circle_name:['', [Validators.required]],
      division_name:['', [Validators.required]],
      range_name:['', [Validators.required]]
    });
  }

  invite() {
    const data = {
      email: this.inviteForm.value.email,
      password: this.inviteForm.value.password,
      options: {
        data: {
          mobile: this.inviteForm.value.mobile,
          full_name: this.inviteForm.value.full_name,
          role: this.inviteForm.value.role,
          circle_name:this.inviteForm.value.circle_name,
          division_name:this.inviteForm.value.division_name,
          range_name:this.inviteForm.value.range_name
        }
      }
    }
    this.authService.signUp(data);

    // clear form
    this.inviteForm.reset();

    // show message user created successfully
    // this.showAlert('Success', 'User created successfully');

    // reload users
    this.loadUsers();
  }

  loadUsers() {
    this.authService.fetchAllUsers().then((users: any) => {
      this.users = users;
    })
  }

  // update track
  updateUser(trackId: number, newStatus: string) {
    this.authService.updateUserStatus(trackId, newStatus).then(() => {
      this.loadUsers(); // Reload users after update
    })
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  get totalPages(): number {
    // Calculate total pages based on data length and items per page
    return Math.ceil(this.users.length / this.itemsPerPage);
  }

  get visibleUsers(): any[] {
    // Calculate the range of items to display for the current page
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.users.length);
    return this.users.slice(startIndex, endIndex);
  }

  onPageSizeChange(event: any) {
    this.itemsPerPage = event.target.value;
    this.currentPage = 1;
  }

  setFilteredItems(event: any) {
    this.users = event;
    this.currentPage = 1;
  }


}
