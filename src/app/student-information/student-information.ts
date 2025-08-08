import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
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
  styleUrl: './student-information.scss',
})
export class StudentInformation {
  private studentService = inject(StudentService);

  data: StudentData[] = [];
  form!: FormGroup;
  isEdit: boolean = false;
  editingId: number | null = null;
  formValues() {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      className: new FormControl('', Validators.required),
      courses: new FormControl('', Validators.required),
    });
  }
  ngOnInit() {
    this.formValues();
  }
  onSave() {
    if (this.form.invalid) {
      alert('Invalid Fields');
      return;
    }

    if (this.isEdit && this.editingId !== null) {
      const updatedDto: StudentData = {
        id: this.editingId,
        name: this.form.value.name,
        className: this.form.value.className,
        courses: this.form.value.courses,
      };
      this.studentService.update(updatedDto).subscribe({
        next: (res) => {
          const index = this.data.findIndex((d) => d.id === this.editingId);
          if (index !== -1) this.data[index] = res;

          this.form.reset();
          this.isEdit = false;
          this.editingId = null;
          alert('Data Updated');
        },
        error: (err) => {
          console.log('Update error', err.message);
        },
      });
    } else {
      const maxId = this.data.length
        ? Math.max(...this.data.map((s) => s.id))
        : 0;

      const dto: StudentData = {
        id: maxId + 1,
        name: this.form.value.name,
        className: this.form.value.className,
        courses: this.form.value.courses,
      };

      this.studentService.create(dto).subscribe({
        next: (res) => {
          this.form.reset();
          alert('Data Saved');
          this.data.push(res);
        },
        error: (err) => {
          console.log('onSave error', err.message);
        },
      });
    }
  }
  getAllCandidates() {
    this.studentService.getAll().subscribe({
      next: (res: StudentData[]) => {
        this.data.push(...res);
      },
    });
  }
  clear() {
    this.data = [];
  }
  editCandidate(item: StudentData) {
    this.isEdit = true;
    this.form.patchValue({
      name: item.name ?? '',
      className: item.className ?? '',
      courses: item.courses ?? '',
    });
    this.editingId = item.id;
  }
  delCandidate(item: StudentData) {
    this.studentService.delete(item.id).subscribe({
      next: (res) => {
        this.data = this.data.filter((d) => d.id !== item.id);
        alert('Data Deleted');
      },
      error: (err) => {
        console.log('del error', err);
      },
    });
  }
}
