import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import type { Facteur, Vehicule } from '../../../../types/electron';

import { FacteurService } from '../../services/facteur';
import { Vehicule as VehiculeService } from '../../services/vehicule';
import { Tournee as TourneeService } from '../../services/tournee';

@Component({
  selector: 'app-tournee',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './tournee.html',
  styleUrl: './tournee.css',
})
export class Tournee implements OnInit {
  private facteurService = inject(FacteurService);
  private vehiculeService = inject(VehiculeService);
  private tourneeService = inject(TourneeService);

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  facteurs: Facteur[] = [];
  vehicules: any[] = [];

  facteurSelectionne: Facteur | null = null;
  vehiculeSelectionne: any | null = null;

  tournee: any | null = null;

  rechercheFacteur = '';
  rechercheVehicule = '';

  modeModification = false;
  loading = false;
  errorMessage = '';

  formTournee = {
    dateDebut: '',
    dateFin: '',
  };

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.modeModification = true;
    }

    await this.loadData();

    if (id) {
      await this.loadTournee(Number(id));
    }
  }

  async loadData(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    try {
      const [facteurs, vehicules] = await Promise.all([
        this.facteurService.getFacteurs(),
        this.vehiculeService.getVehiculesAvecType(),
      ]);

      this.facteurs = facteurs;
      this.vehicules = vehicules;
    } catch (error) {
      console.error('Erreur chargement données tournée :', error);
      this.errorMessage =
        'Impossible de charger les facteurs ou les véhicules.';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async loadTournee(idConduire: number): Promise<void> {
    this.loading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    try {
      const tourneeDepuisNavigation = history.state.tournee;

      if (tourneeDepuisNavigation && tourneeDepuisNavigation.idConduire) {
        this.tournee = tourneeDepuisNavigation;
      } else {
        const tournees = await this.tourneeService.getConduitesCompletes();

        this.tournee = tournees.find(
          (t: any) => t.idConduire === idConduire
        );
      }

      if (!this.tournee) {
        this.errorMessage = 'Tournée introuvable.';
        return;
      }

      this.facteurSelectionne = this.tournee.facteur ?? null;
      this.vehiculeSelectionne = this.tournee.vehicule ?? null;

      this.formTournee = {
        dateDebut: this.formatDateTimeLocal(this.tournee.dateDebut),
        dateFin: this.formatDateTimeLocal(this.tournee.dateFin),
      };
    } catch (error) {
      console.error('Erreur chargement tournée :', error);
      this.errorMessage = 'Impossible de charger la tournée.';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  get facteursFiltres(): Facteur[] {
    const recherche = this.rechercheFacteur.toLowerCase().trim();

    if (!recherche) {
      return this.facteurs;
    }

    return this.facteurs.filter(facteur =>
      facteur.nom.toLowerCase().includes(recherche) ||
      facteur.prenom.toLowerCase().includes(recherche) ||
      facteur.telephone.toLowerCase().includes(recherche) ||
      facteur.mail.toLowerCase().includes(recherche)
    );
  }

  get vehiculesFiltres(): any[] {
    const recherche = this.rechercheVehicule.toLowerCase().trim();

    if (!recherche) {
      return this.vehicules;
    }

    return this.vehicules.filter(vehicule =>
      vehicule.matricule.toLowerCase().includes(recherche) ||
      vehicule.numChassis.toLowerCase().includes(recherche) ||
      String(vehicule.nombrePorte).toLowerCase().includes(recherche) ||
      String(vehicule.type?.nomType ?? '').toLowerCase().includes(recherche)
    );
  }

  choisirFacteur(facteur: Facteur): void {
    if (this.modeModification) {
      return;
    }

    this.facteurSelectionne = facteur;
  }

  choisirVehicule(vehicule: any): void {
    if (this.modeModification) {
      return;
    }

    this.vehiculeSelectionne = vehicule;
  }

  async enregistrerTournee(): Promise<void> {
    this.errorMessage = '';

    if (!this.formTournee.dateDebut || !this.formTournee.dateFin) {
      this.errorMessage = 'Veuillez renseigner la date de début et la date de fin.';
      return;
    }

    const dateDebut = new Date(this.formTournee.dateDebut);
    const dateFin = new Date(this.formTournee.dateFin);

    if (dateFin <= dateDebut) {
      this.errorMessage = 'La date de fin doit être après la date de début.';
      return;
    }

    try {
      if (this.modeModification) {
        if (!this.tournee) {
          this.errorMessage = 'Aucune tournée à modifier.';
          return;
        }

        await this.tourneeService.updateConduireDates(
          this.tournee.idConduire,
          dateDebut,
          dateFin
        );
      } else {
        if (!this.facteurSelectionne || !this.vehiculeSelectionne) {
          this.errorMessage = 'Veuillez choisir un facteur et un véhicule.';
          return;
        }

        await this.tourneeService.addConduire({
          matricule: this.vehiculeSelectionne.matricule,
          idFacteur: this.facteurSelectionne.idFacteur,
          dateDebut,
          dateFin,
        });
      }

      await this.router.navigate(['/tournees']);
    } catch (error) {
      console.error('Erreur enregistrement tournée :', error);

      this.errorMessage = this.modeModification
        ? 'Impossible de modifier la tournée.'
        : 'Impossible d’ajouter la tournée.';
    }
  }

  private formatDateTimeLocal(date: string | Date): string {
    const d = new Date(date);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
}
