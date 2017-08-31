import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';

@Injectable()
export class AuthenticationService {
  public token: string;
  private url_auth = 'http://192.168.201.211:8024/api-token-auth/';
  private url_verify = 'http://192.168.201.211:8024/api-token-verify/';
  private url_refresh = 'http://192.168.201.211:8024/api-token-refresh/';
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
    return this.http.post(this.url_auth, JSON.stringify({ username: username, password: password }), this.options)
        .timeout(5000)
        .map((response: Response) => {
            // login successful if there's a jwt token in the response
            let token = response.json() && response.json().token;
            console.log('here is token, 15:57');
            console.log(token);
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

  getCurrentUser(): Observable<any> {
    console.log('i am in getCurrentUser');
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log(this.currentUser);
    return this.currentUser;
    
  }

  tokenVerify(): Promise<boolean> {
    return this.http.post(this.url_verify, JSON.stringify({'token': this.token}), this.options)
            .toPromise()
            .then((response: Response) => {
              console.log(response);
              if (response.status === 200) {
                return true;
              }
              else {
                return false;
              }
            })
            .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    // return Promise.reject(error.message || error);
    return Observable.of(false).toPromise();
  }
}
