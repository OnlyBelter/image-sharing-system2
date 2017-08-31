import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import 'rxjs/add/operator/switchMap';
import { User } from '../user';
import { UserService } from '../user.service';
import { ImageService } from '../image.service';
import { Image } from '../image';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})

export class UserDetailComponent implements OnInit {
  @Input() user: User;  // current page belonger
  images: Image[] = [];
  imagesUrl: Object = {};
  localImages: Object = {};
  imagesId: number[] = [];
  imagesLoadStatus: Object = {};
  loginUser: any;  // current login user
  canEdit: boolean = false;
  password: string = '';
  intervalId: any;
  loginValid: boolean = false;
  tokenErrorMessage: string = 'Login is expire, please login again.';

  constructor(
    private userService: UserService,
    private imageService: ImageService,
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private location: Location
  ) {
    console.log(route);
   }
  
  // 在ngOnInit()生命周期钩子中，我们从ActivatedRoute服务的可观察对象params中提取id参数， 
  // 并且使用userService来获取具有这个id的用户数据
  // user的id是数字，而路由参数的值总是字符串。 所以我们需要通过 JavaScript 的 (+) 操作符把路由参数的值转成数字。
  ngOnInit() {
    this.route.params
        .switchMap((params: Params) => this.userService.getUserByHttp(+params['id']))
        .subscribe(rep => this.user = rep);

    setTimeout(() => {
      console.log(this.user);
      if (this.user.images) {
        // console.log('print images');
        // console.log(this.user.images);
        this.user.images.forEach(ele => this.getImage(ele).then(res => {
          console.log(res);
          // let imgId = res.id;
          this.images.push(res);
          this.imagesId.push(res.id);
          this.imagesId.sort(function(a: number, b: number) {
            if (a > b) {
              return 1;
            }
            if (a < b) {
              return -1;
            }
            if (a === b) {
              return 0;
            }
          });
          // console.log(this.imagesId);
          if (res.localImage) {
            this.imagesUrl[res.id] = res.localImage;
          }
          else {
            this.imagesUrl[res.id] = res.fileUrl;
          }
          this.imagesLoadStatus[res.id] = 0;
        }));
      }
      console.log('images');
      console.log(this.imagesUrl);
      console.log(this.imagesId);
      
    }, 1000);

    // example for asyn
    if (this.user) {
      console.log(this.user);
      console.log('love');
    }
    console.log('you');

    // always watch out login user
    this.intervalId = setInterval(() => this.checkUserMatch(), 2000);
    // setInterval(this.checkUserMatch.bind(this), 5000);
  }

  // https://stackoverflow.com/a/37116635/2803344
  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  goBack(): void {
    console.log(this.location);
    // 回退太多步会跑出我们的应用。 在真实的应用中，我们需要使用CanDeactivate守卫对此进行防范。
    this.location.back();
  }

  save(): void {
    this.userService.update(this.user)
        .then(() => this.goBack());
  }

  getImage(url: string): Promise<Image> {
    // console.log(url + 'ssssssddffggh');
    return this.imageService.getImageByUrl(url);
  }

  test2(): User {
    return this.user;
  }

  loadOk(id: number) {
    this.imagesLoadStatus[id] = 1;
  }

  loadError() {
    console.log('error');
  }

  deleteImage(image: Image): void {
    let user = this.user.username;
    let token = this.loginUser.token;
    this.imageService
        .deleteImage(image.id, user, token);
  }

  //  check if current login user can edit this page
  checkUserMatch() {
    console.log('here is checkUserMatch');
    console.log(this.user.username);
    this.loginUser = this.authService.getCurrentUser();
    // this.loginValid = false;
    if (this.loginUser) {
      setTimeout(() => {
        this.authService.tokenVerify()
            .then(data => {
              this.loginValid = data;
            })
      }, 200);
      if (this.loginValid) {
        if (this.user.username === this.loginUser.username) {
          this.canEdit = true;
        }
        else {
          this.canEdit = false;
        }
      }
    }
    else {
      this.canEdit = false;
    }
    console.log(this.canEdit);
  }
}
