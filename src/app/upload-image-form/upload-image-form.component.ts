import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms/forms';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';

import { Image } from '../image';
import { User } from '../user';
import { ImageService } from '../image.service';


@Component({
  selector: 'app-upload-image-form',
  templateUrl: './upload-image-form.component.html',
  styleUrls: ['./upload-image-form.component.css']
})
export class UploadImageFormComponent implements OnInit {

  @Input() user: User;  // this value comes from parent component user-detail's tempolate
  private file: File;
  private formData: FormData = new FormData();
  private imageForm: FormGroup;
  private submitted = false;
  private imageUrl = 'http://192.168.201.211:8024/images/';
  private password: string;

  constructor(
    private imageService: ImageService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    console.log(this.user);
     this.createFrom(this.user);  // create form here, so we can get this.user's value
  }
  
  createFrom(user: User) {
    // Put file field in this form for resetting its value
    this.imageForm = this.fb.group({
      id: 1,
      created: '20170825',
      userId: user.id,
      fileUrl: 'http://images.fineartamerica.com/images-medium-large-5/mt-shuksan-picture-lake-dennis-romano.jpg',
      owner: user.username,
      des: '',
      pw: '',
      localImage: '',
    })
    console.log(user);
  }

  // https://stackoverflow.com/a/41465502/2803344
  // get a file object from form input
  onChange(event: EventTarget) {
    let eventObj: MSInputMethodContext = <MSInputMethodContext> event;
    let target: HTMLInputElement = <HTMLInputElement> eventObj.target;
    let files: FileList = target.files;
    this.file = files[0];
  }
  
  onSubmit() {
    // deal with string fields and file separately
    this.submitted = true;
    console.log(this.file);  // file is here
    console.log(this.imageForm.value);  // other fields are here
    
    for (let item in this.imageForm.value) {
      console.log(item)
      if (item === "pw") {
        this.password = this.imageForm.value[item];  // password
      }
      else if (item === 'localImage') {
        this.formData.append('localImage', this.file, this.file.name);  // file
      }
      else {
        this.formData.append(item, this.imageForm.value[item]);  // other fields
      }
      
    }
    
    // console.log('###here is the total form data');
    console.log(this.formData);
    console.log(this.formData.get('fileUrl'));
    console.log(this.user.username);
    this.imageService.post(this.formData, this.user.username, this.password)
                     .then(res =>{
                       console.log(res);
                     });
  }
  
  // reset formGroup
  onClick(form: FormGroup) {
    form.reset({
      userId: this.user.id,
      owner: this.user.username,
      created: '20170825',
      fileUrl: 'http://www.fujifilm.com.sg/Products/digital_cameras/x/fujifilm_x_t1/sample_images/img/index/ff_x_t1_001.JPG',
    });
    this.formData = new FormData();
    this.submitted=false;
    console.log(form.value);
  }
  
}
