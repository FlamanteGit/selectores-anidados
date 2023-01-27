import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, map, Observable, of, switchMap } from 'rxjs';
import { Pais, PaisSmall } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root',
})
export class PaisesService {
  private _baseUrl: string = 'https://restcountries.com/v3.1';

  private _regiones: string[] = [
    'Africa',
    'Americas',
    'Asia',
    'Europe',
    'Oceania',
  ];

  get regiones(): string[] {
    return [...this._regiones];
  }

  constructor(private http: HttpClient) {}

  getPaisesPorRegion(region: string): Observable<PaisSmall[]> {
    if (!region) {
      return of([]);
    }
    const url = `${this._baseUrl}/region/${region}?fields=cca3,name`;
    console.log(url);
    return this.http.get<PaisSmall[]>(url);
  }

  getPaisPorCodigo(codigo: string): Observable<Pais> {
    if (!codigo) {
      return of();
    }
    const url = `${this._baseUrl}/alpha/${codigo}`;
    return this.http
      .get<Pais[]>(url)
      .pipe(switchMap((pais) => of(pais.pop()!)));
  }

  getPaisPorCodigoSmall(codigo: string): Observable<PaisSmall> {
    if (!codigo) {
      return of();
    }
    const url = `${this._baseUrl}/alpha/${codigo}?fields=cca3,name`;
    console.log(url);
    return this.http.get<PaisSmall>(url)
  }

  getPaisesPorCodigos(borders: string[]): Observable<PaisSmall[]> {
    if (!borders) {
      return of([]);
    }

    const peticiones: Observable<PaisSmall>[] = [];

    borders.forEach((codigo) => {
      const peticion = this.getPaisPorCodigoSmall(codigo);
      peticiones.push(peticion);
    });

    return combineLatest(peticiones);
  }
}
