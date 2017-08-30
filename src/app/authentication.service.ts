import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthenticationService {
  public token: string;
  private url = 'http://192.168.201.211:8024/api-token-auth/';
  private options: RequestOptions;
  private currentUser: any;

  constructor(private http: Http) {
    // set token if saved in local storage
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = this.currentUser && this.currentUser.token;
    let headers = new Headers({ 'Content-Type': 'application/json' });
    this.options = new RequestOptions({ headers: headers });
   }

  login(username: string, password: string): Observable<boolean> {
    return this.http.post(this.url, JSON.stringify({ username: username, password: password }), this.options)
        .map((response: Response) => {
            // login successful if there's a jwt token in the response
            let token = response.json() && response.json().token;
            if (token) {
                // set token property
                this.token = token;

                // store username and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify({ username: username, token: token }));

                // return true to indicate successful login
                return true;
            } else {
                // return false to indicate failed login
                return false;
            }
        });
  }

  logout(): void {
    // clear token remove user from local storage to log user out
    this.token = null;
    localStorage.removeItem('currentUser');
  }

  getCurrentUser() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return this.currentUser;
  }
}
