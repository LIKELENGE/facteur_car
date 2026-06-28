import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import type { Facteur } from '../../../../types/electron';
import { FacteurService } from '../../services/facteur';

@Component({
  selector: 'app-facteur',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './facteur.html',
  styleUrl: './facteur.css',
})
export class FacteurComponent implements OnInit {
  private facteurService = inject(FacteurService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  facteur: Facteur | null = null;

  modeModification = false;
  loading = false;
  errorMessage = '';

  formFacteur = {
    nom: '',
    prenom: '',
    dateNaiss: '',
    telephone: '',
    mail: '',
    dateObtentionPermisB: '',
    sexe: '',
  };

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.modeModification = true;

      const facteurDepuisNavigation = history.state.facteur as Facteur | undefined;

      if (facteurDepuisNavigation && facteurDepuisNavigation.idFacteur) {
        this.facteur = facteurDepuisNavigation;
        this.remplirFormulaire(facteurDepuisNavigation);
      } else {
        await this.chargerFacteurDepuisListe(Number(id));
      }
    }
  }

  async chargerFacteurDepuisListe(idFacteur: number): Promise<void> {
    this.loading = true;
    this.errorMessage = '';

    try {
      const facteurs = await this.facteurService.getFacteurs();

      const facteurTrouve = facteurs.find(
        facteur => facteur.idFacteur === idFacteur
      );

      if (!facteurTrouve) {
        this.errorMessage = 'Facteur introuvable.';
        return;
      }

      this.facteur = facteurTrouve;
      this.remplirFormulaire(facteurTrouve);
    } catch (error) {
      console.error('Erreur chargement facteur :', error);
      this.errorMessage = 'Impossible de charger le facteur.';
    } finally {
      this.loading = false;
    }
  }

  async enregistrerFacteur(): Promise<void> {
    this.errorMessage = '';

    const data = {
      nom: this.formFacteur.nom,
      prenom: this.formFacteur.prenom,
      dateNaiss: new Date(this.formFacteur.dateNaiss),
      telephone: this.formFacteur.telephone,
      mail: this.formFacteur.mail,
      dateObtentionPermisB: new Date(this.formFacteur.dateObtentionPermisB),
      sexe: this.formFacteur.sexe,
    };

    try {
      if (this.modeModification && this.facteur) {
        await this.facteurService.updateFacteur(this.facteur.idFacteur, data);
      } else {
        await this.facteurService.addFacteur(data);
      }

      await this.router.navigate(['/facteurs']);
    } catch (error) {
      console.error('Erreur enregistrement facteur :', error);
      this.errorMessage = this.modeModification
        ? 'Impossible de modifier le facteur.'
        : 'Impossible d’ajouter le facteur.';
    }
  }

  remplirFormulaire(facteur: Facteur): void {
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

  private formatDate(date: Date | string): string {
    const d = new Date(date);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
