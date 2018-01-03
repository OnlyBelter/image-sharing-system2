import { Component, OnInit } from '@angular/core';

import { User } from '../../_data_model/index';
import { UserService } from '../../_service/index';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  users: User[] = [];

  constructor(private userService: UserService) { }

  ngOnInit() {
    console.log('kkkkkkkkkkkkkk');
    this.userService.getUsersByHttp()
         .then(rep => this.users = this.getTopX(rep, 4));
    //      .then(rep => this.getAllUser(rep));
  }

  // 得到分享图片最多的前x个user
  getTopX(users: User[], x: number) {
    console.log(users);
    console.log('ksksksksk')
    users.sort(function(a: User, b: User) {
        if (a.images.length > b.images.length) {
          return -1;
        }
        if (a.images.length < b.images.length) {
          return 1;
        }
        return 0;
    })
    return users.slice(0, x);
    };
}
