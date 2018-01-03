import { Component, OnInit } from '@angular/core';


import { User } from '../../_data_model/index';
import { UserService } from '../../_service/index';

import { Router } from '@angular/router';  // 需要导航的component都会用到这个模块

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})


export class UsersComponent implements OnInit {

  users: User[];  // 添加一个尚未初始化的users属性
  selectedUser: User;
  
  newUser: User = {url: '', id: 0, username: 'Alpha', images: []};
  // the constructor itself does nothing, the parameter simultaneously deinfes 
  // a private userService property and identifies it as a UserService injection
  // 相当于python class中的__init__(...)
  constructor(
    private userService: UserService,
    private router: Router  // 在构造函数中注入Router
  ) { }

  ngOnInit(): void {
    this.getUsers();
    // console.log(this.users);
    // test getUsersSlowly
    // console.log(this.userService.getUsersSlowly().then(res => console.log(res)));
    // console.log(this.userService.getUsersByHttp().then(res => console.log('here is by http' + res)));
  }

  onSelect(user: User): void {
    // 被选中的user被当做参数传给了this.selectedUser，确定selectedUser后，
    // 可以设置该值的class，并且利用属性绑定，将该变量的值传递给了另一个组件user-detail
    this.selectedUser = user;
  }

  getUsers(): void {
    // res是UserService返回的User数组，作为参数传递并赋值给组件的users属性
    // 使用.then(res => console.log(res))可以将res打印到终端
    this.userService.getUsersByHttp()
                    .then(res => this.users = res.slice(1));
                    // .then(res => console.log(res));
  }
  
  // 用于导航
  gotoDetail(): void {
    this.router.navigate(['/detail', this.selectedUser.id]);
  }


  delete(user: User): void {
    this.userService
        .delete(user.id)
        .then(() => {  // 返回值为空
          this.users = this.users.filter(h => h !== user);
          if (this.selectedUser === user) { this.selectedUser = null }; // 删除后，取消选择 
          // console.log(res);

        })
  }

  // 构造函数中依赖注入的提供商
  // providers: [UserService];
}