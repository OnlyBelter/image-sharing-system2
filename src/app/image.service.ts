import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from "@angular/http";

import 'rxjs/add/operator/toPromise';

import { Image } from "./image";
import { User } from './user';

@Injectable()
export class ImageService {

  private imageUrl = 'http://192.168.201.211:8024/images/';
  //set headers for authorization, https://stackoverflow.com/a/34465070/2803344
  createAuthorizationHeader(headers: Headers, name: string, pw: string) {
    headers.append('Authorization', 'Basic ' +
      btoa(`${name}:${pw}`)); 
  }

  createOptions(name: string, pw: string) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers, name, pw);
    // headers.append('Content-Type', 'application/json');  // without this
    // headers.append('Content-Type', 'multipart/form-data');  // without this
    let options = new RequestOptions({ headers: headers });
    return options;
  }

  constructor(private http: Http) { }

  getImageById(id: number): Promise<Image> {
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
    return this.http.get(url)
                    .toPromise()
                    .then(res => res.json() as Image)
                    // .then(res => console.log(res))
                    .catch(this.handleError);
  }

  post(formData: FormData, user: string, pw: string): Promise<Image> {
    let options = this.createOptions(user, pw);
    console.log('we will have a post!');
    console.log(formData.get('localImage'));
    console.log(formData.get('fileUrl'));
    console.log(formData.get('des'));
    return this.http.post(this.imageUrl, formData, options)
                    .toPromise()
                    .then(res => res.json() as Image)
                    .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
