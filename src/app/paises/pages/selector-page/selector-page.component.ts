import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs';
import { PaisSmall } from '../../interfaces/paises.interface';
import { PaisesService } from '../../services/paises.service';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
})
export class SelectorPageComponent implements OnInit {
  miFormulario: FormGroup = this.fb.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: ['', Validators.required],
  });

  regiones: string[] = [];
  paises: PaisSmall[] = [];
  fronteras: PaisSmall[] = [];

  cargando: boolean = false;

  constructor(private fb: FormBuilder, private paisesService: PaisesService) {}

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones.sort();

    this.miFormulario
      .get('region')
      ?.valueChanges.pipe(
        tap(() => {
          this.paises = [];
          this.miFormulario.get('pais')?.reset('');
          this.cargando = true;
        }),
        switchMap((region) => {
          if (!region) {
            this.cargando = false;
            return [];
          }
          return this.paisesService.getPaisesPorRegion(region);
        })
      )
      .subscribe((paises) => {
        this.paises = paises.sort((a, b) => (a.name.common > b.name.common) ? 1 : -1);
        this.cargando = false;
        console.log(this.paises);
      });

    this.miFormulario
      .get('pais')
      ?.valueChanges.pipe(
        tap(() => {
          this.fronteras = [];
          this.miFormulario.get('frontera')?.reset('');
          this.cargando = true;
        }),
        switchMap((codigo) => {
          if (!codigo) {
            this.cargando = false;
            return [];
          }
          return this.paisesService.getPaisPorCodigo(codigo);
        }),
        switchMap((pais) =>
          this.paisesService.getPaisesPorCodigos(pais.borders)
        )
      )
      .subscribe((paises) => {
        this.fronteras = paises.sort((a, b) => (a.name.common > b.name.common) ? 1 : -1);
        this.cargando = false;
      });
  }

  guardar() {
    console.log(this.miFormulario.value);
  }
}
