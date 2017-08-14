import { Injectable } from '@angular/core';
import { Headers, Http } from "@angular/http";

import 'rxjs/add/operator/toPromise';

// import { USERS } from './mock-users';
import { Image } from "./image";
import { User } from './user';

@Injectable()
export class ImageService {

  private imageUrl = 'https://httpbin.org/get';
  // private imageUrl = '/api/images';
  constructor(private http: Http) { }

  getImageById(id: number): Promise<Image> {
    // const url = `${this.imageUrl}/${id}`;
    const url = `${this.imageUrl}`;
    console.log(url);
    let headers = new Headers();
    let token = 'token';
    headers.append('X-Auth-Token', token);
    return this.http.get(url, {headers: headers})
                    .toPromise()
                    // .then(res => res.json().data as Image)
                    .then(res => console.log(res))
                    .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
