import { Injectable } from '@angular/core';
import { contacts } from "../data/contacts";
import { Observable, of, delay, ReplaySubject } from 'rxjs';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor() { }

  private _selectedUsers = new ReplaySubject<UserModel[]>(1);
  selectedUsers$ = this._selectedUsers.asObservable();

  private _deletedUser = new ReplaySubject<UserModel>(1);
  deletedUser$ = this._deletedUser.asObservable();

  private _externalUser = new ReplaySubject<string | null>(1);
  externalUser$ = this._externalUser.asObservable();

  getUsers(): Observable<UserModel[]> {
    let items = contacts;
    return of(items).pipe(delay(500));
  }

  getUsersByGroup(users: UserModel[]): {[key: string]: UserModel[]} {
    const groups: {[key: string]: UserModel[]} = {}
    groups['Other'] = []
    users?.forEach((user: UserModel) => {
      if(!user.groups) groups['Other'].push(user);
      user.groups?.forEach((group: string) => {
        if(!groups[group]){
          groups[group] = []
        }
        groups[group].push({...user});
      });
    });

    return groups;
  }

  getGroups(users: UserModel[]): string[] {
    const groups: string[] = []

    users.forEach((user: UserModel) => {
      user.groups?.forEach((group: string) => {
        const index = groups.indexOf(group);
        if(index === -1)
          groups.push(group);
      });
    });
    groups.push('Other')

    return groups;
  }

  setSelectedUsers(users: UserModel[]){
    this._selectedUsers.next(users)
  }

  setDeleteUser(user: UserModel){
    this._deletedUser.next(user);
  }

  setExternalUser(user: string){
    this._externalUser.next(user);
  }

  cleanObservables() {
    this._selectedUsers.next([]);
    this._deletedUser.next({} as UserModel);
    this._externalUser.next(null)
  }
}
