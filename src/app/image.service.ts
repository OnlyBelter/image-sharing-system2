import { Injectable } from '@angular/core';
import { Headers, Http } from "@angular/http";

import 'rxjs/add/operator/toPromise';

// import { USERS } from './mock-users';
import { Image } from "./image";
import { User } from './user';

@Injectable()
export class ImageService {

  // private imageUrl = 'https://httpbin.org/get';
  private imageUrl = 'http://192.168.201.211:8024/images';
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

  getImageByUrl(url: string): Promise<Image> {
    // const url = `${this.imageUrl}/${id}`;
    // const url = `${this.imageUrl}`;
    console.log(url);
    console.log('this place does not need a head');
    // let headers = new Headers();
    // let token = 'token';
    // headers.append('X-Auth-Token', token);
    return this.http.get(url)
                    .toPromise()
                    .then(res => res.json() as Image)
                    // .then(res => console.log(res))
                    .catch(this.handleError);
  }

  private headers = new Headers({'Content-Type': 'application/json'});
  post(formData: String): void {
    this.http.post(this.imageUrl, JSON.stringify({formData}), {headers: this.headers})
    .toPromise()
    .then(res => res.json().data)
    .catch(this.handleError);
    console.log('have a post!')
  }


  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
