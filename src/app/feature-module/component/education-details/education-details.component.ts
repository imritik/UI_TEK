import { Component, Injectable, OnInit, OnDestroy, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl, FormControlName } from '@angular/forms';
import { Observable, Subscription, fromEvent, merge, pipe, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";

import {map, startWith} from 'rxjs/operators';

export interface User {
  name: string;
}

@Component({
  selector: 'app-education-details',
  templateUrl: './education-details.component.html',
  styleUrls: ['./education-details.component.css']
})
export class EducationDetailsComponent implements OnInit {
  avengers = []; 
  formGroup: FormGroup;
  minDate: Date;
  // maxDate: Date;
  constructor(private _formBuilder: FormBuilder,
    private _http: HttpClient,
    // public snackBar: MatSnackBar,
    // private _changePasswordservice: ChangePasswordService,
    private _router: Router) { }

    options: User[] = [
      {name: 'Mary'},
      {name: 'Shelley'},
      {name: 'Igor'}
    ];
    filteredOptions: Observable<User[]>;

  ngOnInit() {
this.CreateForm();
this.avengers = 
[{ id: 1, naming: 'Captain America', city:'US' }, 
{ id: 2, naming: 'Thor' , city:'Asgard'}, 
{ id: 3, naming: 'Iron Man' , city:'New York'}
  ]
  this.filteredOptions = this.formGroup.get('myControl').valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.options.slice())
      );
      this.minDate = new Date();
  }


  CreateForm() {
    this.formGroup = this._formBuilder.group({
      'myControl':[null],
      'collegeName':[null],
      'rollNumber':[null],
      'collegeAddress':[null]

    }, {
        // validator: this.MustMatch('password', 'confirmPassword'),
      });
  }
  displayFn(user: User): string {
    return user && user.name ? user.name : '';
  }
  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }
}

