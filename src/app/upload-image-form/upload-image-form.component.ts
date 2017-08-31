import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms/forms';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';

import { Image } from '../image';
import { User } from '../user';
import { ImageService } from '../image.service';
import { AuthenticationService } from '../authentication.service';

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
  private token: string;
  private uploadSuccess: boolean = false;
  private tokenVaild: boolean = true;
  private tokenErrorMessage: string = 'Login is expire, please login again.';

  constructor(
    private imageService: ImageService,
    private authService: AuthenticationService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    console.log(this.user);
    let loginUser = this.getLoginUser();
    this.token = loginUser['token'];
    console.log(this.token);
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
    this.uploadSuccess = false;
    console.log(this.file);  // file is here
    console.log(this.imageForm.value);  // other fields are here
    
    for (let item in this.imageForm.value) {
      console.log(item)
      if (item === 'localImage') {
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
    // 返回的是一个promise, 属于异步数据，无法立即得到
    this.authService.tokenVerify().then(data => {
      this.tokenVaild = data;
    });
    // console.log(loginValid);
    setTimeout(() => {
      if (this.tokenVaild) {
        this.imageService.post(this.formData, this.user.username, this.token)
        .then(res =>{
          console.log(res);
          this.uploadSuccess = true;
        });
      }
    }, 200)

  }
  
  // reset formGroup
  onClick(form: FormGroup) {
    form.reset({
      userId: this.user.id,
      owner: this.user.username,
      fileUrl: 'http://www.fujifilm.com.sg/Products/digital_cameras/x/fujifilm_x_t1/sample_images/img/index/ff_x_t1_001.JPG',
    });
    this.formData = new FormData();
    this.submitted=false;
    console.log(form.value);
  }

  getLoginUser() {
    return this.authService.getCurrentUser();
  }
  
}
