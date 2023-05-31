import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';
import { UserModel } from '../models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  contacts!: UserModel[];

  subscriptions: Subscription = new Subscription();

  constructor(private userService: UsersService) {}

  ngOnInit() {
    this.subscriptions.add(
      this.userService.getUsers().subscribe((users: UserModel[]) => {
        this.contacts = users;
      })
    );
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscriptions.unsubscribe();
  }
}
