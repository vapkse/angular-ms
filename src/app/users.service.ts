import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JsonProperty, ObjectMapper } from 'json-object-mapper';
import { map, Observable } from 'rxjs';

export class UserBase {
    public id?: number = void 0;
    public firstName?: string = void 0;
    public lastName?: string = void 0;
}

export class Hair {
    public color?: string = void 0;
    public type?: string = void 0;
}

export class Coordinates {
    public lat?: number = void 0;
    public lng?: number = void 0;
}

export class Address {
    @JsonProperty({ type: Coordinates })
    public coordinates?: Coordinates = void 0;

    public address?: string = void 0;
    public city?: string = void 0;
    public postalCode?: string = void 0;
    public state?: string = void 0;
}

export class Bank {
    public cardExpire?: string = void 0;
    public cardNumber?: string = void 0;
    public cardType?: string = void 0;
    public currency?: string = void 0;
    public iban?: string = void 0;
}

export class Company {
    @JsonProperty({ type: Address })
    public address?: Address = void 0;

    public department?: string = void 0;
    public name?: string = void 0;
    public title?: string = void 0;
}

export class User extends UserBase {
    @JsonProperty({ type: Hair })
    public hair?: Hair = void 0;

    @JsonProperty({ type: Address })
    public address?: Address = void 0;

    @JsonProperty({ type: Bank })
    public bank?: Bank = void 0;

    @JsonProperty({ type: Company })
    public company?: Company = void 0;

    public maidenName?: string = void 0;
    public age?: number = void 0;
    public gender?: string = void 0;
    public email?: string = void 0;
    public phone?: string = void 0;
    public username?: string = void 0;
    public password?: string = void 0;
    public birthDate?: string = void 0;
    public image?: string = void 0;
    public bloodGroup?: string = void 0;
    public height?: number = void 0;
    public weight?: number = void 0;
    public eyeColor?: string = void 0;
    public domain?: string = void 0;
    public ip?: string = void 0;
    public macAddress?: string = void 0;
    public university?: string = void 0;
    public ein?: string = void 0;
    public ssn?: string = void 0;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {

    public constructor(private httpClient: HttpClient) { }

    public getUsers$(): Observable<ReadonlyArray<UserBase>> {
        return this.httpClient.get<{ users: Array<Record<string, unknown>> }>('https://dummyjson.com/users').pipe(
            map(json => json ? ObjectMapper.deserializeArray(UserBase, json.users) : new Array<UserBase>())
        );
    }

    public getUser$(id: number): Observable<User | undefined> {
        return this.httpClient.get<{ users: Array<Record<string, unknown>> }>(`https://dummyjson.com/users/${id}`).pipe(
            map(json => json ? ObjectMapper.deserialize(User, json) : undefined)
        );
    }
}


