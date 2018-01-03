import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from "@angular/http";


// 有很多像toPromise这样的操作符，用于扩展Observable，为其添加有用的能力
import 'rxjs/add/operator/toPromise';

// import { USERS } from './mock-users';
import { User, userApi } from "../_data_model/index";


// 使用单独的服务可以保持组件精简，
// 使其集中精力为视图提供支持，并且，借助模拟（Mock）服务，可以更容易的对组件进行单元测试。
// 数据服务总是异步的
// 当 TypeScript 看到@Injectable()装饰器时，就会记下本服务的元数据。 
// 如果 Angular 需要往这个服务中注入其它依赖，就会使用这些元数据。
@Injectable()
export class UserService {

  // private usersUrl = 'api/users';
  private usersUrl = userApi; 
  // private usersUrl = 'http://localhost:8000/users'; 
  constructor(private http: Http) { }
  
  //set headers for authorization, https://stackoverflow.com/a/34465070/2803344
  createAuthorizationHeader(headers: Headers, name: string, pw: string) {
    headers.append('Authorization', 'Basic ' +
      btoa(`${name}:${pw}`)); 
  }

  createOptions(name: string, pw: string) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers, name, pw);
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    return options;
  }

  //UserService暴露了getUsers方法，返回跟以前一样的模拟数据，但它的消费者不需要知道这一点
  //服务是一个分离关注点，建议你把代码放到它自己的文件里
  // getUsers(): Promise<User[]> {
  //   // return USERS;  // 直接返回一个数组
  //   return Promise.resolve(USERS); // 返回一个Promise对象
  // }

  // // 延迟6s后返回
  // getUsersSlowly(): Promise<User[]> {
  //   return new Promise(resolve => setTimeout(() => resolve(USERS), 6000));
  // }

  // // 返回所有user的数据再过滤
  // getUser(id: number): Promise<User> {
  //   return this.getUsers()
  //              .then(rep => rep.find(user => user.id === id));
  // }

  //Angular 的http.get返回一个 RxJS 的Observable对象
  getUsersByHttp(): Promise<User[]> {
    // let headers = new Headers();
    // this.createAuthorizationHeader(headers);
    let options = this.createOptions('belter', 'password123');
    const url = this.usersUrl + '?format=json'   // 必须注明格式
    console.log('here is in user.service.ts', url);
    return this.http.get(url, options)
               .toPromise()
               .then(res => res.json().results as User[])
              //  .then(res => console.log(res.json().results))
               .catch(this.handleError);
  }
  
  // 来发起一个 get-by-id 请求，直接请求单个user的数据
  getUserByHttp(id: number): Promise<User> {
    // let headers = new Headers();
    // this.createAuthorizationHeader(headers);
    let options = this.createOptions('belter', 'password123');

    const url = `${this.usersUrl}${id}` + '?format=json';
    return this.http.get(url, options)
                .toPromise()
                .then(res => res.json() as User)
                .catch(this.handleError);
  }

  // 使用 HTTP 的 put() 方法来把修改持久化到服务端
  update(user: User): Promise<User> {
    let options = this.createOptions(user.username, 'password123');
    const url = `${this.usersUrl}${user.id}`;
    return this.http.put(url, JSON.stringify(user), options)
                    .toPromise()
                    .then(() => user)  // ()
                    .catch(this.handleError);
  }

  create(name: string): Promise<User> {
    let options = this.createOptions('belter', 'password123');
    const url = this.usersUrl;
    return this.http
            .post(url, JSON.stringify({username: name, password: 'password123', 
            email: 'xx@126.com', first_name: "", last_name: ""}), options)
            .toPromise()
            // 下面的.then方法对默认返回的数据进行了加工，得到了一个完整的User对象
            .then(res => res.json() as User)  
            .catch(this.handleError);
  }

  delete(id: number): Promise<void> {
    let options = this.createOptions('belter', 'password123');
    const url = `${this.usersUrl}${id}`;
    return this.http.delete(url, options)
            .toPromise()
            .then(() => null)  // 什么也不返回
            .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
  
}
