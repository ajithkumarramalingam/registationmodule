import { Component,OnInit } from '@angular/core';
import { ServiceService } from '../service.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signup:any;
  data:any;
  email:string="";
  password:string="";
  username:string="";
  address:string="";
  state:string | undefined="";
  city:string="";
  dropdowdata:any;
  dropdowdata1:any;
  
  
  constructor(private service:ServiceService) { }
  ngOnInit(): void {
  this.dropdown();
  this.dropdown1();
  }
 
  insertData(){
    let data = {
      email:this.email,
      passwords:this.password,
      username:this.username,
      address:this.address,
      state:this.state,
      city:this.city,

    };
    console.log(data.city)
    this.service.insertData(data).subscribe((body)=>{
      this.signup=body;
      if(this.signup.length>0){
        alert('User already exists')
      }
      else{
        alert('User registered successfully')
      }
    })
  }
//city dropdown
  dropdown(){
    this.service.dropdown().subscribe((res)=>{
      this.dropdowdata=res;
    })
  }

  onchange(event:any){
    console.log(event,'----------------');
    this.city = event.value;
  }
//state dropdown
  dropdown1(){
    this.service.dropdown1().subscribe((res)=>{
      this.dropdowdata1=res;
    })
  }

  onchange1(event:any){
    console.log(event,'----------------');
    this.state = event.value;
  }
}
