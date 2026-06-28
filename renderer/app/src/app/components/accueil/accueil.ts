import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { StatistiquesAccueil } from '../../../../types/electron';
import { StatistiquesService } from '../../services/statistiques';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css',
})
export class Accueil implements OnInit {
  private statistiquesService = inject(StatistiquesService);

  statistiques = signal<StatistiquesAccueil | null>(null);
  chargement = signal(false);
  messageErreur = signal('');

  modules = computed(() => {
    const statistiques = this.statistiques();

    return [
      {
        titre: 'Facteurs',
        description: 'Consulter et gérer les facteurs enregistrés.',
        route: '/facteurs',
        bouton: 'Liste des facteurs',
        badgeClasse: 'text-bg-primary',
        boutonClasse: 'btn btn-primary w-100',
        valeur: statistiques?.nombreFacteurs ?? 0,
      },
      {
        titre: 'Véhicules',
        description: 'Consulter et gérer les véhicules du parc.',
        route: '/vehicules',
        bouton: 'Liste des véhicules',
        badgeClasse: 'text-bg-success',
        boutonClasse: 'btn btn-success w-100',
        valeur: statistiques?.nombreVehicules ?? 0,
      },
      {
        titre: 'Tournées',
        description: 'Associer un facteur à un véhicule sur une période.',
        route: '/tournees',
        bouton: 'Liste des tournées',
        badgeClasse: 'text-bg-info',
        boutonClasse: 'btn btn-info w-100 text-white',
        valeur: statistiques?.nombreTournees ?? 0,
      },
      {
        titre: 'Dégâts',
        description: 'Nombre de dégâts déclarés sur les tournées.',
        route: '/tournees',
        bouton: 'Voir les tournées',
        badgeClasse: 'text-bg-warning',
        boutonClasse: 'btn btn-warning w-100',
        valeur: statistiques?.nombreDegats ?? 0,
      },
    ];
  });

  ngOnInit(): void {
    void this.chargerStatistiques();
  }

  async chargerStatistiques(): Promise<void> {
    this.chargement.set(true);
    this.messageErreur.set('');

    try {
      const statistiques =
        await this.statistiquesService.getStatistiquesAccueil();
      this.statistiques.set(statistiques);
    } catch (error) {
      console.error('Erreur chargement statistiques :', error);
      this.messageErreur.set(
        "Les statistiques seront visibles lorsque l'application est lancée via Electron."
      );
    } finally {
      this.chargement.set(false);
    }
  }
}
