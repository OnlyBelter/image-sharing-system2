import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { User } from './user';

@Injectable()
export class UserSearchService {

  // private usersUrl = 'http://localhost:8000/users'; 
  private usersUrl = 'http://192.168.201.211:8024/users';
  constructor(private http: Http) { }

  //set headers for authorization, https://stackoverflow.com/a/34465070/2803344
  createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', 'Basic ' +
      btoa('belter:password123')); 
  }
 
  search(term: string): Observable<User[]> {
  // search(term: string): Promise<User[]> {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    let options = new RequestOptions({ headers: headers });
    let url = this.usersUrl + '?format=json&' + `username=${term}`;
    console.log(url);
    return this.http.get(url, options)  // 查询字符串
                    //  .toPromise()
                    //  .then(res => console.log(res.json()))
                    //  .catch(this.handleError);

              .map(res => res.json().results as User[]);  // 链式RxJS操作可以让我们简单、易读的处理响应数据
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
