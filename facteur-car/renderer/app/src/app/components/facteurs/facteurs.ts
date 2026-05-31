import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { Facteur } from '../../../../types/electron';
import { FacteurService } from '../../services/facteur';

@Component({
  selector: 'app-facteurs',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './facteurs.html',
  styleUrl: './facteurs.css',
})
export class Facteurs implements OnInit {
  facteurs: Facteur[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private facteurService: FacteurService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadFacteurs();
  }

  async loadFacteurs(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    try {
      const data = await this.facteurService.getFacteurs();
      this.facteurs = data;
    } catch (error) {
      console.error('Erreur chargement facteurs :', error);

      const message = error instanceof Error ? error.message : String(error);

      if (message.includes('Not running in Electron environment')) {
        this.errorMessage =
          "L'application doit être lancée via Electron : exécutez `npm start` depuis le dossier `facteur-car`.";
      } else {
        this.errorMessage = 'Impossible de charger les facteurs.';
      }
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async deleteFacteur(idFacteur: number): Promise<void> {
    if (!confirm('Voulez-vous vraiment supprimer ce facteur ?')) {
      return;
    }

    try {
      await this.facteurService.deleteFacteur(idFacteur);

      this.facteurs = this.facteurs.filter(
        facteur => facteur.idFacteur !== idFacteur
      );

      this.cdr.detectChanges();
    } catch (error) {
      console.error('Erreur suppression facteur :', error);

      this.errorMessage =
        'Impossible de supprimer le facteur. Il est peut-être lié à une intervention ou une conduite.';

      this.cdr.detectChanges();
    }
  }
}
