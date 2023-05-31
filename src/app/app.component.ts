import { Component, OnInit } from '@angular/core';
import { UsersService } from './services/users.service';
import { UserModel } from './models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  contacts!: UserModel[];

  constructor(private userService: UsersService) {}

  ngOnInit(){
    this.userService.getUsers().subscribe((users: UserModel[]) => {
      this.contacts = users;
    })
  }
}
