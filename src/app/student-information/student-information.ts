import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { StudentService } from '../student-service';
import { StudentData } from '../Interface/IstudentData';

@Component({
  selector: 'app-student-information',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student-information.html',
  styleUrls: ['./student-information.scss'],
})
export class StudentInformation {
  private studentService = inject(StudentService);

  data: StudentData[] = [];
  form!: FormGroup;
  isEdit: boolean = false;
  editingId: any;

  formValues() {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      className: new FormControl('', Validators.required),
      courses: new FormControl('', Validators.required),
    });
  }

  ngOnInit() {
    this.formValues();
    // this.getAllCandidates();
  }

  onSave() {
    if (this.form.invalid) {
      alert('Invalid Fields');
      return;
    }

    const dto: StudentData = {
      name: this.form.value.name,
      className: this.form.value.className,
      courses: this.form.value.courses,
    };

    if (this.isEdit && this.editingId !== null) {
      dto.id = this.editingId;

      this.studentService.update(dto).subscribe({
        next: (res) => {
          this.resetForm();
          this.data = [];
          this.data.push({
            id: res.id,
            name: res.name,
            className: res.className,
            courses: res.courses,
          });
          alert('Data Updated');
        },
        error: (err) => {
          console.error(err);
          alert('Update failed');
        },
      });
    } else {
      this.studentService.create(dto).subscribe({
        next: (res) => {
          this.data.push({
            id: res.id,
            name: res.name,
            className: res.className,
            courses: res.courses,
          });

          this.resetForm();
          alert('Data Saved');
        },
        error: (err) => {
          console.error(err);
          alert('Save failed');
        },
      });
    }
  }

  getAllCandidates() {
    this.studentService.getAll().subscribe({
      next: (res: any) => {
        this.data = [];
        this.data = res;
        console.log(this.data);
      },
      error: (err) => {
        console.error(err);
        alert('Failed to load data');
      },
    });
  }
  getCandidateById(value: number) {
    if (!value || value !== +value) {
      return alert('Enter a valid ID');
    }
    this.studentService.getById(value).subscribe({
      next: (res) => {
        this.data = [];
        this.data.push(res);
      },
    });
  }

  editCandidate(item: StudentData) {
    this.isEdit = true;
    this.editingId = item.id;
    this.form.patchValue({
      name: item.name,
      className: item.className,
      courses: item.courses,
    });
  }

  delCandidate(item: StudentData) {
    if (!item.id) return;
    if (confirm('Are you sure you want to delete this user?'))
      this.studentService.delete(item.id).subscribe({
        next: () => {
          this.data = this.data.filter((d) => d.id !== item.id);
          alert('Data Deleted');
        },
        error: (err) => {
          console.error(err);
          alert('Delete failed');
        },
      });
  }

  resetForm() {
    this.form.reset();
    this.isEdit = false;
    this.editingId = null;
  }
}
