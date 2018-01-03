import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../_service/index';
import { User } from '../../_data_model/index';

@Component({
  selector: 'app-add-user-form',
  templateUrl: './add-user-form.component.html',
  styleUrls: ['./add-user-form.component.css']
})
export class AddUserFormComponent implements OnInit {

  @Input() users: User[];  // 添加一个尚未初始化的users属性
  @Input() selectedUser;
  constructor(
    private userService: UserService,
  ) { }

  ngOnInit() {
  }

    // 当点击事件触发时，我们调用组件的点击处理器，然后清空这个输入框，以便用来输入另一个名字。
    add(name: string): void {
      name = name.trim();
      if (!name) { return; }
      this.userService.create(name)
          .then(res => {  // 将返回的User对象添加到users属性中
            console.log(res);
            this.users.push(res);  // 直接使用push方法，不用刷新页面就可以直接更新列表
            this.selectedUser = null;
          });
    }

}
