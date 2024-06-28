import { Injectable } from '@angular/core';
import { RoleEnum } from '../models/userEnums.model';
import { StatusEnum} from '../models/userEnums.model';
import { User } from '../models/user.model';

@Injectable()
export class UserServiceMock {
  constructor() { }

  getUsers(): Array<User> {
      return [
          {
              firstName: 'user1',
              lastName: 'usersurname1',
              username: 'testuser',
              password: 'password1',
              role: RoleEnum.GUEST,
              address: 'address1',
              phoneNumber: '123456789',
              status: StatusEnum.ACTIVE,
              reservationRequestNotification: true,
              reservationCancellationNotification: false,
              ownerRatingNotification: true,
              accommodationRatingNotification: false,
              ownerRepliedToRequestNotification: true,
              deleted: false,
              token: 'token1',
              jwt: 'jwt1',
              favouriteAccommodations: 'acc1,acc2'
          }
      ];
  }
}
