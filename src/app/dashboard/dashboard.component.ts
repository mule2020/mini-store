import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  users: any[] = [];

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getAllUsers().subscribe((data: any) => {
      this.users = data;
    }, error => {
      console.error('Error fetching users', error);
    });
  }
}
