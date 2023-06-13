import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceService } from '../service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  params: string ="";
  token: any;
  logindata: any;
  email:string="";
  password:string="";

  constructor(
    private route: Router,
    private router: ActivatedRoute,
    private service: ServiceService
  ) {}
  ngOnInit(): void {
    this.router.queryParams.subscribe((queryParams) => {
      let token = queryParams['token'];
      console.log(token,'token');
      this.verifyToken(token);
    });
    
  }

  verifyToken(token: any) {
    this.service.verifyToken(token).subscribe((data) => {
      console.log(data);
      });
  }
// servername first name
  login(){
    let body = {
      email:this.email,
      passwords: this.password,
    };
    console.log(body);
    this.service.login(body).subscribe((data:any) => {
      this.logindata = data;
      console.log(this.logindata);
      if (this.logindata[0].email) {
        alert('Login successfully');
      } else {
        alert('Invalid credentials');
      }
    });
  }
}





