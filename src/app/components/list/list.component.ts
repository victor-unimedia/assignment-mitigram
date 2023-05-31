import { Component, Input, OnInit } from '@angular/core';
import { UserModel } from '../../models/user.model';
import { UsersService } from 'src/app/services/users.service';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddExternalDialogComponent } from '../add-external-dialog/add-external-dialog.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  @Input()
  contacts!: UserModel[];

  groupsWithUsers!: { [key: string]: UserModel[] };
  searchGroupsWithUsers!: { [key: string]: UserModel[] };
  groups!: string[];
  isSearching: boolean = false;
  noResults: boolean = false;

  filterForm!: FormGroup<{
    searchedText: FormControl<string | null>;
  }>;

  subscriptions: Subscription = new Subscription();

  constructor(private usersService: UsersService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.groupsWithUsers = this.usersService.getUsersByGroup(this.contacts);
    this.searchGroupsWithUsers = { ...this.groupsWithUsers };
    this.groups = this.usersService.getGroups(this.contacts);
    this.initForm();
    this.subscriptions.add(
      this.usersService.deletedUser$.subscribe((user: UserModel) => {
        this.deselectAllMatchingUsers(user, false);
      })
    );
    this.subscriptions.add(
      this.filterForm.controls.searchedText.valueChanges.subscribe(
        (value: string | null) => {
          let count: number = 0;
          if (value !== '') {
            this.isSearching = true;
            this.groups.forEach((group) => {
              this.searchGroupsWithUsers[group] = this.groupsWithUsers[
                group
              ].filter(
                (user) =>
                  user.name.last.includes(value ?? '') ||
                  user.name.first.includes(value ?? '') ||
                  user.email.includes(value ?? '')
              );
              if (this.searchGroupsWithUsers[group].length === 0) count++;
            });
            this.noResults = (count === this.groups.length);
          } else {
            this.isSearching = false;
            this.searchGroupsWithUsers = { ...this.groupsWithUsers };
          }
        }
      )
    );
  }

  initForm() {
    this.filterForm = new FormGroup({
      searchedText: new FormControl(''),
    });
  }

  selectGroup(event: any, group: string) {
    this.groupsWithUsers[group].map((user) => {
      user.isSelected = event.checked;
    });
    this.buildSelectedUsers();
  }

  selectUser(event: any, group: string, user: UserModel) {
    const index = this.groupsWithUsers[group].indexOf(user);
    this.groupsWithUsers[group][index].isSelected = event.checked;
    if (!event.checked) {
      this.deselectAllMatchingUsers(user, false);
    }
    this.buildSelectedUsers();
  }

  deselectAllMatchingUsers(user: UserModel, checked: boolean) {
    Object.keys(this.groupsWithUsers).forEach((group: string) => {
      this.groupsWithUsers[group]?.map((searchedUser: UserModel) => {
        if (searchedUser._id == user._id) searchedUser.isSelected = checked;
      });
    });
    this.buildSelectedUsers();
  }

  isPartialSelected(group: string) {
    let countSelected = 0;
    this.groupsWithUsers[group].forEach((user) => {
      if (user.isSelected) countSelected++;
    });
    return (
      countSelected > 0 && countSelected < this.groupsWithUsers[group].length
    );
  }

  isAllSelected(group: string) {
    let countSelected = 0;
    this.groupsWithUsers[group].forEach((user) => {
      if (user.isSelected) countSelected++;
    });
    return (
      countSelected > 0 && countSelected === this.groupsWithUsers[group].length
    );
  }

  buildSelectedUsers() {
    const selectedUsers: UserModel[] = [];
    Object.keys(this.groupsWithUsers).forEach((group: string) => {
      this.groupsWithUsers[group]?.map((user: UserModel) => {
        if (user.isSelected) {
          const index = selectedUsers.findIndex(
            (indexUser: UserModel) => indexUser._id === user._id
          );
          if (index === -1) {
            selectedUsers.push(user);
          }
        }
      });
    });
    this.usersService.setSelectedUsers(selectedUsers);
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddExternalDialogComponent, {
      width: '400px',
    });

    this.subscriptions.add(
      dialogRef.afterClosed().subscribe((result: { email: string }) => {
        this.usersService.setExternalUser(result.email);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
