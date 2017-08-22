import { Component, OnInit, Input } from '@angular/core';
import { Image } from '../image';
import { User } from '../user';
import { ImageService } from '../image.service';


@Component({
  selector: 'app-upload-image-form',
  templateUrl: './upload-image-form.component.html',
  styleUrls: ['./upload-image-form.component.css']
})
export class UploadImageFormComponent implements OnInit {

 @Input() user: User;  // this value comes from component user-detail's tempolate
  constructor(
    private imageService: ImageService,
  ) { }
  model: Image;
  ngOnInit() {
    console.log(this.user);
    this.model = new Image(50, '20170822', this.user.id,  
    'https://upload.wikimedia.org/wikipedia/commons/5/58/PikiWiki_Israel_16825_akko_from_the_sea_panoramic_picture.JPG',
     this.user.username);
  }

  // model = new Image(50, '20170822', '20', '', '', 'Tornado');
  
  submitted = false;

  newImage() {
    this.model = new Image(50, '20170823', this.user.id,  'f0099', this.user.username);
  }
  
  onSubmit() {
    this.submitted = true;
    let formData = JSON.stringify(this.model);
    this.imageService.post(formData);
    console.log(formData);
  }
  
  // TODO: Remove this when we're done
  // get diagnostic() { return JSON.stringify(this.model); }  

}
