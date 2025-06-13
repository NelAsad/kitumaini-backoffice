import {Component, OnInit} from '@angular/core';
import {RoleService} from '../../services/role.service';
import {Role} from '../../interfaces/role';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CardComponent, ReactiveFormsModule, FormsModule, NgFor],
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  roles: Role[] = [];

  constructor(private roleService: RoleService) {
  }

  ngOnInit(): void {
    this.roleService.all().subscribe(
      roles => this.roles = roles
    );
  }

  delete(id: number): void {
    if (confirm('Are you sure you want to delete this record?')) {
      this.roleService.delete(id).subscribe(
        () => this.roles = this.roles.filter(r => r.id !== id)
      );
    }
  }

}
