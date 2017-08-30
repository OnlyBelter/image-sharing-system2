import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {
  public model: any = {};
  loading = false;
  error = '';
  private currentUser: any;
  userName: string = '';
  private online:boolean = false;


  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.model = {
      username: 'null',
      password: ''
    }
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.userName = this.currentUser.username;
      this.online = true;
    }
  }

  login() {
    this.loading = true;
    this.authService.login(this.model.username, this.model.password)
        .subscribe(result => {
            if (result === true) {
                this.router.navigate(['/']);
                this.online = true;
                this.loading = false;
                // console.log(this.currentUser);
            } else {
                this.error = 'Username or password is incorrect';
                this.loading = false;
            }
        });
    // 登陆后无法立即得到currentUser，延迟200ms后执行
    setTimeout(() => {
      this.currentUser = this.authService.getCurrentUser();
      this.userName = this.currentUser.username;
      console.log(this.currentUser);
    }, 200);
}

logout() {
  console.log('I am here');
  this.authService.logout();
  this.currentUser = this.authService.getCurrentUser();
  this.userName = '';
  console.log(this.currentUser);
  this.online = false;
}


}
