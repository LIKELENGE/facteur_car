import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Tournee as TourneeService } from '../../services/tournee';

@Component({
  selector: 'app-tournees',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './tournees.html',
  styleUrl: './tournees.css',
})
export class Tournees implements OnInit {
  private tourneeService = inject(TourneeService);
  private cdr = inject(ChangeDetectorRef);

  tournees: any[] = [];
  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadTournees();
  }

  async loadTournees(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    try {
      const data = await this.tourneeService.getConduitesCompletes();

      console.log('Tournées reçues :', data);

      this.tournees = data;
    } catch (error) {
      console.error('Erreur chargement tournées :', error);

      const message = error instanceof Error ? error.message : String(error);

      if (message.includes('Not running in Electron environment')) {
        this.errorMessage =
          "L'application doit être lancée via Electron : exécutez `npm start` depuis le dossier `facteur-car`.";
      } else {
        this.errorMessage = 'Impossible de charger les tournées.';
      }
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async deleteTournee(idConduire: number): Promise<void> {
    if (!confirm('Voulez-vous vraiment supprimer cette tournée ?')) {
      return;
    }

    try {
      await this.tourneeService.deleteConduire(idConduire);

      this.tournees = this.tournees.filter(
        tournee => tournee.idConduire !== idConduire
      );

      this.cdr.detectChanges();
    } catch (error) {
      console.error('Erreur suppression tournée :', error);

      this.errorMessage =
        'Impossible de supprimer la tournée. Elle est peut-être liée à des dégâts.';

      this.cdr.detectChanges();
    }
  }
}
