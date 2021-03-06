import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { UserDetailComponent, UsersComponent, DashboardComponent,
         UserSearchComponent, UploadImageFormComponent, AddUserFormComponent,
         LogInComponent } from './_component/index';
import { UserService, ImageService,
         AuthenticationService, UserSearchService } from "./_service/index";


import { AppRoutingModule } from './app-routing/app-routing.module';

// 模拟（Mock）服务（内存Web API）来获取和保存数据
// import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
// import { InMemoryDataService } from './in-memory-data.service';


@NgModule({
  declarations: [
    AppComponent,
    UserDetailComponent,
    UsersComponent,
    DashboardComponent,
    UserSearchComponent,
    UploadImageFormComponent,
    AddUserFormComponent,
    LogInComponent
  ],
  
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    // InMemoryWebApiModule.forRoot(InMemoryDataService),
    // RouterModule.forRoot(appRoutes),
    AppRoutingModule, 
  ],
  providers: [UserService, ImageService, 
              AuthenticationService, UserSearchService], // 所有的服务必须在这里注册
  bootstrap: [AppComponent]
})
export class AppModule { }
