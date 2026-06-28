import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import type { Facteur as FacteurType } from '../../../../types/electron';
import { FacteurService } from '../../services/facteur';

@Component({
  selector: 'app-facteur',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './facteur.html',
  styleUrl: './facteur.css',
})
export class FacteurComponent {
  private facteurService = inject(FacteurService);

  facteur: FacteurType | null = null;

  formFacteur = {
    nom: '',
    prenom: '',
    dateNaiss: '',
    telephone: '',
    mail: '',
    dateObtentionPermisB: '',
    sexe: '',
  };

  enregistrerFacteur() {
    const data = {
      nom: this.formFacteur.nom,
      prenom: this.formFacteur.prenom,
      dateNaiss: new Date(this.formFacteur.dateNaiss),
      telephone: this.formFacteur.telephone,
      mail: this.formFacteur.mail,
      dateObtentionPermisB: new Date(this.formFacteur.dateObtentionPermisB),
      sexe: this.formFacteur.sexe,
    };

    if (this.facteur) {
      this.facteurService.updateFacteur(this.facteur.idFacteur, data);
    } else {
      this.facteurService.addFacteur(data);
    }

    this.resetForm();
  }

  modifierFacteur(facteur: FacteurType) {
    this.facteur = facteur;

    this.formFacteur = {
      nom: facteur.nom,
      prenom: facteur.prenom,
      dateNaiss: this.formatDate(facteur.dateNaiss),
      telephone: facteur.telephone,
      mail: facteur.mail,
      dateObtentionPermisB: this.formatDate(facteur.dateObtentionPermisB),
      sexe: facteur.sexe,
    };
  }

  resetForm() {
    this.facteur = null;

    this.formFacteur = {
      nom: '',
      prenom: '',
      dateNaiss: '',
      telephone: '',
      mail: '',
      dateObtentionPermisB: '',
      sexe: '',
    };
  }

  private formatDate(date: Date | string): string {
    return new Date(date).toISOString().split('T')[0];
  }
}
