import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'perfil',
  standalone: true
})
export class PerfilPipe implements PipeTransform {
  transform(perfis: string[]): string {
    return perfis.map(perfil => {
      switch (perfil.toUpperCase()) {
        case 'ADMIN':
          return 'Admin';
        case 'MÉDICO':
          return 'Médico';
        case 'PACIENTE':
          return 'Paciente';
        default:
          return perfil;
      }
    }).join(', ');
  }
}