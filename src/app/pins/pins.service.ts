import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {Pin} from './pin.model';
import {HttpClient} from "@angular/common/http";
import {map, switchMap, take, tap} from "rxjs/operators";
import {BehaviorSubject, Subscription} from "rxjs";
import {AuthService} from "../auth/auth.service";

interface PinData {
  author: string,
  text: string,
  imageUrl: string,
  userId: string,
  savedBy: string[],
  likedBy: string[]
}

@Injectable({
  providedIn: 'root'
})
export class PinsService implements OnInit, OnDestroy{

  private _pins = new BehaviorSubject<Pin[]>([]);
  private _usersPins = new BehaviorSubject<Pin[]>([]);
  private _saved = new BehaviorSubject<Pin[]>([]);
  private _favorites = new BehaviorSubject<Pin[]>([]);

  private userSub: Subscription;
  private UID: string;

  constructor(private http: HttpClient, private authService: AuthService) { }

  ngOnInit(){
    this.userSub = this.authService.userId.subscribe(id => this.UID = id);
  }

  ngOnDestroy(){
    if(this.userSub){
      this.userSub.unsubscribe();
    }
  }

  get pins() {
    return this._pins.asObservable();
  }

  get usersPins() {
    return this._usersPins.asObservable();
  }

  get favoritePins() {
    return this._favorites.asObservable();
  }

  get saved() {
    return this._saved.asObservable();
  }

  addPin(author: string, description: string, url: string,savedBy: string[], likedBy: string[]) {
    let generatedId;
    let newPin: Pin;
    let fetchedUserId: string;

    return this.authService.userId.pipe(take(1),
      switchMap(userId => {
        fetchedUserId = userId;
        return this.authService.token;
      }),
      take(1),
      switchMap((token) => {
        newPin = new Pin(null, author, description, url, fetchedUserId, savedBy, likedBy);
        return this.http.post<{name: string}>(`https://pin-app-3d333-default-rtdb.europe-west1.firebasedatabase.app/pins.json?auth=${token}`, newPin);
      }),
      take(1),
      switchMap((resData) => {
        generatedId = resData.name;
        return this.pins;
      }),
      take(1),
      tap((pins) => {
        newPin.id = generatedId;
        this._usersPins.next(pins.concat(newPin).filter(p => p.userId === newPin.userId));
        this._pins.next(pins.concat(newPin));
      })
      );
  }

  deletePin(id: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.delete(
          `https://pin-app-3d333-default-rtdb.europe-west1.firebasedatabase.app/pins/${id}.json?auth=${token}`
        );
      }),
      switchMap(() => {
        return this.pins;
      }),
      take(1),
      tap((pins) => {
        this._usersPins.next(pins.filter((p) => p.id !== id));
        this._pins.next(pins.filter((p) => p.id !== id));
      })
    );
  }

  editPin(id: string, author: string, text: string, imageUrl: string, userId: string, savedBy: string[], likedBy: string[]) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.put(
          `https://pin-app-3d333-default-rtdb.europe-west1.firebasedatabase.app/pins/${id}.json?auth=${token}`,
          {
            author,
            text,
            imageUrl,
            userId,
            savedBy,
            likedBy
          }
        );
      }),
      switchMap(() => {
        return this.pins;
      }),
      take(1),
      tap((pins) => {
        const updatedPinIndex = pins.findIndex((p) => p.id === id);
        const updatedPins = [...pins];
        updatedPins[updatedPinIndex] = new Pin(
          id,
          author,
          text,
          imageUrl,
          userId,
          savedBy,
          likedBy
        );
        this._pins.next(updatedPins);
      })
    );
  }

  getPins() {

    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.
        get<{[key: string]: PinData}>(`https://pin-app-3d333-default-rtdb.europe-west1.firebasedatabase.app/pins.json?auth=${token}`);
      }),
      map((pinsData) => {
        const pins: Pin[] = [];
        for (const key in pinsData) {
          if(pinsData.hasOwnProperty(key)){
            pins.push(
              new Pin(key, pinsData[key].author, pinsData[key].text, pinsData[key].imageUrl, pinsData[key].userId, pinsData[key].savedBy, pinsData[key].likedBy)
            );
          }
        }
        return pins;
      }),
      tap(pins => {
        this._pins.next(pins);
      })
    );
  }

}
