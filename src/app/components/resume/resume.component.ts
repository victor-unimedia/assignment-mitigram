import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserModel } from 'src/app/models/user.model';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.scss'],
})
export class ResumeComponent implements OnInit, OnDestroy {
  usersList: UserModel[] = [];
  externals: string[] = [];

  subscriptions: Subscription = new Subscription();

  constructor(
    private userService: UsersService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.userService.selectedUsers$.subscribe((users: UserModel[]) => {
        this.usersList = users;
      })
    );
    this.subscriptions.add(
      this.userService.externalUser$.subscribe((user: string | null) => {
        if (user) {
          const index = this.externals.indexOf(user);
          if (index === -1) this.externals.push(user);
        }
      })
    );
  }

  deleteUser(user: UserModel) {
    this.userService.setDeleteUser(user);
  }

  deleteExternalUser(user: string) {
    const index = this.externals.indexOf(user);
    this.externals.splice(index, 1);
  }

  sendInvitation() {
    this.snackBar.open('Invitations sent successfully', '', { duration: 5000 });
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.usersList = [];
    this.externals = [];
    this.userService.cleanObservables();
    this.subscriptions.unsubscribe();
  }
}
